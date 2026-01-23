import { cookies } from "next/headers";
import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import {
  ADMIN_AUTH_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "../model/config/admin-auth.config";
import { IAdminSessionGateway } from "../gateway/admin-session.gateway";

export class CookieAdminSessionGateway implements IAdminSessionGateway {
  async openSession(): Promise<void> {
    const cookieStore = (await cookies()) as ResponseCookies;
    cookieStore.set(ADMIN_AUTH_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });
  }

  async closeSession(): Promise<void> {
    const cookieStore = (await cookies()) as ResponseCookies;
    cookieStore.delete(ADMIN_AUTH_COOKIE);
  }
}
