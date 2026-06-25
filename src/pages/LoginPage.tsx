import { LoginCard } from "../components/auth/LoginCard";
import { LoginIllustrationPanel } from "../components/auth/LoginIllustrationPanel";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const auth = useAuth();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,#009FE3_0%,transparent_24%),radial-gradient(circle_at_bottom_right,#6D28D9_0%,transparent_32%),linear-gradient(135deg,#07111F_0%,#0B172A_50%,#24104E_100%)] px-4 py-4 sm:px-6 sm:py-6 lg:grid lg:place-items-center lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[1150px] flex-col justify-center gap-4 sm:min-h-[calc(100vh-3rem)] sm:gap-5 lg:min-h-0 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-0">
        <div className="lg:hidden">
          <LoginIllustrationPanel compact />
        </div>
        <section className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-black/25 sm:p-10 lg:rounded-l-[2rem] lg:rounded-r-none lg:p-16">
          <LoginCard onLogin={auth.login} error={auth.error} notice={auth.notice} onDismissNotice={auth.clearNotice} />
        </section>
        <LoginIllustrationPanel />
      </div>
    </main>
  );
}
