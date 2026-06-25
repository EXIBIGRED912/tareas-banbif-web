const ALLOWED_ORIGINS = new Set([
  "https://tareas-banbif-web.pages.dev",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5290",
]);

const encoder = new TextEncoder();

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const headers = {
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

function ok(data, message = "OK", headers = {}) {
  return json({ ok: true, message, data }, 200, headers);
}

function fail(message, status = 400, headers = {}) {
  return json({ ok: false, message, data: null }, status, headers);
}

function base64UrlEncode(value) {
  const bytes = typeof value === "string" ? encoder.encode(value) : value;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(text));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return diff === 0;
}

async function signToken(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = base64UrlEncode(await hmacSha256(signingInput, secret));
  return `${signingInput}.${signature}`;
}

async function verifyToken(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Token invalido");
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const expected = base64UrlEncode(await hmacSha256(`${encodedHeader}.${encodedPayload}`, secret));
  if (!constantTimeEqual(signature, expected)) {
    throw new Error("Token invalido");
  }

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch {
    throw new Error("Token invalido");
  }

  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp < now) {
    throw new Error("Sesion expirada");
  }

  return payload;
}

async function requireAuth(request, env) {
  const authorization = request.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) {
    throw new Error("No autenticado");
  }
  const token = authorization.slice("Bearer ".length).trim();
  if (!env.JWT_SECRET) {
    throw new Error("Autenticacion no configurada");
  }
  return verifyToken(token, env.JWT_SECRET);
}

function authConfigured(env) {
  return Boolean(env.AUTH_USERNAME && env.AUTH_PASSWORD_HASH && env.AUTH_PASSWORD_PEPPER && env.JWT_SECRET);
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

const parseTags = (tags) => {
  if (Array.isArray(tags)) return JSON.stringify(tags);
  if (!tags) return JSON.stringify([]);
  try {
    JSON.parse(tags);
    return tags;
  } catch {
    return JSON.stringify(String(tags).split(",").map((tag) => tag.trim()).filter(Boolean));
  }
};

const taskFields = [
  "project_id",
  "project_name",
  "title",
  "description",
  "start_date",
  "end_date",
  "status",
  "priority",
  "responsible",
  "tags",
  "notes",
];

const allowedPriorities = new Set(["baja", "media", "alta"]);
const allowedStatuses = new Set(["pendiente", "en_proceso", "en_revision", "finalizada", "vencida", "pausada"]);

function validateTask(body) {
  if (!body.project_name || !body.title || !body.start_date || !body.end_date) {
    return "Proyecto, titulo, fecha inicio y fecha fin son obligatorios.";
  }
  if (body.end_date < body.start_date) {
    return "La fecha fin no puede ser menor que la fecha inicio.";
  }
  if (body.priority && !allowedPriorities.has(body.priority)) {
    return "La prioridad debe ser baja, media o alta.";
  }
  if (body.status && !allowedStatuses.has(body.status)) {
    return "El estado seleccionado no es valido.";
  }
  return "";
}

async function login(request, env, corsHeaders) {
  if (!authConfigured(env)) {
    return fail("Autenticacion no configurada", 503, corsHeaders);
  }

  const body = await readBody(request);
  if (!body.username || !body.password) {
    return fail("Usuario y contrasena son obligatorios", 422, corsHeaders);
  }

  const passwordHash = await sha256Hex(`${body.password}${env.AUTH_PASSWORD_PEPPER}`);
  const validUser = constantTimeEqual(String(body.username), String(env.AUTH_USERNAME));
  const validPassword = constantTimeEqual(passwordHash, String(env.AUTH_PASSWORD_HASH));
  if (!validUser || !validPassword) {
    return fail("Usuario o contrasena incorrectos", 401, corsHeaders);
  }

  const now = Math.floor(Date.now() / 1000);
  const user = {
    username: env.AUTH_USERNAME,
    name: "Abner",
    role: "Administrador",
  };
  const token = await signToken(
    {
      sub: env.AUTH_USERNAME,
      username: env.AUTH_USERNAME,
      role: user.role,
      iat: now,
      exp: now + 8 * 60 * 60,
    },
    env.JWT_SECRET,
  );

  return json({ ok: true, message: "Login correcto", token, user }, 200, corsHeaders);
}

async function health(env, corsHeaders) {
  let tables = [];
  try {
    const result = await env.DB.prepare(
      "SELECT name FROM sqlite_schema WHERE type = 'table' ORDER BY name ASC",
    ).all();
    tables = result.results || [];
  } catch {
    tables = [];
  }

  return json(
    {
      ok: true,
      message: "Worker conectado correctamente a Cloudflare D1",
      database: "tareas-banbif-db",
      tables,
      authConfigured: authConfigured(env),
    },
    200,
    corsHeaders,
  );
}

async function listTasks(env, url, corsHeaders) {
  let sql = "SELECT * FROM tasks WHERE 1=1";
  const binds = [];
  const status = url.searchParams.get("status");
  const project = url.searchParams.get("project");
  const priority = url.searchParams.get("priority");
  const q = url.searchParams.get("q");
  if (status) {
    sql += " AND status = ?";
    binds.push(status);
  }
  if (project) {
    sql += " AND project_name = ?";
    binds.push(project);
  }
  if (priority) {
    sql += " AND priority = ?";
    binds.push(priority);
  }
  if (q) {
    sql += " AND (title LIKE ? OR project_name LIKE ? OR responsible LIKE ?)";
    binds.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  sql += " ORDER BY end_date ASC, created_at DESC";
  const result = await env.DB.prepare(sql).bind(...binds).all();
  const tasks = result.results || [];
  return json({ ok: true, message: "Tareas listadas", data: tasks, tasks }, 200, corsHeaders);
}

async function createTask(env, request, corsHeaders) {
  const body = await readBody(request);
  const validationError = validateTask(body);
  if (validationError) return fail(validationError, 422, corsHeaders);
  const task = {
    id: crypto.randomUUID(),
    project_id: body.project_id || null,
    project_name: body.project_name,
    title: body.title,
    description: body.description || "",
    start_date: body.start_date,
    end_date: body.end_date,
    status: body.status || "pendiente",
    priority: body.priority || "media",
    responsible: body.responsible || "",
    tags: parseTags(body.tags),
    notes: body.notes || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    finished_at: body.status === "finalizada" ? new Date().toISOString() : null,
  };
  await env.DB.prepare(
    `INSERT INTO tasks (id, project_id, project_name, title, description, start_date, end_date, status, priority, responsible, tags, notes, created_at, updated_at, finished_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(...Object.values(task)).run();
  return json({ ok: true, message: "Tarea creada", data: task, task }, 200, corsHeaders);
}

async function updateTask(env, id, request, corsHeaders) {
  const body = await readBody(request);
  const existing = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first();
  if (!existing) return fail("Tarea no encontrada", 404, corsHeaders);
  const next = { ...existing, ...body };
  const validationError = validateTask(next);
  if (validationError) return fail(validationError, 422, corsHeaders);
  next.tags = parseTags(next.tags);
  next.updated_at = new Date().toISOString();
  next.finished_at = next.status === "finalizada" ? next.finished_at || new Date().toISOString() : null;
  const assignments = taskFields.map((field) => `${field} = ?`).join(", ");
  await env.DB.prepare(`UPDATE tasks SET ${assignments}, updated_at = ?, finished_at = ? WHERE id = ?`)
    .bind(...taskFields.map((field) => next[field] ?? null), next.updated_at, next.finished_at, id)
    .run();
  const updated = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first();
  return json({ ok: true, message: "Tarea actualizada", data: updated, task: updated }, 200, corsHeaders);
}

async function finishTask(env, id, corsHeaders) {
  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE tasks SET status = 'finalizada', finished_at = ?, updated_at = ? WHERE id = ?")
    .bind(now, now, id)
    .run();
  const updated = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first();
  if (!updated) return fail("Tarea no encontrada", 404, corsHeaders);
  return json({ ok: true, message: "Tarea finalizada", data: updated, task: updated }, 200, corsHeaders);
}

async function deleteTask(env, id, corsHeaders) {
  await env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();
  return json({ ok: true, message: "Tarea eliminada correctamente", id, data: { id } }, 200, corsHeaders);
}

async function dashboardSummary(env, corsHeaders) {
  const result = await env.DB.prepare("SELECT * FROM tasks").all();
  const tasks = result.results || [];
  const today = new Date().toISOString().slice(0, 10);
  return ok({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pendiente").length,
    inProgress: tasks.filter((task) => task.status === "en_proceso").length,
    inReview: tasks.filter((task) => task.status === "en_revision").length,
    completed: tasks.filter((task) => task.status === "finalizada").length,
    overdue: tasks.filter((task) => task.end_date < today && task.status !== "finalizada").length,
    projects: new Set(tasks.map((task) => task.project_name)).size,
  }, "Resumen calculado", corsHeaders);
}

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/^\/api/, "");
      const taskMatch = path.match(/^\/tasks\/([^/]+)$/);
      const finishMatch = path.match(/^\/tasks\/([^/]+)\/finish$/);

      if (path === "/health" && request.method === "GET") return health(env, corsHeaders);
      if (path === "/auth/login" && request.method === "POST") return login(request, env, corsHeaders);

      let authPayload;
      try {
        authPayload = await requireAuth(request, env);
      } catch (error) {
        const message = error.message === "Sesion expirada" ? "Sesion expirada" : error.message === "No autenticado" ? "No autenticado" : "Token invalido";
        return fail(message, 401, corsHeaders);
      }

      if (path === "/auth/me" && request.method === "GET") {
        return json({
          ok: true,
          message: "Sesion valida",
          user: {
            username: authPayload.username,
            name: "Abner",
            role: authPayload.role || "Administrador",
          },
        }, 200, corsHeaders);
      }
      if (path === "/tasks" && request.method === "GET") return listTasks(env, url, corsHeaders);
      if (path === "/tasks" && request.method === "POST") return createTask(env, request, corsHeaders);
      if (taskMatch && request.method === "PUT") return updateTask(env, taskMatch[1], request, corsHeaders);
      if (taskMatch && request.method === "DELETE") return deleteTask(env, taskMatch[1], corsHeaders);
      if (finishMatch && request.method === "PUT") return finishTask(env, finishMatch[1], corsHeaders);
      if (path === "/dashboard/summary" && request.method === "GET") return dashboardSummary(env, corsHeaders);

      return fail("Endpoint no encontrado", 404, corsHeaders);
    } catch (error) {
      return fail(error.message || "Error interno de la API", 500, corsHeaders);
    }
  },
};
