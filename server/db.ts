import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  maxUses: Infinity,
  allowExitOnIdle: false,
  maxLifetimeSeconds: 0,
  idleTimeoutMillis: 10000
});

export const db = drizzle({ client: pool, schema });

// Test database connection function
export async function testDatabaseConnection(): Promise<void> {
  try {
    const result = await pool.query('SELECT 1 as test');
    if (result.rows[0]?.test === 1) {
      console.log('✅ Database connection successful');
    } else {
      throw new Error('Database connection test failed');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Handle connection errors gracefully
pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
});

pool.on('connect', () => {
  console.log('✅ Database pool connected');
});

pool.on('remove', () => {
  console.log('🔄 Database connection removed from pool');
});

// Ensure proper cleanup on application shutdown
process.on('SIGTERM', async () => {
  console.log('Closing database pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Closing database pool...');
  await pool.end();
  process.exit(0);
});