import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Gauge,
  GitBranch,
  LayoutGrid,
  MoreHorizontal,
  Settings,
} from "lucide-react";

export type PageId = "dashboard" | "projects" | "tasks" | "calendar" | "reports" | "flows" | "settings";

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Gauge },
  { id: "projects", label: "Proyectos", icon: LayoutGrid },
  { id: "tasks", label: "Tareas", icon: ClipboardList },
  { id: "calendar", label: "Calendario", icon: CalendarDays },
  { id: "reports", label: "Reportes", icon: BarChart3 },
  { id: "flows", label: "Flujos", icon: GitBranch },
  { id: "settings", label: "Configuracion", icon: Settings },
] as const;

export const mobileNavItems = [
  navItems[0],
  navItems[1],
  navItems[2],
  navItems[4],
  { id: "settings", label: "Mas", icon: MoreHorizontal },
] as const;
