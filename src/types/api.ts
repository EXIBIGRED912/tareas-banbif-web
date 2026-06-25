export interface ApiEnvelope<T> {
  ok?: boolean;
  message?: string;
  data?: T;
  tasks?: T;
  task?: T;
  projects?: T;
  database?: string;
  tables?: Array<{ name: string }>;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface AuthUser {
  username: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  ok: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

export interface MeResponse {
  ok: boolean;
  message: string;
  user: AuthUser;
}
