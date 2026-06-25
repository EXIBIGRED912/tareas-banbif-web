import type { Project } from "../types/project";
import type { Task } from "../types/task";
import { unique } from "../utils/formatters";

export const projectService = {
  fromTasks: (tasks: Task[]): Project[] => {
    return unique(tasks.map((task) => task.project_name).filter(Boolean)).map((name) => ({
      id: name,
      name,
    }));
  },
};
