import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import type { AuthUser } from "../types/api";

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const readUser = () => {
  const value = sessionStorage.getItem("auth_user");
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("auth_token"));
  const [user, setUser] = useState<AuthUser | null>(() => readUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const clearSession = useCallback(() => {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  }, []);

  const checkSession = useCallback(async () => {
    const storedToken = sessionStorage.getItem("auth_token");
    if (!storedToken) {
      clearSession();
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.me();
      sessionStorage.setItem("auth_user", JSON.stringify(response.user));
      setToken(storedToken);
      setUser(response.user);
      setError("");
    } catch {
      clearSession();
      setError("Tu sesion expiro, vuelve a iniciar sesion");
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  const login = useCallback(async (username: string, password: string) => {
    setError("");
    const response = await authService.login(username, password);
    sessionStorage.setItem("auth_token", response.token);
    sessionStorage.setItem("auth_user", JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setError("");
  }, [clearSession]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const onExpired = (event: Event) => {
      clearSession();
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      setError(detail?.message || "Tu sesion expiro, vuelve a iniciar sesion");
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    user,
    isAuthenticated: Boolean(token && user),
    loading,
    error,
    login,
    logout,
    checkSession,
  }), [token, user, loading, error, login, logout, checkSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
