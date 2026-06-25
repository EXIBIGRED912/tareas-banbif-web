import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Project } from "../../types/project";
import type { Task, TaskPayload, TaskPriority, TaskStatus } from "../../types/task";
import { parseTags } from "../../utils/formatters";
import { Button } from "../ui/Button";

interface TaskFormDrawerProps {
  open: boolean;
  task?: Task | null;
  projects: Project[];
  onClose: () => void;
  onSave: (payload: TaskPayload, id?: string) => Promise<void>;
}

const blankTask: TaskPayload = {
  project_name: "",
  title: "",
  description: "",
  responsible: "",
  priority: "media",
  status: "pendiente",
  start_date: "",
  end_date: "",
  tags: [],
  notes: "",
};

const allowedPriorities = ["baja", "media", "alta"];
const allowedStatuses = ["pendiente", "en_proceso", "en_revision", "finalizada", "vencida", "pausada"];

export function TaskFormDrawer({ open, task, projects, onClose, onSave }: TaskFormDrawerProps) {
  const [form, setForm] = useState<TaskPayload>(blankTask);
  const [tagsText, setTagsText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const title = task?.id ? "Editar tarea" : "Nueva tarea";

  useEffect(() => {
    if (!open) return;
    if (task) {
      setForm({
        project_id: task.project_id,
        project_name: task.project_name,
        title: task.title,
        description: task.description || "",
        responsible: task.responsible || "",
        priority: task.priority,
        status: task.status,
        start_date: task.start_date,
        end_date: task.end_date,
        tags: parseTags(task.tags),
        notes: task.notes || "",
      });
      setTagsText(parseTags(task.tags).join(", "));
    } else {
      setForm(blankTask);
      setTagsText("");
    }
    setError("");
  }, [open, task]);

  const projectNames = useMemo(() => projects.map((project) => project.name), [projects]);

  const update = (field: keyof TaskPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.project_name || !form.title || !form.start_date || !form.end_date) {
      setError("Completa proyecto, titulo, fecha inicio y fecha fin.");
      return;
    }
    if (form.end_date < form.start_date) {
      setError("La fecha fin no puede ser menor que la fecha inicio.");
      return;
    }
    if (!allowedPriorities.includes(form.priority)) {
      setError("La prioridad debe ser baja, media o alta.");
      return;
    }
    if (!allowedStatuses.includes(form.status)) {
      setError("El estado seleccionado no es valido.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({ ...form, tags: tagsText.split(",").map((tag) => tag.trim()).filter(Boolean) }, task?.id || undefined);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la tarea.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button className="absolute inset-0 bg-banbif-ink/40" onClick={onClose} aria-label="Cerrar formulario" />
      <aside className="absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-soft min-[769px]:w-[460px]">
        <div className="flex items-center justify-between border-b border-banbif-border px-5 py-4">
          <div>
            <h2 className="text-lg font-black">{title}</h2>
            <p className="text-xs text-banbif-muted">Gestiona la informacion operativa</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="flex-1 space-y-4 overflow-y-auto p-5">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
          <Field label="Proyecto *">
            <input list="project-options" value={form.project_name} onChange={(e) => update("project_name", e.target.value)} className="input" placeholder="Seleccionar proyecto" />
            <datalist id="project-options">
              {projectNames.map((name) => <option key={name} value={name} />)}
            </datalist>
          </Field>
          <Field label="Titulo *"><input value={form.title} onChange={(e) => update("title", e.target.value)} className="input" placeholder="Escribe el titulo" /></Field>
          <Field label="Descripcion"><textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="input min-h-24 resize-none" placeholder="Describe la tarea" /></Field>
          <Field label="Responsable"><input value={form.responsible} onChange={(e) => update("responsible", e.target.value)} className="input" placeholder="Nombre del responsable" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prioridad *">
              <select value={form.priority} onChange={(e) => update("priority", e.target.value as TaskPriority)} className="input">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </Field>
            <Field label="Estado *">
              <select value={form.status} onChange={(e) => update("status", e.target.value as TaskStatus)} className="input">
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En proceso</option>
                <option value="en_revision">En revision</option>
                <option value="finalizada">Finalizada</option>
                <option value="vencida">Vencida</option>
                <option value="pausada">Pausada</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha inicio *"><input type="date" value={form.start_date} onChange={(e) => update("start_date", e.target.value)} className="input" /></Field>
            <Field label="Fecha fin *"><input type="date" value={form.end_date} onChange={(e) => update("end_date", e.target.value)} className="input" /></Field>
          </div>
          <Field label="Etiquetas"><input value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="input" placeholder="backend, pagos, core" /></Field>
          <Field label="Notas"><textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} className="input min-h-20 resize-none" placeholder="Notas adicionales" /></Field>
        </form>
        <div className="flex justify-end gap-3 border-t border-banbif-border p-4">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => document.querySelector<HTMLFormElement>("aside form")?.requestSubmit()} disabled={saving}>{saving ? "Guardando..." : "Guardar tarea"}</Button>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-banbif-text">{label}</span>
      {children}
    </label>
  );
}
