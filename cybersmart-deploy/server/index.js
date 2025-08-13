// Business Daily Deals - Production Startup
// Compiled JavaScript version for Cybersmart hosting

const express = require('express');
const path = require('path');

console.log('🚀 Starting Business Daily Deals B2B Marketplace...');
console.log('🌐 NODE_ENV:', process.env.NODE_ENV);
console.log('🚢 PORT:', process.env.PORT || 5000);

const app = express();
const port = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: port
  });
});

// Basic route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Business Daily Deals server started on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`📊 Health check: http://0.0.0.0:${port}/api/health`);
});