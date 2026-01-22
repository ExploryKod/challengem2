export const getSafeAdminNextPath = (nextPath?: string) =>
  nextPath && nextPath.startsWith("/admin") ? nextPath : "/admin";
