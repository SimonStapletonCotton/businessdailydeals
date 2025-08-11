import { defineConfig } from "drizzle-kit";

if (!process.env.MYSQL_DATABASE_URL) {
  throw new Error("MYSQL_DATABASE_URL must be set for MySQL configuration");
}

export default defineConfig({
  out: "./migrations-mysql",
  schema: "./shared/schema.mysql.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.MYSQL_DATABASE_URL,
  },
});