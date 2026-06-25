import { CheckCircle2, ClipboardCheck, LockKeyhole, ShieldCheck } from "lucide-react";

export function LoginIllustrationPanel({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-violet-100 ${
        compact ? "min-h-44 rounded-[2rem] p-4 sm:min-h-56 sm:p-5" : "hidden min-h-[620px] rounded-r-[2rem] p-10 lg:block"
      }`}
    >
      <div className="absolute -right-12 top-10 h-64 w-64 rounded-full border-2 border-violet-300/70" />
      <div className="absolute right-10 top-24 h-52 w-52 rounded-full bg-banbif-blue/20 blur-sm" />
      <div className="absolute left-16 top-24 h-40 w-40 rounded-full bg-sky-200/60 blur-sm" />
      <div className="absolute bottom-8 right-12 h-7 w-7 rounded-full bg-banbif-blue/80" />
      <div className="absolute left-14 top-28 h-3 w-3 rounded-full bg-banbif-violet" />
      <div className="absolute right-24 top-36 h-4 w-4 rounded-full border border-banbif-success" />

      <div className={`${compact ? "mx-auto max-w-sm" : "relative z-10 mt-16"}`}>
        <div className={`relative mx-auto ${compact ? "h-36 w-60 sm:h-44 sm:w-64" : "h-72 w-[25rem]"}`}>
          <div className="absolute inset-x-8 bottom-5 h-8 rounded-full bg-slate-900/10 blur-xl" />
          <div className="absolute left-8 top-12 h-36 w-56 rounded-2xl border border-white/80 bg-white/80 shadow-2xl backdrop-blur md:h-44 md:w-72">
            <div className="flex h-8 items-center gap-2 border-b border-slate-200 px-3">
              <span className="h-2 w-2 rounded-full bg-banbif-blue" />
              <span className="h-2 w-2 rounded-full bg-banbif-violet" />
              <span className="h-2 w-2 rounded-full bg-banbif-success" />
            </div>
            <div className="space-y-3 p-4">
              {[0, 1, 2].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-banbif-blue to-banbif-violet text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="h-3 flex-1 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute right-7 top-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-banbif-violet to-banbif-blue text-white shadow-xl">
            <ShieldCheck className="h-9 w-9" />
          </div>
          <div className="absolute bottom-8 right-9 rounded-xl border border-white/70 bg-white/90 p-3 shadow-xl">
            <div className="space-y-2">
              {[0, 1, 2].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-banbif-violet" />
                  <span className="h-2 w-16 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-7 left-3 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-700 text-white shadow-xl">
            <LockKeyhole className="h-8 w-8" />
          </div>
        </div>

        {!compact && (
          <div className="mt-8 space-y-6">
            <Feature
              icon={<ClipboardCheck className="h-6 w-6" />}
              title="Organiza lo que importa"
              text="Gestiona tus tareas, proyectos y prioridades en un solo lugar."
            />
            <Feature
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Acceso seguro y confiable"
              text="Plataforma interna protegida."
            />
          </div>
        )}
      </div>
    </section>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-banbif-violet shadow-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-black text-banbif-text">{title}</h3>
        <p className="mt-1 max-w-xs text-sm leading-6 text-banbif-muted">{text}</p>
      </div>
    </div>
  );
}
