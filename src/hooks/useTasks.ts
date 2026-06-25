import { useCallback, useEffect, useMemo, useState } from "react";
import { demoTasks } from "../data/demoTasks";
import { taskService } from "../services/taskService";
import type { Task, TaskFilters, TaskPayload, TaskSummary } from "../types/task";
import { getVisualStatus } from "../utils/status";

const DEMO_KEY = "banbif-show-demo-tasks";

const calculateSummary = (tasks: Task[]): TaskSummary => {
  const visual = tasks.map((task) => ({ ...task, visualStatus: getVisualStatus(task) }));
  return {
    total: tasks.length,
    pending: visual.filter((task) => task.visualStatus === "pendiente").length,
    inProgress: visual.filter((task) => task.visualStatus === "en_proceso").length,
    inReview: visual.filter((task) => task.visualStatus === "en_revision").length,
    completed: visual.filter((task) => task.status === "finalizada").length,
    overdue: visual.filter((task) => task.visualStatus === "vencida").length,
    projects: new Set(tasks.map((task) => task.project_name)).size,
  };
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDemo, setShowDemoState] = useState(() => localStorage.getItem(DEMO_KEY) === "true");
  const [usingDemo, setUsingDemo] = useState(false);
  const [remoteSummary, setRemoteSummary] = useState<TaskSummary | null>(null);

  const loadTasks = useCallback(async (filters?: TaskFilters) => {
    setLoading(true);
    setError("");
    try {
      const data = await taskService.list(filters);
      if (data.length === 0 && showDemo) {
        setTasks(demoTasks);
        setUsingDemo(true);
        setRemoteSummary(null);
      } else {
        setTasks(data);
        setUsingDemo(false);
        try {
          setRemoteSummary(await taskService.summary());
        } catch (summaryError) {
          console.error("No se pudo leer /dashboard/summary, se calculara desde /tasks", summaryError);
          setRemoteSummary(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las tareas.");
      setTasks(showDemo ? demoTasks : []);
      setUsingDemo(showDemo);
      setRemoteSummary(null);
    } finally {
      setLoading(false);
    }
  }, [showDemo]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const setShowDemo = (value: boolean) => {
    localStorage.setItem(DEMO_KEY, String(value));
    setShowDemoState(value);
  };

  const summary: TaskSummary = useMemo(() => {
    if (remoteSummary && !usingDemo) {
      return {
        ...calculateSummary(tasks),
        ...remoteSummary,
        inReview: remoteSummary.inReview ?? calculateSummary(tasks).inReview,
      };
    }
    return calculateSummary(tasks);
  }, [remoteSummary, tasks, usingDemo]);

  const createTask = async (task: TaskPayload) => {
    await taskService.create(task);
    await loadTasks();
  };

  const updateTask = async (id: string, task: Partial<TaskPayload>) => {
    await taskService.update(id, task);
    await loadTasks();
  };

  const finishTask = async (task: Task) => {
    await taskService.finish(task);
    await loadTasks();
  };

  const removeTask = async (id: string) => {
    await taskService.remove(id);
    await loadTasks();
  };

  return {
    tasks,
    loading,
    error,
    summary,
    usingDemo,
    showDemo,
    setShowDemo,
    reload: loadTasks,
    createTask,
    updateTask,
    finishTask,
    removeTask,
  };
}
