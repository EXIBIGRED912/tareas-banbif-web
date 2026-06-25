import { ClipboardList } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-banbif-border bg-white p-8 text-center">
      <ClipboardList className="h-10 w-10 text-banbif-blue" />
      <h3 className="mt-4 text-base font-bold text-banbif-text">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-banbif-muted">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
