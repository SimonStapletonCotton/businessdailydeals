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

// Handle connection errors gracefully
pool.on('error', (err) => {
  console.error('Database pool error:', err);
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