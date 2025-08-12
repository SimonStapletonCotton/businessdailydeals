// MySQL Setup and Data Migration Script
const mysql = require('mysql2/promise');

const config = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectTimeout: 10000,
  timeout: 10000
};

console.log('🔄 Starting MySQL setup and migration...');
console.log(`📡 Connecting to: ${config.user}@${config.host}:${config.port}/${config.database}`);

async function setupMySQL() {
  let connection;
  
  try {
    // Test connection
    connection = await mysql.createConnection(config);
    console.log('✅ MySQL connection successful');
    
    // Test basic query
    const [rows] = await connection.execute('SELECT VERSION() as version');
    console.log(`✅ MySQL version: ${rows[0].version}`);
    
    // Check if database exists and has tables
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [config.database]);
    
    console.log(`📊 Found ${tables.length} existing tables in database`);
    
    if (tables.length > 0) {
      console.log('📋 Existing tables:', tables.map(t => t.TABLE_NAME).join(', '));
    }
    
    // Basic schema creation (simplified for immediate activation)
    const createTables = [
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role ENUM('buyer', 'supplier') NOT NULL DEFAULT 'buyer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified_supplier BOOLEAN DEFAULT FALSE,
        credit_balance DECIMAL(10,2) DEFAULT 0.00
      )`,
      
      `CREATE TABLE IF NOT EXISTS deals (
        id VARCHAR(255) PRIMARY KEY,
        supplier_id VARCHAR(255) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        category VARCHAR(255),
        deal_type ENUM('hot', 'regular') NOT NULL DEFAULT 'regular',
        deal_status ENUM('active', 'expired', 'inactive') NOT NULL DEFAULT 'active',
        image_url TEXT,
        view_count INT DEFAULT 0,
        inquiry_count INT DEFAULT 0,
        credits_cost DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expiry_date TIMESTAMP NULL,
        FOREIGN KEY (supplier_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    ];
    
    for (const createTable of createTables) {
      await connection.execute(createTable);
      console.log('✅ Table created/verified');
    }
    
    // Insert test user if not exists
    await connection.execute(`
      INSERT IGNORE INTO users (id, username, email, role, verified_supplier) 
      VALUES ('46102542', 'simons', 'simons@cybersmart.co.za', 'supplier', TRUE)
    `);
    
    console.log('🎉 MySQL database setup complete');
    console.log('✅ Ready for unified database connection');
    
    return true;
    
  } catch (error) {
    console.error('❌ MySQL setup failed:', error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  setupMySQL().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { setupMySQL };