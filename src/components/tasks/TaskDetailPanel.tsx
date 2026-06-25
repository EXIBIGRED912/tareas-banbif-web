import { Check, Copy, Paperclip, Pencil, Trash2, X } from "lucide-react";
import type { Task } from "../../types/task";
import { formatDate } from "../../utils/dates";
import { parseTags } from "../../utils/formatters";
import { TaskBadges } from "./TaskBadges";
import { Button } from "../ui/Button";

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onFinish: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDuplicate: (task: Task) => void;
}

export function TaskDetailPanel({ task, onClose, onEdit, onFinish, onDelete, onDuplicate }: TaskDetailPanelProps) {
  if (!task) return null;
  return (
    <div className="fixed inset-0 z-40">
      <button className="absolute inset-0 bg-banbif-ink/40" onClick={onClose} aria-label="Cerrar detalle" />
      <aside className="absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-soft min-[769px]:w-[440px]">
        <div className="flex items-start justify-between border-b border-banbif-border px-5 py-4">
          <div>
            <div className="mb-3"><TaskBadges task={task} /></div>
            <h2 className="text-xl font-black">{task.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <Info label="Proyecto" value={task.project_name} />
          <Info label="Responsable" value={task.responsible || "-"} />
          <div className="grid grid-cols-2 gap-3">
            <Info label="Inicio" value={formatDate(task.start_date)} />
            <Info label="Fin" value={formatDate(task.end_date)} />
          </div>
          <Info label="Descripcion" value={task.description || "Sin descripcion registrada."} />
          <div>
            <h3 className="text-xs font-black uppercase text-banbif-muted">Etiquetas</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {parseTags(task.tags).length ? parseTags(task.tags).map((tag) => <span key={tag} className="rounded-md bg-sky-50 px-2 py-1 text-xs font-bold text-sky-700">{tag}</span>) : <span className="text-sm text-banbif-muted">Sin etiquetas</span>}
            </div>
          </div>
          <Info label="Notas" value={task.notes || "Sin notas adicionales."} />
          <section className="rounded-xl border border-banbif-border p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-black"><Paperclip className="h-4 w-4" /> Adjuntos</h3>
            <p className="text-sm text-banbif-muted">La subida de adjuntos queda preparada para conectar con /api/attachments.</p>
          </section>
          <section className="rounded-xl border border-banbif-border p-4">
            <h3 className="text-sm font-black">Historial de cambios</h3>
            <div className="mt-3 space-y-3 text-sm text-banbif-muted">
              <p>Tarea creada {formatDate(task.created_at)}</p>
              {task.updated_at && <p>Ultima actualizacion {formatDate(task.updated_at)}</p>}
              {task.finished_at && <p>Finalizada {formatDate(task.finished_at)}</p>}
            </div>
          </section>
        </div>
        <div className="grid grid-cols-2 gap-2 border-t border-banbif-border p-4 md:grid-cols-4">
          <Button variant="secondary" onClick={() => onEdit(task)} icon={<Pencil className="h-4 w-4" />}>Editar</Button>
          <Button variant="secondary" onClick={() => onFinish(task)} icon={<Check className="h-4 w-4" />} disabled={task.status === "finalizada"}>Finalizar</Button>
          <Button variant="secondary" onClick={() => onDuplicate(task)} icon={<Copy className="h-4 w-4" />}>Duplicar</Button>
          <Button variant="danger" onClick={() => onDelete(task)} icon={<Trash2 className="h-4 w-4" />}>Eliminar</Button>
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase text-banbif-muted">{label}</h3>
      <p className="mt-1 text-sm font-semibold text-banbif-text">{value}</p>
    </div>
  );
}
