import { ChevronDown, LogOut, Plus, Search, Settings } from "lucide-react";
import { useState } from "react";
import type { AuthUser } from "../../types/api";
import { Button } from "../ui/Button";

interface HeaderProps {
  onNewTask: () => void;
  search: string;
  onSearch: (value: string) => void;
  user: AuthUser;
  onLogout: () => void;
  onSettings: () => void;
}

export function Header({ onNewTask, search, onSearch, user, onLogout, onSettings }: HeaderProps) {
  const initial = (user.name || user.username || "U").slice(0, 1).toUpperCase();
  const [open, setOpen] = useState(false);
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
        <div className="relative hidden md:block">
          <button
            onClick={() => setOpen((value) => !value)}
            className="flex items-center gap-2 rounded-lg border border-banbif-border px-3 py-2 hover:bg-slate-50"
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-banbif-blue text-xs font-bold text-white">{initial}</div>
            <div className="text-left">
              <div className="text-sm font-bold text-banbif-text">{user.name || user.username}</div>
              <div className="text-xs text-banbif-muted">{user.role}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-banbif-muted" />
          </button>
          {open && (
            <div className="absolute right-0 top-14 z-40 w-72 rounded-xl border border-banbif-border bg-white p-3 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-banbif-border p-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-banbif-blue text-base font-black text-white">{initial}</div>
                <div>
                  <div className="font-black text-banbif-text">{user.name || user.username}</div>
                  <div className="text-xs text-banbif-muted">{user.username}</div>
                  <div className="mt-1 inline-flex rounded-full bg-violet-50 px-2 py-1 text-xs font-bold text-banbif-violet">{user.role}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  onSettings();
                }}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-banbif-text hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" />
                Configuración
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
