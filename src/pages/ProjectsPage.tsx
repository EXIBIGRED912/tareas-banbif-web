import type { Project } from "../types/project";
import type { Task } from "../types/task";
import { PageTitle } from "./DashboardPage";

interface ProjectsPageProps {
  projects: Project[];
  tasks: Task[];
}

export function ProjectsPage({ projects, tasks }: ProjectsPageProps) {
  return (
    <div className="space-y-5">
      <PageTitle title="Proyectos" subtitle="Seguimiento consolidado por proyecto" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const count = tasks.filter((task) => task.project_name === project.name).length;
          const completed = tasks.filter((task) => task.project_name === project.name && task.status === "finalizada").length;
          return (
            <article key={project.id} className="rounded-xl border border-banbif-border bg-white p-5 shadow-soft">
              <h3 className="text-lg font-black">{project.name}</h3>
              <p className="mt-2 min-h-10 text-sm text-banbif-muted">{project.description || "Proyecto operativo registrado desde tareas."}</p>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="font-semibold text-banbif-muted">Tareas</span>
                <span className="font-black">{count}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-banbif-muted">Finalizadas</span>
                <span className="font-black text-banbif-success">{completed}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
