import type { Task } from "../../types/task";
import { getVisualStatus, priorityLabels, statusLabels } from "../../utils/status";

interface SimpleChartsProps {
  tasks: Task[];
}

const statusOrder = ["pendiente", "en_proceso", "en_revision", "finalizada", "vencida"] as const;
const priorityOrder = ["alta", "media", "baja"] as const;

export function SimpleCharts({ tasks }: SimpleChartsProps) {
  const statusCounts = statusOrder.map((status) => ({
    key: status,
    label: statusLabels[status],
    count: tasks.filter((task) => getVisualStatus(task) === status).length,
  }));
  const priorityCounts = priorityOrder.map((priority) => ({
    key: priority,
    label: priorityLabels[priority],
    count: tasks.filter((task) => task.priority === priority).length,
  }));
  const maxPriority = Math.max(1, ...priorityCounts.map((item) => item.count));
  const total = Math.max(1, tasks.length);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-xl border border-banbif-border bg-white p-5 shadow-soft">
        <h3 className="text-sm font-black">Tareas por estado</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-[150px_1fr]">
          <div
            className="mx-auto h-36 w-36 rounded-full"
            style={{
              background:
                "conic-gradient(#38BDF8 0 24%, #8B4CF6 24% 48%, #F59E0B 48% 62%, #22C55E 62% 86%, #EF4444 86% 100%)",
            }}
          >
            <div className="grid h-full place-items-center rounded-full p-5">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-xl font-black">{total}</div>
            </div>
          </div>
          <div className="space-y-3">
            {statusCounts.map((item) => (
              <div key={item.key} className="flex items-center justify-between text-sm">
                <span className="font-semibold text-banbif-muted">{item.label}</span>
                <span className="font-black">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </article>
      <article className="rounded-xl border border-banbif-border bg-white p-5 shadow-soft">
        <h3 className="text-sm font-black">Tareas por prioridad</h3>
        <div className="mt-6 space-y-5">
          {priorityCounts.map((item) => (
            <div key={item.key}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-banbif-muted">{item.label}</span>
                <span className="font-black">{item.count}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className={`h-3 rounded-full ${
                    item.key === "alta" ? "bg-banbif-danger" : item.key === "media" ? "bg-banbif-violet" : "bg-banbif-success"
                  }`}
                  style={{ width: `${Math.max(8, (item.count / maxPriority) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
