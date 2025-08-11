import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema.mysql";

if (!process.env.MYSQL_DATABASE_URL) {
  throw new Error(
    "MYSQL_DATABASE_URL must be set. Did you forget to configure MySQL database?",
  );
}

export const connection = mysql.createPool(process.env.MYSQL_DATABASE_URL);
export const db = drizzle(connection, { schema });