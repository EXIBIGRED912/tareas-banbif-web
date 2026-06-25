import { mobileNavItems, type PageId } from "./navigation";

interface BottomNavProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-banbif-border bg-white min-[769px]:hidden">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const active = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
              active ? "text-banbif-violet" : "text-banbif-muted"
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
