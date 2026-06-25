import { LogOut } from "lucide-react";
import { navItems, type PageId } from "./navigation";

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[260px] flex-col bg-banbif-navy p-5 text-white shadow-soft min-[769px]:flex">
      <div className="mb-8">
        <div className="text-xl font-black tracking-normal">BanBif Tasks</div>
        <div className="mt-1 text-xs text-slate-300">Gestion interna de proyectos</div>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                active ? "bg-banbif-violet text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-banbif-blue font-bold">A</div>
          <div>
            <div className="text-sm font-bold">Abner</div>
            <div className="text-xs text-slate-300">Administrador</div>
          </div>
        </div>
        <button className="mt-4 flex items-center gap-2 text-xs text-slate-300">
          <LogOut className="h-4 w-4" />
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}
