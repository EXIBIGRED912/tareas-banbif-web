import { Plus, Search } from "lucide-react";
import { Button } from "../ui/Button";

interface HeaderProps {
  onNewTask: () => void;
  search: string;
  onSearch: (value: string) => void;
}

export function Header({ onNewTask, search, onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-banbif-border bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center gap-3 px-4 md:px-8">
        <div className="relative hidden flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-banbif-muted" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Buscar tareas, proyectos o responsables..."
            className="h-10 w-full max-w-xl rounded-lg border border-banbif-border bg-banbif-surface pl-10 pr-3 text-sm outline-none focus:border-banbif-blue"
          />
        </div>
        <Button onClick={onNewTask} icon={<Plus className="h-4 w-4" />} className="ml-auto">
          Nueva tarea
        </Button>
        <div className="hidden items-center gap-2 rounded-lg border border-banbif-border px-3 py-2 md:flex">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-banbif-blue text-xs font-bold text-white">A</div>
          <span className="text-sm font-semibold text-banbif-text">Usuario local</span>
        </div>
      </div>
    </header>
  );
}
