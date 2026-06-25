export type TaskStatus =
  | "pendiente"
  | "en_proceso"
  | "en_revision"
  | "finalizada"
  | "vencida"
  | "pausada";

export type TaskPriority = "baja" | "media" | "alta";

export interface Task {
  id: string;
  project_id?: string | null;
  project_name: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: TaskStatus;
  priority: TaskPriority;
  responsible?: string;
  tags: string[] | string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  finished_at?: string | null;
}

export type TaskPayload = Omit<Task, "id" | "created_at" | "updated_at" | "finished_at">;

export interface TaskFilters {
  q?: string;
  project?: string;
  status?: string;
  priority?: string;
  start?: string;
  end?: string;
}

export interface TaskSummary {
  total: number;
  pending: number;
  inProgress: number;
  inReview: number;
  completed: number;
  overdue: number;
  projects: number;
}
