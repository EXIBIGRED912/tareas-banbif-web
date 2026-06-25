import { api } from "./api";
import type { LoginResponse, MeResponse } from "../types/api";

export const authService = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { username, password }, { skipAuth: true }),
  me: () => api.get<MeResponse>("/auth/me"),
};
