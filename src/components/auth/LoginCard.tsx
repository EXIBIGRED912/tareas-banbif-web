import { Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

interface LoginCardProps {
  onLogin: (username: string, password: string) => Promise<void>;
  error?: string;
  notice?: string;
  onDismissNotice?: () => void;
}

export function LoginCard({ onLogin, error, notice, onDismissNotice }: LoginCardProps) {
  const [username, setUsername] = useState(() => localStorage.getItem("banbif-remembered-user") || "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem("banbif-remembered-user")));
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (remember && username) {
      localStorage.setItem("banbif-remembered-user", username);
    }
    if (!remember) {
      localStorage.removeItem("banbif-remembered-user");
    }
  }, [remember, username]);

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
      if (remember) {
        localStorage.setItem("banbif-remembered-user", username);
      }
    } catch (loginError) {
      setLocalError(loginError instanceof Error ? loginError.message : "No se pudo iniciar sesion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="mb-6 text-center sm:mb-8 lg:text-left">
        <div className="text-3xl font-black tracking-normal sm:text-5xl">
          <span className="text-banbif-ink">BanBif</span>{" "}
          <span className="bg-gradient-to-r from-banbif-blue to-banbif-violet bg-clip-text text-transparent">
            Tasks
          </span>
        </div>
        <p className="mt-2 text-lg font-black text-slate-600 sm:mt-3 sm:text-xl">Gestión segura de tareas internas</p>
        <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 sm:mt-5">
          Accede a tu espacio de trabajo y organiza proyectos, tareas y prioridades de forma simple y segura.
        </p>
      </div>
      {(localError || error) && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
          {localError || error}
        </div>
      )}
      {notice && !localError && !error && (
        <button
          type="button"
          onClick={onDismissNotice}
          className="mb-4 w-full rounded-lg bg-emerald-50 p-3 text-left text-sm font-semibold text-emerald-700"
        >
          {notice}
        </button>
      )}
      <label className="block">
        <span className="mb-2 block text-sm font-black text-banbif-text">Usuario</span>
        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-banbif-muted" />
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-base outline-none transition placeholder:text-slate-400 focus:border-banbif-blue focus:ring-4 focus:ring-sky-100"
            autoComplete="username"
            placeholder="Ingresa tu usuario"
          />
        </div>
      </label>
      <label className="mt-4 block sm:mt-5">
        <span className="mb-2 block text-sm font-black text-banbif-text">Contraseña</span>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-banbif-muted" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-base outline-none transition placeholder:text-slate-400 focus:border-banbif-blue focus:ring-4 focus:ring-sky-100"
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
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
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm sm:mt-5">
        <label className="flex items-center gap-3 font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-5 w-5 rounded border-slate-300 accent-banbif-violet"
          />
          Recordarme
        </label>
        <span className="font-semibold text-blue-600">Acceso seguro interno</span>
      </div>
      <Button
        type="submit"
        className="mt-5 h-14 w-full rounded-xl bg-gradient-to-r from-banbif-violet to-banbif-blue text-base shadow-lg shadow-blue-500/20 sm:mt-8"
        disabled={submitting || !username || !password}
      >
        {submitting ? "Iniciando..." : "Iniciar sesión"}
      </Button>
      <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-banbif-muted sm:mt-7">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-banbif-blue" />
        <p>No registrar DNI, cuentas bancarias, claves, tokens, datos de clientes ni información confidencial.</p>
      </div>
    </form>
  );
}
