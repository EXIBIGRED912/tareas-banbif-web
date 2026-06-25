import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Task } from "../types/task";
import { getMonthDays } from "../utils/dates";
import { priorityClasses } from "../utils/status";
import { PageTitle } from "./DashboardPage";

interface CalendarPageProps {
  tasks: Task[];
}

export function CalendarPage({ tasks }: CalendarPageProps) {
  const [month, setMonth] = useState(new Date(2026, 5, 1));
  const days = getMonthDays(month);
  const label = new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric" }).format(month);
  const shift = (direction: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + direction, 1));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <PageTitle title="Calendario" subtitle="Vista mensual por fecha limite" />
        <div className="flex items-center gap-2 rounded-xl border border-banbif-border bg-white p-1">
          <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></button>
          <div className="min-w-36 text-center text-sm font-black capitalize">{label}</div>
          <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100" onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-banbif-border bg-white shadow-soft">
        <div className="grid grid-cols-7 border-b border-banbif-border bg-slate-50 text-center text-xs font-black text-banbif-muted">
          {["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"].map((day) => <div key={day} className="p-3">{day}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const iso = day?.toISOString().slice(0, 10);
            const dayTasks = tasks.filter((task) => task.end_date === iso);
            return (
              <div key={index} className="min-h-28 border-b border-r border-banbif-border p-2 last:border-r-0">
                <div className="text-right text-xs font-bold text-banbif-muted">{day?.getDate()}</div>
                <div className="mt-2 space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className={`truncate rounded-md px-2 py-1 text-[11px] font-bold ${priorityClasses[task.priority]}`}>{task.title}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
