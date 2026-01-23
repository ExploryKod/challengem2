export const getBetterAuthDatabaseUrl = () =>
  process.env.BETTER_AUTH_DATABASE_URL ??
  "postgres://smartcafe:smartcafe@localhost:5433/smartcafe";

export const getBetterAuthSecret = () =>
  process.env.BETTER_AUTH_SECRET ?? "demo-secret-change-me";
