import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema.mysql";

// Cybersmart MySQL connection configuration
const connectionConfig = {
  host: 'localhost',
  port: 3306,
  user: 'simonsta_user',
  password: '+9#XPRw!{~8K',
  database: 'simonsta_businessdailydeals'
};

export const connection = mysql.createPool(connectionConfig);
export const db = drizzle(connection, { schema });