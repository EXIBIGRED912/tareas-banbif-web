import { api } from "./api";
import type { Task, TaskFilters, TaskPayload, TaskSummary } from "../types/task";
import type { ApiEnvelope } from "../types/api";

const buildQuery = (filters?: TaskFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const taskService = {
  list: async (filters?: TaskFilters) => {
    const response = await api.get<Task[] | ApiEnvelope<Task[]>>(`/tasks${buildQuery(filters)}`);
    if (Array.isArray(response)) return response;
    return response.data || response.tasks || [];
  },
  create: async (task: TaskPayload) => {
    const response = await api.post<Task | ApiEnvelope<Task>>("/tasks", task);
    if ("id" in response) return response;
    return response.data || response.task || (response as Task);
  },
  update: async (id: string, task: Partial<TaskPayload>) => {
    const response = await api.put<Task | ApiEnvelope<Task>>(`/tasks/${id}`, task);
    if ("id" in response) return response;
    return response.data || response.task || (response as Task);
  },
  remove: (id: string) => api.delete<{ id: string } | ApiEnvelope<{ id: string }>>(`/tasks/${id}`),
  finish: async (task: Task) => {
    try {
      const response = await api.put<Task | ApiEnvelope<Task>>(`/tasks/${task.id}/finish`);
      if ("id" in response) return response;
      return response.data || response.task || (response as Task);
    } catch {
      const response = await api.put<Task | ApiEnvelope<Task>>(`/tasks/${task.id}`, {
        project_id: task.project_id,
        project_name: task.project_name,
        title: task.title,
        description: task.description || "",
        start_date: task.start_date,
        end_date: task.end_date,
        status: "finalizada",
        priority: task.priority,
        responsible: task.responsible || "",
        tags: task.tags,
        notes: task.notes || "",
      });
      if ("id" in response) return response;
      return response.data || response.task || (response as Task);
    }
  },
  summary: async () => {
    const response = await api.get<TaskSummary | ApiEnvelope<TaskSummary>>("/dashboard/summary");
    if ("total" in response) return response;
    return response.data || (response as unknown as TaskSummary);
  },
};
