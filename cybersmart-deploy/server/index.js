// Business Daily Deals - Production Server
// Complete B2B marketplace with MySQL integration

const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

console.log('🚀 Starting Business Daily Deals B2B Marketplace...');
console.log('🌐 NODE_ENV:', process.env.NODE_ENV);
console.log('🚢 PORT:', process.env.PORT || 5000);

const app = express();
const port = process.env.PORT || 5000;

// Import database and routes
const { registerRoutes } = require('./routes');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'business-daily-deals-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/dist')));

async function startServer() {
  try {
    // Register API routes
    const httpServer = await registerRoutes(app);
    
    // Serve React app for all non-API routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

    // Start server
    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Business Daily Deals marketplace started on port ${port}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
      console.log(`🎯 Live at: www.businessdailydeals.co.za`);
      console.log(`📊 Health check: http://0.0.0.0:${port}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();