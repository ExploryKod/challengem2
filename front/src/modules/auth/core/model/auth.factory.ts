import { IAdminAuthGateway } from "../gateway/admin-auth.gateway";
import { IAdminSessionGateway } from "../gateway/admin-session.gateway";
import { CookieAdminSessionGateway } from "../gateway-infra/cookie-admin-session.gateway";
import { BetterAuthAdminAuthGateway } from "../gateway-infra/better-auth-admin-auth.gateway";

export class AuthGatewayFactory {
  static createAdminAuthGateway(): IAdminAuthGateway {
    return new BetterAuthAdminAuthGateway();
  }

  static createAdminSessionGateway(): IAdminSessionGateway {
    return new CookieAdminSessionGateway();
  }
}
