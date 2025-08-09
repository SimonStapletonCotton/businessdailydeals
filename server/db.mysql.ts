import { createConnection } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "../shared/schema.mysql";

if (!process.env.MYSQL_DATABASE_URL) {
  throw new Error(
    "MYSQL_DATABASE_URL must be set. Format: mysql://username:password@host:port/database",
  );
}

// Create MySQL connection
const connection = createConnection(process.env.MYSQL_DATABASE_URL);

export const db = drizzle(await connection, { schema, mode: 'default' });

// Test the connection
export async function testConnection() {
  try {
    const conn = await connection;
    await conn.execute('SELECT 1');
    console.log('✅ MySQL database connection successful');
    return true;
  } catch (error) {
    console.error('❌ MySQL database connection failed:', error);
    return false;
  }
}