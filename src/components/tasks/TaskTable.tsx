import { Check, Eye, Pencil, Trash2 } from "lucide-react";
import type { Task } from "../../types/task";
import { formatDate } from "../../utils/dates";
import { getVisualStatus } from "../../utils/status";
import { Button } from "../ui/Button";
import { TaskBadges } from "./TaskBadges";

interface TaskTableProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onFinish: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskTable({ tasks, onView, onEdit, onFinish, onDelete }: TaskTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-banbif-border bg-white shadow-soft min-[769px]:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-banbif-muted">
          <tr>
            <th className="px-4 py-3">Titulo</th>
            <th className="px-4 py-3">Proyecto</th>
            <th className="px-4 py-3">Responsable</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Inicio</th>
            <th className="px-4 py-3">Fin</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-banbif-border">
          {tasks.map((task) => (
            <tr key={task.id} className={getVisualStatus(task) === "vencida" ? "bg-red-50/40" : ""}>
              <td className="px-4 py-4 font-bold text-banbif-text">{task.title}</td>
              <td className="px-4 py-4 text-banbif-muted">{task.project_name}</td>
              <td className="px-4 py-4 text-banbif-muted">{task.responsible || "-"}</td>
              <td className="px-4 py-4"><TaskBadges task={task} /></td>
              <td className="px-4 py-4 text-banbif-muted">{formatDate(task.start_date)}</td>
              <td className="px-4 py-4 text-banbif-muted">{formatDate(task.end_date)}</td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <IconButton label="Ver detalle" onClick={() => onView(task)} icon={<Eye className="h-4 w-4" />} />
                  <IconButton label="Editar" onClick={() => onEdit(task)} icon={<Pencil className="h-4 w-4" />} />
                  <IconButton label="Finalizar" onClick={() => onFinish(task)} icon={<Check className="h-4 w-4" />} disabled={task.status === "finalizada"} />
                  <IconButton label="Eliminar" onClick={() => onDelete(task)} icon={<Trash2 className="h-4 w-4" />} danger />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IconButton({ label, icon, danger, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; icon: React.ReactNode; danger?: boolean }) {
  return (
    <button
      title={label}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-lg border border-banbif-border transition ${danger ? "text-red-600 hover:bg-red-50" : "text-banbif-muted hover:bg-slate-50 hover:text-banbif-text"}`}
      {...props}
    >
      {icon}
    </button>
  );
}
