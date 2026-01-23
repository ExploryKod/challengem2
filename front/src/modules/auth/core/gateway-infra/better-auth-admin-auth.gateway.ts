import { auth } from "./better-auth.adapter";
import { IAdminAuthGateway } from "../gateway/admin-auth.gateway";

export class BetterAuthAdminAuthGateway implements IAdminAuthGateway {
  async authenticate(email: string, password: string): Promise<boolean> {
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
