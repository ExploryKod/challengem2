export interface IAdminAuthGateway {
  authenticate(email: string, password: string): Promise<boolean>;
}
