import { useMemo, useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import type { PageId } from "./components/layout/navigation";
import { TaskDetailPanel } from "./components/tasks/TaskDetailPanel";
import { TaskFormDrawer } from "./components/tasks/TaskFormDrawer";
import { Toast } from "./components/ui/Toast";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LogoutConfirmModal } from "./components/auth/LogoutConfirmModal";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { useProjects } from "./hooks/useProjects";
import { useTasks } from "./hooks/useTasks";
import { CalendarPage } from "./pages/CalendarPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FlowsPage } from "./pages/FlowsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TasksPage } from "./pages/TasksPage";
import type { Task, TaskFilters, TaskPayload } from "./types/task";

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AuthenticatedApp />
      </ProtectedRoute>
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const auth = useAuth();
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");
  const [filters, setFilters] = useState<TaskFilters>(() => {
    const saved = localStorage.getItem("banbif-task-filters");
    return saved ? JSON.parse(saved) : {};
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);

  const tasksState = useTasks();
  const projects = useProjects(tasksState.tasks);

  const visibleTasks = useMemo(() => {
    const term = globalSearch.trim().toLowerCase();
    return tasksState.tasks.filter((task) => {
      const matchesGlobal =
        !term ||
        [task.title, task.project_name, task.responsible, task.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      const matchesStart = !filters.start || task.start_date >= filters.start;
      const matchesEnd = !filters.end || task.end_date <= filters.end;
      return matchesGlobal && matchesStart && matchesEnd;
    });
  }, [tasksState.tasks, globalSearch, filters.start, filters.end]);

  const openNewTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const updateFilters = (next: TaskFilters) => {
    setFilters(next);
    localStorage.setItem("banbif-task-filters", JSON.stringify(next));
    tasksState.reload(next);
  };

  const saveTask = async (payload: TaskPayload, id?: string) => {
    if (id) {
      await tasksState.updateTask(id, payload);
      setToast("Tarea actualizada correctamente");
    } else {
      await tasksState.createTask(payload);
      setToast("Tarea creada correctamente");
    }
  };

  const finishTask = async (task: Task) => {
    if (task.id.startsWith("demo-")) {
      setToast("Las tareas demo no se guardan. Crea una tarea real para finalizarla.");
      return;
    }
    try {
      await tasksState.finishTask(task);
      setToast("Tarea finalizada");
      setViewingTask(null);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "No se pudo finalizar la tarea");
    }
  };

  const deleteTask = async (task: Task) => {
    const confirmed = window.confirm(`Eliminar la tarea "${task.title}"? Esta accion no se puede deshacer.`);
    if (!confirmed) return;
    if (task.id.startsWith("demo-")) {
      setToast("Las tareas demo no se eliminan de la API.");
      return;
    }
    try {
      await tasksState.removeTask(task.id);
      setToast("Tarea eliminada");
      setViewingTask(null);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "No se pudo eliminar la tarea");
    }
  };

  const duplicateTask = (task: Task) => {
    setEditingTask({ ...task, id: "", title: `${task.title} copia`, status: "pendiente", finished_at: null });
    setFormOpen(true);
  };

  const commonTaskProps = {
    tasks: visibleTasks,
    projects,
    filters,
    loading: tasksState.loading,
    error: tasksState.error,
    usingDemo: tasksState.usingDemo,
    onFiltersChange: updateFilters,
    onNewTask: openNewTask,
    onView: setViewingTask,
    onEdit: openEditTask,
    onFinish: finishTask,
    onDelete: deleteTask,
  };

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={setActivePage}
      onNewTask={openNewTask}
      search={globalSearch}
      onSearch={setGlobalSearch}
      user={auth.user!}
      onLogout={() => setLogoutOpen(true)}
      onSettings={() => setActivePage("settings")}
    >
      {activePage === "dashboard" && (
        <DashboardPage
          tasks={visibleTasks}
          summary={tasksState.summary}
          loading={tasksState.loading}
          error={tasksState.error}
          onNewTask={openNewTask}
        />
      )}
      {activePage === "tasks" && <TasksPage {...commonTaskProps} />}
      {activePage === "projects" && <ProjectsPage projects={projects} tasks={visibleTasks} />}
      {activePage === "calendar" && <CalendarPage tasks={visibleTasks} />}
      {activePage === "reports" && <ReportsPage tasks={visibleTasks} summary={tasksState.summary} onToast={setToast} />}
      {activePage === "flows" && <FlowsPage />}
      {activePage === "settings" && <SettingsPage showDemo={tasksState.showDemo} setShowDemo={tasksState.setShowDemo} user={auth.user!} isAuthenticated={auth.isAuthenticated} onLogout={() => setLogoutOpen(true)} />}

      <TaskFormDrawer open={formOpen} task={editingTask} projects={projects} onClose={() => setFormOpen(false)} onSave={saveTask} />
      <TaskDetailPanel task={viewingTask} onClose={() => setViewingTask(null)} onEdit={openEditTask} onFinish={finishTask} onDelete={deleteTask} onDuplicate={duplicateTask} />
      <LogoutConfirmModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          setFormOpen(false);
          setViewingTask(null);
          setEditingTask(null);
          auth.logout();
        }}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </AppLayout>
  );
}
