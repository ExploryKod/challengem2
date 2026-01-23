"use server";

import { redirect } from "next/navigation";
import { AuthGatewayFactory } from "@taotask/modules/auth/core/model/auth.factory";
import { logoutAdminUseCase } from "@taotask/modules/auth/core/useCase/logout-admin.usecase";

export async function logoutAction() {
  await logoutAdminUseCase({
    adminSessionGateway: AuthGatewayFactory.createAdminSessionGateway(),
  });
  redirect("/login");
}
