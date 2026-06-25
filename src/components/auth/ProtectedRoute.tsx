import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { LoginPage } from "../../pages/LoginPage";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-banbif-ink text-white">
        <div className="text-sm font-semibold">Validando sesion...</div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
