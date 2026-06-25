import { Check, Eye, Pencil, Trash2 } from "lucide-react";
import type { Task } from "../../types/task";
import { formatDate } from "../../utils/dates";
import { getVisualStatus } from "../../utils/status";
import { Button } from "../ui/Button";
import { TaskBadges } from "./TaskBadges";

interface TaskCardsProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onFinish: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCards({ tasks, onView, onEdit, onFinish, onDelete }: TaskCardsProps) {
  return (
    <div className="grid gap-3 min-[769px]:hidden">
      {tasks.map((task) => (
        <article key={task.id} className={`rounded-xl border bg-white p-4 shadow-soft ${getVisualStatus(task) === "vencida" ? "border-red-200" : "border-banbif-border"}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-black text-banbif-text">{task.title}</h3>
              <p className="mt-1 text-sm text-banbif-muted">{task.project_name}</p>
            </div>
            <TaskBadges task={task} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-banbif-muted">
            <span>Responsable: <b className="text-banbif-text">{task.responsible || "-"}</b></span>
            <span>Fin: <b className="text-banbif-text">{formatDate(task.end_date)}</b></span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            <Button variant="secondary" className="px-2" onClick={() => onView(task)}><Eye className="h-4 w-4" /></Button>
            <Button variant="secondary" className="px-2" onClick={() => onEdit(task)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="secondary" className="px-2" onClick={() => onFinish(task)} disabled={task.status === "finalizada"}><Check className="h-4 w-4" /></Button>
            <Button variant="danger" className="px-2" onClick={() => onDelete(task)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </article>
      ))}
    </div>
  );
}
