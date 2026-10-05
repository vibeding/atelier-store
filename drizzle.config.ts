import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
config();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: {
    // Migrations use the direct connection; the app uses the pooler (DATABASE_URL).
    url: (process.env.DIRECT_URL ?? process.env.DATABASE_URL)!,
  },
});
