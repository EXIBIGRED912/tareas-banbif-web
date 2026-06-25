import { useEffect, useState } from "react";
import { API_BASE_URL, HAS_CONFIGURED_API_URL, api } from "../services/api";
import { PageTitle } from "./DashboardPage";
import { Button } from "../components/ui/Button";

interface HealthResponse {
  ok?: boolean;
  message?: string;
  database?: string;
  tables?: Array<{ name: string }>;
  status?: string;
}

interface SettingsPageProps {
  showDemo: boolean;
  setShowDemo: (value: boolean) => void;
}

export function SettingsPage({ showDemo, setShowDemo }: SettingsPageProps) {
  const [health, setHealth] = useState("Verificando...");
  const [tables, setTables] = useState<string[]>([]);
  const [lastCheck, setLastCheck] = useState("");
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const response = await api.get<HealthResponse>("/health");
      setHealth(response.ok === false ? "API con error" : "API conectada");
      setTables(response.tables?.map((table) => table.name) || []);
    } catch (error) {
      setHealth(error instanceof Error ? `API con error: ${error.message}` : "API con error");
      setTables([]);
    } finally {
      setLastCheck(new Intl.DateTimeFormat("es-PE", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(new Date()));
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-5">
      <PageTitle title="Configuracion" subtitle="Conexion, preferencias visuales y privacidad" />
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-banbif-border bg-white p-5 shadow-soft">
          <h3 className="text-sm font-black">API configurada</h3>
          {!HAS_CONFIGURED_API_URL && (
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
              VITE_API_URL no esta configurada en el entorno. Se esta usando la URL por defecto de desarrollo.
            </p>
          )}
          <p className="mt-3 break-all rounded-lg bg-slate-50 p-3 text-sm font-semibold text-banbif-muted">{API_BASE_URL}</p>
          <div className="mt-4 space-y-3 text-sm">
            <p className="font-semibold text-banbif-text">{health}</p>
            <p className="text-banbif-muted">Ultima verificacion: {lastCheck || "Pendiente"}</p>
            <div>
              <p className="font-bold text-banbif-text">Tablas detectadas</p>
              <p className="mt-1 text-banbif-muted">{tables.length ? tables.join(", ") : "No informado por la API"}</p>
            </div>
            <Button variant="secondary" onClick={checkHealth} disabled={checking}>
              {checking ? "Verificando..." : "Probar conexion"}
            </Button>
          </div>
        </article>
        <article className="rounded-xl border border-banbif-border bg-white p-5 shadow-soft">
          <h3 className="text-sm font-black">Preferencias</h3>
          <label className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold">
            Cargar ejemplo cuando D1 este vacio
            <input type="checkbox" checked={showDemo} onChange={(e) => setShowDemo(e.target.checked)} className="h-5 w-5 accent-banbif-violet" />
          </label>
        </article>
      </section>
      <article className="rounded-xl border border-banbif-border bg-white p-5 shadow-soft">
        <h3 className="text-sm font-black">Privacidad</h3>
        <p className="mt-3 text-sm leading-6 text-banbif-muted">No registrar DNI, cuentas bancarias, claves, tokens, datos de clientes ni informacion confidencial.</p>
      </article>
    </div>
  );
}
