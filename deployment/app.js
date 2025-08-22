#!/usr/bin/env node
// Business Daily Deals - Production Server for cPanel (CommonJS)
// Self-contained server optimized for Cybersmart shared hosting

const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'simonsta_businessdailydeals_main',
  password: process.env.MYSQL_PASSWORD || '!$}e{SJW_q)xa',
  database: process.env.MYSQL_DATABASE || 'simonsta_businessdailydeals_main'
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Test database connection
async function testDatabaseConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully');
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await testDatabaseConnection();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus ? 'connected' : 'disconnected',
    environment: 'production',
    promotional_period: 'FREE until February 20, 2026'
  });
});

// API Routes for deals
app.get('/api/deals', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { type } = req.query;
    
    let query = 'SELECT * FROM deals WHERE deal_status = "active"';
    if (type === 'hot') {
      query += ' AND deal_type = "hot"';
    } else if (type === 'regular') {
      query += ' AND deal_type = "regular"';
    }
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await connection.execute(query);
    await connection.end();
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Hot deals endpoint
app.get('/api/deals/hot', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM deals WHERE deal_status = "active" AND deal_type = "hot" ORDER BY created_at DESC'
    );
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hot deals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Business stats endpoint
app.get('/api/business/stats', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Get active suppliers count
    const [suppliersResult] = await connection.execute(
      'SELECT COUNT(DISTINCT supplier_id) as count FROM deals WHERE deal_status = "active"'
    );
    
    // Get total deals count
    const [dealsResult] = await connection.execute(
      'SELECT COUNT(*) as count FROM deals WHERE deal_status = "active"'
    );
    
    await connection.end();
    
    const stats = {
      activeSuppliers: suppliersResult[0]?.count || '1',
      totalDeals: dealsResult[0]?.count || '13',
      successfulConnections: '01',
      totalSavings: 10023
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching business stats:', error);
    res.json({
      activeSuppliers: '1',
      totalDeals: '13',
      successfulConnections: '01',
      totalSavings: 10023
    });
  }
});

// Catch-all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 Business Daily Deals server running on port ${PORT}`);
  console.log(`🌐 Environment: production`);
  console.log(`💾 Database: ${dbConfig.database}`);
  console.log(`📅 Promotional Period: FREE until February 20, 2026`);
  testDatabaseConnection();
});

module.exports = app;