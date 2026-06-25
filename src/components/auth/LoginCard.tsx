import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";

interface LoginCardProps {
  onLogin: (username: string, password: string) => Promise<void>;
  error?: string;
}

export function LoginCard({ onLogin, error }: LoginCardProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username || !password) {
      setLocalError("Ingresa usuario y contrasena.");
      return;
    }
    setSubmitting(true);
    setLocalError("");
    try {
      await onLogin(username, password);
    } catch (loginError) {
      setLocalError(loginError instanceof Error ? loginError.message : "No se pudo iniciar sesion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
      <div className="mb-8 text-center">
        <div className="text-3xl font-black text-banbif-ink">BanBif Tasks</div>
        <p className="mt-2 text-sm font-semibold text-banbif-muted">Gestion segura de tareas internas.</p>
      </div>
      {(localError || error) && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
          {localError || error}
        </div>
      )}
      <label className="block">
        <span className="mb-1 block text-xs font-bold text-banbif-text">Usuario</span>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-banbif-muted" />
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="input pl-10"
            autoComplete="username"
            placeholder="Usuario"
          />
        </div>
      </label>
      <label className="mt-4 block">
        <span className="mb-1 block text-xs font-bold text-banbif-text">Contrasena</span>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-banbif-muted" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input pl-10 pr-12"
            autoComplete="current-password"
            placeholder="Contrasena"
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-banbif-muted hover:bg-slate-100"
            aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </label>
      <Button type="submit" className="mt-6 w-full" disabled={submitting}>
        {submitting ? "Iniciando..." : "Iniciar sesion"}
      </Button>
      <p className="mt-5 text-center text-xs leading-5 text-banbif-muted">
        No registrar DNI, cuentas bancarias, claves, tokens, datos de clientes ni informacion confidencial.
      </p>
    </form>
  );
}
