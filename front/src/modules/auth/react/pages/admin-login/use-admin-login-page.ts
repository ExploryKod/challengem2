import { redirect } from "next/navigation";
import { AuthGatewayFactory } from "@taotask/modules/auth/core/model/auth.factory";
import { authenticateAdminUseCase } from "@taotask/modules/auth/core/useCase/authenticate-admin.usecase";

export type AdminLoginSearchParams = {
  next?: string;
  error?: string;
};

export type AdminLoginPageProps = {
  searchParams?: AdminLoginSearchParams;
};

async function authenticate(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");

  const result = await authenticateAdminUseCase(
    { email, password, nextPath },
    {
      adminAuthGateway: AuthGatewayFactory.createAdminAuthGateway(),
      adminSessionGateway: AuthGatewayFactory.createAdminSessionGateway(),
    }
  );

  if (!result.isAuthenticated) {
    redirect("/login?error=1");
  }

  redirect(result.nextPath);
}

export const useAdminLoginPage = ({
  searchParams,
}: {
  searchParams?: AdminLoginSearchParams;
}) => {
  const hasError = Boolean(searchParams?.error);
  const nextPath =
    typeof searchParams?.next === "string" ? searchParams?.next : "/admin";

  return {
    authenticate,
    hasError,
    nextPath,
  };
};
