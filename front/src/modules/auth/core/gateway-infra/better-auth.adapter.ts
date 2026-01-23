import { betterAuth } from "better-auth";
import { Pool } from "pg";
import {
  getBetterAuthDatabaseUrl,
  getBetterAuthSecret,
} from "../model/config/better-auth.config";

export const auth = betterAuth({
  database: new Pool({
    connectionString: getBetterAuthDatabaseUrl(),
  }),
  secret: getBetterAuthSecret(),
  emailAndPassword: {
    enabled: true,
  },
});
