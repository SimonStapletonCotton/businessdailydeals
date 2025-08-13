// Business Daily Deals - Simple Production Server
// Single-file approach for Cybersmart Passenger compatibility

const express = require('express');
const path = require('path');
const session = require('express-session');

console.log('🚀 Business Daily Deals - Simple Server Starting...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT || 5000);

const app = express();
const port = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'business-daily-deals-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,  // Set to false for development/testing
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// Serve static files from client directory
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client/dist')));

// Basic API routes for testing
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Business Daily Deals API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: process.env.DATABASE_URL ? 'configured' : 'not configured'
  });
});

// Mock deals endpoint (temporary for testing)
app.get('/api/deals', (req, res) => {
  const mockDeals = [
    {
      id: '1',
      title: 'Premium Office Furniture Package',
      description: 'Complete office setup with desks, chairs, and storage solutions.',
      price: '25000',
      originalPrice: '35000',
      category: 'Office Equipment',
      dealType: 'hot',
      imageUrl: '/images/office-furniture.jpg',
      companyName: 'Business Solutions SA',
      location: 'Johannesburg',
      expiresAt: '2026-02-20T23:59:59.000Z'
    },
    {
      id: '2', 
      title: 'Industrial Cleaning Services Contract',
      description: 'Annual contract for comprehensive facility cleaning services.',
      price: '15000',
      originalPrice: '20000',
      category: 'Services',
      dealType: 'hot',
      imageUrl: '/images/cleaning-services.jpg',
      companyName: 'CleanPro Industries',
      location: 'Cape Town',
      expiresAt: '2026-02-20T23:59:59.000Z'
    }
  ];
  
  res.json(mockDeals);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'client/dist/index.html');
  
  // Check if React build exists
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback to basic HTML if React build not found
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Business Daily Deals - B2B Marketplace</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: linear-gradient(135deg, #ffcc80, #ffb74d);
              margin: 0; 
              padding: 50px;
              text-align: center;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              max-width: 600px;
              margin: 0 auto;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            h1 { color: #ff6600; margin-bottom: 20px; }
            .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Business Daily Deals</h1>
            <h2>South Africa's Premier B2B Marketplace</h2>
            <div class="status">
              <strong>Server Status:</strong> Running Successfully<br>
              <strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}<br>
              <strong>API Health:</strong> <a href="/api/health">Check API</a><br>
              <strong>Sample Deals:</strong> <a href="/api/deals">View Mock Deals</a>
            </div>
            <p><strong>FREE promotional period until February 20th, 2026!</strong></p>
            <p>Complete marketplace deployment in progress...</p>
            <p>Server successfully responding - React frontend loading next.</p>
          </div>
        </body>
      </html>
    `);
  }
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Business Daily Deals server running on port ${port}`);
  console.log(`🌐 Visit: www.businessdailydeals.co.za`);
  console.log(`📊 Health check: /api/health`);
  console.log(`🎯 Mock deals: /api/deals`);
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});