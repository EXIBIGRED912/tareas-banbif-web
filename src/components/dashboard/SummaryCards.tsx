import { AlertTriangle, CheckCircle2, Clock, FolderKanban, LoaderCircle } from "lucide-react";
import type { TaskSummary } from "../../types/task";

interface SummaryCardsProps {
  summary: TaskSummary;
}

const cards = [
  { key: "projects", label: "Proyectos activos", icon: FolderKanban, tone: "text-banbif-blue" },
  { key: "pending", label: "Tareas pendientes", icon: Clock, tone: "text-banbif-violet" },
  { key: "inProgress", label: "En proceso", icon: LoaderCircle, tone: "text-banbif-info" },
  { key: "inReview", label: "En revision", icon: Clock, tone: "text-banbif-warning" },
  { key: "completed", label: "Finalizadas", icon: CheckCircle2, tone: "text-banbif-success" },
  { key: "overdue", label: "Vencidas", icon: AlertTriangle, tone: "text-banbif-danger" },
] as const;

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.key} className="rounded-xl border border-banbif-border bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-banbif-muted">{card.label}</span>
              <Icon className={`h-5 w-5 ${card.tone}`} />
            </div>
            <div className="mt-3 text-3xl font-black text-banbif-text">{summary[card.key]}</div>
            <div className="mt-2 text-xs font-semibold text-emerald-600">Operacion activa</div>
          </article>
        );
      })}
    </section>
  );
}
