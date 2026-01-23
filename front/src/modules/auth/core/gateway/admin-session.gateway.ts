export interface IAdminSessionGateway {
  openSession(): Promise<void>;
  closeSession(): Promise<void>;
}
