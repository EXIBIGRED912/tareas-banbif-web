import { ApiError, type ApiEnvelope } from "../types/api";

const DEFAULT_API_URL = "https://wandering-violet-87c6.motelo108.workers.dev/api";
const REQUEST_TIMEOUT_MS = 15000;
export const HAS_CONFIGURED_API_URL = Boolean(import.meta.env.VITE_API_URL);

export const API_BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, "");

if (!HAS_CONFIGURED_API_URL) {
  console.error(
    "VITE_API_URL no esta configurada. Usando URL por defecto solo para desarrollo.",
  );
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  skipAuth?: boolean;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  let payload: ApiEnvelope<T> | T;

  try {
    payload = contentType.includes("application/json")
      ? ((await response.json()) as ApiEnvelope<T> | T)
      : ({ message: await response.text() } as ApiEnvelope<T>);
  } catch (error) {
    console.error("Respuesta JSON invalida desde la API", error);
    throw new ApiError("La API devolvio una respuesta invalida.", response.status);
  }

  if (!response.ok) {
    const message =
      (payload as ApiEnvelope<T>).message ||
      "No pudimos completar la solicitud. Intenta nuevamente.";
    throw new ApiError(message, response.status);
  }

  if (
    payload &&
    typeof payload === "object" &&
    "ok" in payload &&
    "data" in payload
  ) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  const token = sessionStorage.getItem("auth_token");
  if (token && !options.skipAuth) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body,
      signal: controller.signal,
    });
    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_user");
        window.dispatchEvent(new CustomEvent("auth:expired", {
          detail: { message: "Tu sesion expiro, vuelve a iniciar sesion" },
        }));
      }
      throw error;
    }
    console.error("Error tecnico llamando a la API", error);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("La API tardo demasiado en responder. Intenta nuevamente.", 0);
    }
    throw new ApiError(
      "No se pudo conectar con la API de tareas. Revisa tu conexion o la variable VITE_API_URL.",
      0,
    );
  } finally {
    window.clearTimeout(timeout);
  }
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body: unknown, options: RequestOptions = {}) => apiRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};
