import { auth } from "../src/modules/auth/core/gateway-infra/better-auth.adapter";
import { getBetterAuthDatabaseUrl } from "../src/modules/auth/core/model/config/better-auth.config";
import { Pool } from "pg";

const DEMO_ADMIN_NAME = "Demo Admin";
const DEMO_ADMIN_EMAIL = "demo@admin.local";
const DEMO_ADMIN_PASSWORD = "S3cur3!T0rch!91Aq";

const pool = new Pool({
  connectionString: getBetterAuthDatabaseUrl(),
});

const removeExistingUser = async (email: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      'select id from "user" where email = $1',
      [email]
    );
    const userId = rows[0]?.id as string | undefined;

    if (userId) {
      await client.query('delete from "session" where "userId" = $1', [userId]);
      await client.query('delete from "account" where "userId" = $1', [userId]);
      await client.query('delete from "user" where id = $1', [userId]);
    }

    await client.query('delete from "verification" where identifier = $1', [
      email,
    ]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const seedDemoAdmin = async () => {
  const email = DEMO_ADMIN_EMAIL;
  const password = DEMO_ADMIN_PASSWORD;

  await removeExistingUser(email);
  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: DEMO_ADMIN_NAME,
    },
  });
};

const run = async () => {
  await seedDemoAdmin();
  await pool.end();
  console.log("✅ Demo admin seeded.");
  console.log(`Email: ${DEMO_ADMIN_EMAIL}`);
  console.log(`Password: ${DEMO_ADMIN_PASSWORD}`);
};

run().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exitCode = 1;
});
