import type { TaskPriority, TaskStatus } from "../types/task";
import { isOverdue } from "./dates";

export const statusLabels: Record<TaskStatus, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  en_revision: "En revision",
  finalizada: "Finalizada",
  vencida: "Vencida",
  pausada: "Pausada",
};

export const priorityLabels: Record<TaskPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export const getVisualStatus = (task: { end_date?: string; status: TaskStatus }) =>
  isOverdue(task.end_date, task.status) ? "vencida" : task.status;

export const statusClasses: Record<TaskStatus, string> = {
  pendiente: "bg-sky-50 text-sky-700 border-sky-100",
  en_proceso: "bg-cyan-50 text-cyan-700 border-cyan-100",
  en_revision: "bg-amber-50 text-amber-700 border-amber-100",
  finalizada: "bg-emerald-50 text-emerald-700 border-emerald-100",
  vencida: "bg-red-50 text-red-700 border-red-100",
  pausada: "bg-slate-100 text-slate-700 border-slate-200",
};

export const priorityClasses: Record<TaskPriority, string> = {
  baja: "bg-emerald-50 text-emerald-700",
  media: "bg-amber-50 text-amber-700",
  alta: "bg-red-50 text-red-700",
};
