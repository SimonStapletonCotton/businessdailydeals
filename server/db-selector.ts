import { db as postgresDb } from './db';
import { mysqlDb, testMySQLConnection } from './db-mysql';

// Database selector based on environment and availability
export async function getDatabase() {
  // Check if MySQL credentials are provided
  const hasMySQLCredentials = process.env.MYSQL_HOST && 
                              process.env.MYSQL_USER && 
                              process.env.MYSQL_PASSWORD && 
                              process.env.MYSQL_DATABASE;

  if (hasMySQLCredentials) {
    console.log('🔄 MySQL credentials detected, testing connection...');
    const mysqlConnected = await testMySQLConnection();
    
    if (mysqlConnected) {
      console.log('✅ Using MySQL database (Cybersmart production)');
      return mysqlDb;
    } else {
      console.log('⚠️ MySQL connection failed, falling back to PostgreSQL');
    }
  } else {
    console.log('ℹ️ No MySQL credentials provided, using PostgreSQL');
  }

  console.log('✅ Using PostgreSQL database (Replit development)');
  return postgresDb;
}

// Initialize and export the selected database
export let selectedDb: any = null;

export async function initializeDatabase() {
  if (!selectedDb) {
    selectedDb = await getDatabase();
  }
  return selectedDb;
}

// Export for immediate use (will be PostgreSQL initially)
export const db = postgresDb;