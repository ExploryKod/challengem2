export const getSafeAdminNextPath = (nextPath?: string) =>
  nextPath && nextPath.startsWith("/admin") ? nextPath : "/admin";

export type AdminCredentials = {
  email: string;
  password: string;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const isAdminCredentialsMatching = (
  input: AdminCredentials,
  expected: AdminCredentials
) =>
  normalizeEmail(input.email) === normalizeEmail(expected.email) &&
  input.password === expected.password;
