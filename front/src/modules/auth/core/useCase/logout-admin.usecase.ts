import { IAdminSessionGateway } from "../gateway/admin-session.gateway";

export type LogoutAdminDependencies = {
  adminSessionGateway: IAdminSessionGateway;
};

export async function logoutAdminUseCase(
  dependencies: LogoutAdminDependencies
): Promise<void> {
  await dependencies.adminSessionGateway.closeSession();
}
