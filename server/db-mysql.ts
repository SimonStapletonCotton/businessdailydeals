import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '@shared/schema';

// MySQL connection for Cybersmart production hosting
const connectionConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'businessdailydeals',
  ssl: process.env.MYSQL_SSL === 'true' ? {} : false,
};

// Create connection pool
export const mysqlConnection = mysql.createPool(connectionConfig);

// Create Drizzle instance
export const mysqlDb = drizzle(mysqlConnection, { schema, mode: 'default' });

// Test connection function
export async function testMySQLConnection() {
  try {
    const connection = await mysqlConnection.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ MySQL connection successful');
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    return false;
  }
}