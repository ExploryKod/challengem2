import { IAdminAuthGateway } from "../gateway/admin-auth.gateway";
import { getAdminEmail, getAdminPassword } from "../config/admin-auth.config";

export class EnvAdminAuthGateway implements IAdminAuthGateway {
  async authenticate(email: string, password: string): Promise<boolean> {
    return email === getAdminEmail() && password === getAdminPassword();
  }
}
