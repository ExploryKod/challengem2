import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@taotask/modules/auth/core/gateway-infra/better-auth.adapter";

export const { GET, POST } = toNextJsHandler(auth);
