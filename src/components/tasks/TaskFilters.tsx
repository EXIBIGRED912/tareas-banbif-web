import { Filter, Search, X } from "lucide-react";
import type { TaskFilters } from "../../types/task";
import type { Project } from "../../types/project";
import { Button } from "../ui/Button";

interface TaskFiltersProps {
  filters: TaskFilters;
  projects: Project[];
  onChange: (filters: TaskFilters) => void;
}

export function TaskFilters({ filters, projects, onChange }: TaskFiltersProps) {
  const update = (key: keyof TaskFilters, value: string) => onChange({ ...filters, [key]: value });
  return (
    <div className="grid gap-3 rounded-xl border border-banbif-border bg-white p-3 shadow-soft md:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
      <label className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-banbif-muted" />
        <input
          value={filters.q || ""}
          onChange={(event) => update("q", event.target.value)}
          placeholder="Buscar tarea..."
          className="h-10 w-full rounded-lg border border-banbif-border pl-10 pr-3 text-sm outline-none focus:border-banbif-blue"
        />
      </label>
      <select value={filters.project || ""} onChange={(event) => update("project", event.target.value)} className="h-10 rounded-lg border border-banbif-border px-3 text-sm">
        <option value="">Todos los proyectos</option>
        {projects.map((project) => (
          <option key={project.id} value={project.name}>{project.name}</option>
        ))}
      </select>
      <select value={filters.status || ""} onChange={(event) => update("status", event.target.value)} className="h-10 rounded-lg border border-banbif-border px-3 text-sm">
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="en_proceso">En proceso</option>
        <option value="en_revision">En revision</option>
        <option value="finalizada">Finalizada</option>
      </select>
      <select value={filters.priority || ""} onChange={(event) => update("priority", event.target.value)} className="h-10 rounded-lg border border-banbif-border px-3 text-sm">
        <option value="">Todas las prioridades</option>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>
      <Button variant="secondary" onClick={() => onChange({})} icon={filters.q || filters.project || filters.status || filters.priority ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}>
        Limpiar
      </Button>
    </div>
  );
}
