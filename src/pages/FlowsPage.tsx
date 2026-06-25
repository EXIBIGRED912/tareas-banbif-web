import { useState } from "react";
import { PageTitle } from "./DashboardPage";

export function FlowsPage() {
  const [code, setCode] = useState("flowchart LR\n  Login --> Dashboard\n  Dashboard --> Proyectos\n  Proyectos --> Tareas\n  Tareas --> Detalle\n  Detalle --> Adjuntos");
  return (
    <div className="space-y-5">
      <PageTitle title="Flujos" subtitle="Diagramas por proyecto y procesos operativos" />
      <section className="grid gap-4 lg:grid-cols-2">
        <textarea value={code} onChange={(e) => setCode(e.target.value)} className="min-h-96 rounded-xl border border-banbif-border bg-white p-4 font-mono text-sm outline-none focus:border-banbif-blue" />
        <article className="rounded-xl border border-banbif-border bg-white p-5 shadow-soft">
          <h3 className="text-sm font-black">Preview preparado</h3>
          <pre className="mt-4 overflow-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">{code}</pre>
          <p className="mt-4 text-sm text-banbif-muted">Mermaid se puede conectar despues para renderizar este codigo como diagrama interactivo.</p>
        </article>
      </section>
    </div>
  );
}
