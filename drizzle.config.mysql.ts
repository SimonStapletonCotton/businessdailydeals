import { defineConfig } from "drizzle-kit";

if (!process.env.MYSQL_DATABASE_URL) {
  throw new Error("MYSQL_DATABASE_URL environment variable is required");
}

export default defineConfig({
  schema: "./shared/schema.mysql.ts",
  out: "./migrations-mysql",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.MYSQL_DATABASE_URL,
  },
  verbose: true,
  strict: true,
});