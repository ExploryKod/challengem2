export const ADMIN_AUTH_COOKIE = "taotask_admin_auth";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export const getAdminEmail = () =>
  process.env.ADMIN_EMAIL ?? "demo@admin.local";

export const getAdminPassword = () =>
  process.env.ADMIN_PASSWORD ?? "S3cur3!T0rch!91Aq";
