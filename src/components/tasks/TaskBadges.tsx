import type { Task } from "../../types/task";
import { Badge } from "../ui/Badge";
import { getVisualStatus, priorityClasses, priorityLabels, statusClasses, statusLabels } from "../../utils/status";

interface TaskBadgesProps {
  task: Task;
}

export function TaskBadges({ task }: TaskBadgesProps) {
  const visualStatus = getVisualStatus(task);
  return (
    <div className="flex flex-wrap gap-2">
      <Badge className={statusClasses[visualStatus]}>{statusLabels[visualStatus]}</Badge>
      <Badge className={`border-transparent ${priorityClasses[task.priority]}`}>{priorityLabels[task.priority]}</Badge>
    </div>
  );
}
