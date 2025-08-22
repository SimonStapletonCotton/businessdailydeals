import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema.mysql";

// Test connection with Cybersmart credentials
const connectionConfig = {
  host: 'localhost',
  port: 3306,
  user: 'simonsta_user',
  password: '+9#XPRw!{~8K',
  database: 'simonsta_businessdailydeals' // Assuming standard cPanel naming convention
};

export async function testMySQLConnection() {
  try {
    console.log('🔄 Testing MySQL connection to Cybersmart...');
    
    // Create connection
    const connection = await mysql.createConnection(connectionConfig);
    
    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ MySQL connection successful:', rows);
    
    // Initialize Drizzle
    const db = drizzle(connection, { schema, mode: 'default' });
    console.log('✅ Drizzle ORM initialized successfully');
    
    // Test database info
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db, VERSION() as version');
    console.log('📊 Database info:', dbInfo);
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    return false;
  }
}

// Alternative database names to try
export const possibleDatabaseNames = [
  'simonsta_businessdailydeals',
  'simonsta_bdd',
  'simonsta_main',
  'simonsta_db',
  'businessdailydeals'
];

export async function findCorrectDatabase() {
  for (const dbName of possibleDatabaseNames) {
    try {
      console.log(`🔍 Testing database: ${dbName}`);
      const connection = await mysql.createConnection({
        ...connectionConfig,
        database: dbName
      });
      
      const [result] = await connection.execute('SELECT DATABASE() as db_name');
      console.log(`✅ Found database: ${dbName}`, result);
      
      await connection.end();
      return dbName;
    } catch (error) {
      console.log(`❌ Database ${dbName} not found`);
    }
  }
  
  console.log('📋 No existing database found. May need to create one.');
  return null;
}