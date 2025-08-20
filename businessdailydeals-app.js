// Business Daily Deals - Production Server for cPanel
// Optimized for Cybersmart shared hosting with MySQL 5.7.44

const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Environment configuration
const config = {
  database: {
    host: 'localhost',
    user: 'simonsta_businessdailydeals_main',
    password: '!$}e{SJW_q)xa',
    database: 'simonsta_businessdailydeals_main'
  },
  promotional_end: '2026-02-20T23:59:59.999Z'
};

// Database connection
let db;
async function connectDatabase() {
  try {
    db = await mysql.createConnection(config.database);
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    promotional_period: 'FREE until February 20, 2026'
  });
});

app.get('/api/deals', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM deals WHERE is_active = TRUE ORDER BY deal_type DESC, created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

app.get('/api/deals/hot', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM deals WHERE deal_type = "hot" AND is_active = TRUE ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch hot deals' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Business Daily Deals server running on port ${PORT}`);
    console.log(`🌐 Environment: production`);
    console.log(`📅 Promotional period: FREE until February 20, 2026`);
  });
}

startServer().catch(console.error);