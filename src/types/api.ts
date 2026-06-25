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
