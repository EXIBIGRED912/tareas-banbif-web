import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl bg-banbif-ink px-4 py-3 text-sm font-medium text-white shadow-soft md:bottom-6">
      <CheckCircle2 className="h-5 w-5 text-banbif-success" />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} aria-label="Cerrar notificacion">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
