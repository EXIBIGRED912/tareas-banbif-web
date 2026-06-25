import type { ReactNode } from "react";
import type { AuthUser } from "../../types/api";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { PageId } from "./navigation";

interface AppLayoutProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onNewTask: () => void;
  search: string;
  onSearch: (value: string) => void;
  user: AuthUser;
  onLogout: () => void;
  onSettings: () => void;
  children: ReactNode;
}

export function AppLayout({ activePage, onNavigate, onNewTask, search, onSearch, user, onLogout, onSettings, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-banbif-surface text-banbif-text">
      <Sidebar activePage={activePage} onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <div className="min-[769px]:pl-[260px]">
        <Header onNewTask={onNewTask} search={search} onSearch={onSearch} user={user} onLogout={onLogout} onSettings={onSettings} />
        <main className="px-4 py-5 pb-24 min-[769px]:px-8 min-[769px]:pb-8">{children}</main>
      </div>
      <BottomNav activePage={activePage} onNavigate={onNavigate} />
    </div>
  );
}
