export interface D1BoundStatement {
  run(): Promise<{ success?: boolean }>;
}

export interface D1Statement extends D1BoundStatement {
  bind(...values: unknown[]): D1BoundStatement;
}

export interface D1Binding {
  prepare(query: string): D1Statement;
}

export interface KVBinding {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface CloudflareBindings {
  DB?: D1Binding;
  RATE_LIMIT?: KVBinding;
}
