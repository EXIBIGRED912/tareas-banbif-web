import { LoginCard } from "../components/auth/LoginCard";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const auth = useAuth();

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#009FE3_0%,transparent_28%),linear-gradient(135deg,#07111F_0%,#0B172A_52%,#4C1D95_100%)] px-4 py-10">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-banbif-blue via-banbif-violet to-banbif-success" />
      <LoginCard onLogin={auth.login} error={auth.error} />
    </main>
  );
}
