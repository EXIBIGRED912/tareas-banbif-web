const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const ok = (data, message = "OK") => json({ ok: true, message, data });
const fail = (message, status = 400) => json({ ok: false, message, data: null }, status);

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

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function listTasks(env, url) {
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
  return ok(result.results || []);
}

async function createTask(env, request) {
  const body = await readBody(request);
  const validationError = validateTask(body);
  if (validationError) return fail(validationError, 422);
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
  return json({ ok: true, message: "Tarea creada", data: task, task });
}

async function updateTask(env, id, request) {
  const body = await readBody(request);
  const existing = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first();
  if (!existing) return fail("Tarea no encontrada", 404);
  const next = { ...existing, ...body };
  const validationError = validateTask(next);
  if (validationError) return fail(validationError, 422);
  next.tags = parseTags(next.tags);
  next.updated_at = new Date().toISOString();
  next.finished_at = next.status === "finalizada" ? next.finished_at || new Date().toISOString() : null;
  const assignments = taskFields.map((field) => `${field} = ?`).join(", ");
  await env.DB.prepare(`UPDATE tasks SET ${assignments}, updated_at = ?, finished_at = ? WHERE id = ?`)
    .bind(...taskFields.map((field) => next[field] ?? null), next.updated_at, next.finished_at, id)
    .run();
  const updated = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first();
  return ok(updated, "Tarea actualizada");
}

async function finishTask(env, id) {
  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE tasks SET status = 'finalizada', finished_at = ?, updated_at = ? WHERE id = ?")
    .bind(now, now, id)
    .run();
  const updated = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first();
  if (!updated) return fail("Tarea no encontrada", 404);
  return ok(updated, "Tarea finalizada");
}

async function deleteTask(env, id) {
  await env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();
  return ok({ id }, "Tarea eliminada");
}

async function dashboardSummary(env) {
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
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/^\/api/, "");
      const taskMatch = path.match(/^\/tasks\/([^/]+)$/);
      const finishMatch = path.match(/^\/tasks\/([^/]+)\/finish$/);

      if (path === "/health") return ok({ status: "healthy" });
      if (path === "/tasks" && request.method === "GET") return listTasks(env, url);
      if (path === "/tasks" && request.method === "POST") return createTask(env, request);
      if (taskMatch && request.method === "PUT") return updateTask(env, taskMatch[1], request);
      if (taskMatch && request.method === "DELETE") return deleteTask(env, taskMatch[1]);
      if (finishMatch && request.method === "PUT") return finishTask(env, finishMatch[1]);
      if (path === "/dashboard/summary" && request.method === "GET") return dashboardSummary(env);
      if (path === "/projects" && request.method === "GET") {
        const result = await env.DB.prepare("SELECT * FROM projects ORDER BY name ASC").all();
        return ok(result.results || []);
      }
      return fail("Endpoint no encontrado", 404);
    } catch (error) {
      return fail(error.message || "Error interno de la API", 500);
    }
  },
};
