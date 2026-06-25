import { Download } from "lucide-react";
import { Button } from "../components/ui/Button";
import type { Task, TaskSummary } from "../types/task";
import { PageTitle } from "./DashboardPage";

interface ReportsPageProps {
  tasks: Task[];
  summary: TaskSummary;
  onToast: (message: string) => void;
}

export function ReportsPage({ tasks, summary, onToast }: ReportsPageProps) {
  const projectRanking = Array.from(new Set(tasks.map((task) => task.project_name))).map((name) => ({
    name,
    count: tasks.filter((task) => task.project_name === name).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <PageTitle title="Reportes" subtitle="Resumen mensual de productividad" />
        <Button variant="secondary" icon={<Download className="h-4 w-4" />} onClick={() => onToast("Exportacion en preparacion")}>Exportar</Button>
      </div>
      <section className="grid gap-4 md:grid-cols-5">
        {[
          ["Total tareas", summary.total],
          ["Finalizadas", summary.completed],
          ["Pendientes", summary.pending],
          ["En revision", summary.inReview],
          ["Vencidas", summary.overdue],
        ].map(([label, value]) => (
          <article key={label} className="rounded-xl border border-banbif-border bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-banbif-muted">{label}</div>
            <div className="mt-2 text-3xl font-black">{value}</div>
          </article>
        ))}
      </section>
      <article className="rounded-xl border border-banbif-border bg-white p-5 shadow-soft">
        <h3 className="text-sm font-black">Proyectos con mas tareas</h3>
        <div className="mt-4 space-y-3">
          {projectRanking.map((project) => (
            <div key={project.name}>
              <div className="mb-1 flex justify-between text-sm font-semibold"><span>{project.name}</span><span>{project.count}</span></div>
              <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-banbif-blue" style={{ width: `${Math.max(8, (project.count / Math.max(1, summary.total)) * 100)}%` }} /></div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
