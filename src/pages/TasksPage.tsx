import { Plus } from "lucide-react";
import { TaskCards } from "../components/tasks/TaskCards";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { TaskTable } from "../components/tasks/TaskTable";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingState } from "../components/ui/LoadingState";
import type { Project } from "../types/project";
import type { Task, TaskFilters as Filters } from "../types/task";
import { PageTitle } from "./DashboardPage";

interface TasksPageProps {
  tasks: Task[];
  projects: Project[];
  filters: Filters;
  loading: boolean;
  error: string;
  usingDemo: boolean;
  onFiltersChange: (filters: Filters) => void;
  onNewTask: () => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onFinish: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TasksPage(props: TasksPageProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <PageTitle title="Lista de tareas" subtitle="Gestiona todas las tareas de tus proyectos" />
        <Button className="hidden min-[769px]:inline-flex" onClick={props.onNewTask} icon={<Plus className="h-4 w-4" />}>Nueva tarea</Button>
      </div>
      {props.usingDemo && <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm font-semibold text-sky-800">Mostrando tareas demo porque la API no devolvio registros.</div>}
      {props.error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">{props.error}</div>}
      <TaskFilters filters={props.filters} projects={props.projects} onChange={props.onFiltersChange} />
      {props.loading ? <LoadingState /> : props.tasks.length === 0 ? (
        <EmptyState title="No hay tareas para mostrar" description="Ajusta los filtros o registra una nueva tarea." actionLabel="Nueva tarea" onAction={props.onNewTask} />
      ) : (
        <>
          <TaskTable tasks={props.tasks} onView={props.onView} onEdit={props.onEdit} onFinish={props.onFinish} onDelete={props.onDelete} />
          <TaskCards tasks={props.tasks} onView={props.onView} onEdit={props.onEdit} onFinish={props.onFinish} onDelete={props.onDelete} />
        </>
      )}
      <button onClick={props.onNewTask} className="fixed bottom-20 right-5 z-20 grid h-14 w-14 place-items-center rounded-full bg-banbif-violet text-white shadow-soft min-[769px]:hidden" aria-label="Nueva tarea">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
