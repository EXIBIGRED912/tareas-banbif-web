import { useMemo } from "react";
import { projectService } from "../services/projectService";
import type { Task } from "../types/task";

export function useProjects(tasks: Task[] = []) {
  return useMemo(() => {
    return projectService.fromTasks(tasks);
  }, [tasks]);
}
