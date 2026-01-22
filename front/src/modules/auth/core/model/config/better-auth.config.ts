export const getBetterAuthDatabaseUrl = () =>
  process.env.BETTER_AUTH_DATABASE_URL ??
  "postgres://taotask:taotask@localhost:5430/taotask";

export const getBetterAuthSecret = () =>
  process.env.BETTER_AUTH_SECRET ?? "demo-secret-change-me";
