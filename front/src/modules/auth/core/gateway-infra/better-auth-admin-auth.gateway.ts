import { auth } from "./better-auth.adapter";
import { getAdminEmail, getAdminPassword } from "../config/admin-auth.config";
import { IAdminAuthGateway } from "../gateway/admin-auth.gateway";

export class BetterAuthAdminAuthGateway implements IAdminAuthGateway {
  async authenticate(email: string, password: string): Promise<boolean> {
    if (email !== getAdminEmail() || password !== getAdminPassword()) {
      return false;
    }

    try {
      await auth.api.signInEmail({
        body: { email, password },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
