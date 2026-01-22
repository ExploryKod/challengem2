export interface IAdminSessionGateway {
  openSession(): Promise<void>;
}
