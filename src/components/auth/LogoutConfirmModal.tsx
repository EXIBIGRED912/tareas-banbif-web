import { LogOut } from "lucide-react";
import { Button } from "../ui/Button";

interface LogoutConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ open, onCancel, onConfirm }: LogoutConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-banbif-ink/55 px-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-2xl border border-white/70 bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-banbif-danger">
          <LogOut className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-xl font-black text-banbif-text">¿Deseas cerrar sesión?</h2>
        <p className="mt-3 text-sm leading-6 text-banbif-muted">
          Por seguridad, se cerrará tu sesión actual en este dispositivo.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="button" onClick={onConfirm} className="bg-gradient-to-r from-banbif-violet to-banbif-blue">
            Cerrar sesión
          </Button>
        </div>
      </section>
    </div>
  );
}
