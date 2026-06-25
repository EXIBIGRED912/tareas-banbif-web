import { SummaryCards } from "../components/dashboard/SummaryCards";
import { SimpleCharts } from "../components/dashboard/SimpleCharts";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingState } from "../components/ui/LoadingState";
import type { Task, TaskSummary } from "../types/task";
import { formatDate } from "../utils/dates";

interface DashboardPageProps {
  tasks: Task[];
  summary: TaskSummary;
  loading: boolean;
  error: string;
  onNewTask: () => void;
}

export function DashboardPage({ tasks, summary, loading, error, onNewTask }: DashboardPageProps) {
  const upcoming = [...tasks].sort((a, b) => a.end_date.localeCompare(b.end_date)).slice(0, 5);
  const recent = [...tasks].slice(0, 5);

  return (
    <div className="space-y-5">
      <PageTitle title="Dashboard" subtitle="Resumen general de actividades" />
      {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">{error}</div>}
      {loading ? <LoadingState /> : tasks.length === 0 ? (
        <EmptyState title="Aun no hay tareas" description="Crea la primera tarea para iniciar el seguimiento de proyectos." actionLabel="Nueva tarea" onAction={onNewTask} />
      ) : (
        <>
          <SummaryCards summary={summary} />
          <SimpleCharts tasks={tasks} />
          <section className="grid gap-4 lg:grid-cols-2">
            <Panel title="Proximas fechas limite">
              {upcoming.map((task) => (
                <div key={task.id} className="flex items-center justify-between border-b border-banbif-border py-3 last:border-0">
                  <div>
                    <div className="font-bold">{task.title}</div>
                    <div className="text-xs text-banbif-muted">{task.project_name}</div>
                  </div>
                  <div className="text-right text-sm font-bold">{formatDate(task.end_date)}</div>
                </div>
              ))}
            </Panel>
            <Panel title="Actividad reciente">
              {recent.map((task) => (
                <div key={task.id} className="flex items-center gap-3 border-b border-banbif-border py-3 last:border-0">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-black">{(task.responsible || "U").slice(0, 1)}</div>
                  <div>
                    <div className="font-bold">{task.responsible || "Usuario"} actualizo {task.title}</div>
                    <div className="text-xs text-banbif-muted">{task.project_name}</div>
                  </div>
                </div>
              ))}
            </Panel>
          </section>
        </>
      )}
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="text-2xl font-black text-banbif-text">{title}</h1>
      <p className="mt-1 text-sm text-banbif-muted">{subtitle}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-xl border border-banbif-border bg-white p-5 shadow-soft">
      <h3 className="text-sm font-black">{title}</h3>
      <div className="mt-3">{children}</div>
    </article>
  );
}
