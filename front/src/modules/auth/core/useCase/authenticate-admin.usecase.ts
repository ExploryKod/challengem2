import { IAdminAuthGateway } from "../gateway/admin-auth.gateway";
import { IAdminSessionGateway } from "../gateway/admin-session.gateway";
import { getSafeAdminNextPath } from "../model/admin-auth.model";

export type AuthenticateAdminInput = {
  email: string;
  password: string;
  nextPath?: string;
};

export type AuthenticateAdminDependencies = {
  adminAuthGateway: IAdminAuthGateway;
  adminSessionGateway: IAdminSessionGateway;
};

export type AuthenticateAdminResult = {
  isAuthenticated: boolean;
  nextPath: string;
};

export const authenticateAdminUseCase = async (
  input: AuthenticateAdminInput,
  dependencies: AuthenticateAdminDependencies
): Promise<AuthenticateAdminResult> => {
  const { adminAuthGateway, adminSessionGateway } = dependencies;
  const isAuthenticated = await adminAuthGateway.authenticate(
    input.email,
    input.password
  );
  const nextPath = getSafeAdminNextPath(input.nextPath);

  if (isAuthenticated) {
    await adminSessionGateway.openSession();
  }

  return {
    isAuthenticated,
    nextPath,
  };
};
