// Business Daily Deals - Root Level Application for Passenger
// This file must be placed in the application root directory

const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

console.log('🚀 Business Daily Deals - Starting from root app.js');
console.log('📁 Application root:', __dirname);
console.log('🌐 Environment:', process.env.NODE_ENV);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'business-daily-deals-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Try to load complete routes if available
let hasCompleteRoutes = false;
try {
  const { registerRoutes } = require('./server/routes');
  
  // Register complete marketplace routes
  registerRoutes(app).then(() => {
    console.log('✅ Complete marketplace routes loaded');
    hasCompleteRoutes = true;
  }).catch(err => {
    console.log('⚠️ Complete routes failed, using fallback:', err.message);
  });
} catch (error) {
  console.log('⚠️ Complete routes not available, using basic server:', error.message);
}

// Serve static files
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client/dist')));

// Basic API endpoints (fallback)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Business Daily Deals is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    completeRoutes: hasCompleteRoutes,
    applicationRoot: __dirname
  });
});

// Mock deals for testing
app.get('/api/deals', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Premium Office Furniture - Hot Deal',
      description: 'Complete office furniture package with executive desks, ergonomic chairs, and filing cabinets.',
      price: '25000',
      originalPrice: '35000',
      category: 'Office Equipment',
      dealType: 'hot',
      companyName: 'Executive Office Solutions',
      location: 'Johannesburg',
      savings: '10000',
      imageUrl: '/images/office-furniture.jpg'
    },
    {
      id: '2',
      title: 'Industrial Cleaning Services Contract',
      description: 'Annual comprehensive facility cleaning services for commercial buildings.',
      price: '15000',
      originalPrice: '20000',
      category: 'Services',
      dealType: 'hot',
      companyName: 'CleanPro Industries',
      location: 'Cape Town',
      savings: '5000',
      imageUrl: '/images/cleaning-services.jpg'
    }
  ]);
});

// Serve React app or fallback HTML
app.get('*', (req, res) => {
  const reactIndex = path.join(__dirname, 'client/dist/index.html');
  
  if (require('fs').existsSync(reactIndex)) {
    res.sendFile(reactIndex);
  } else {
    // Business Daily Deals branded fallback page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Business Daily Deals - South Africa's Premier B2B Marketplace</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #ffcc80 0%, #ffb74d 50%, #c8b8a0 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 15px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              max-width: 800px;
              width: 90%;
              text-align: center;
            }
            h1 { 
              color: #ff6600; 
              font-size: 2.5em; 
              margin-bottom: 10px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            h2 { 
              color: #64748b; 
              margin-bottom: 30px; 
              font-weight: 300;
            }
            .promo-banner {
              background: linear-gradient(135deg, #ff6600, #e55a00);
              color: white;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              font-size: 1.2em;
              font-weight: bold;
            }
            .status-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin: 30px 0;
            }
            .status-item {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
              border-left: 4px solid #ff6600;
            }
            .status-label { 
              font-weight: bold; 
              color: #64748b; 
              display: block;
              margin-bottom: 5px;
            }
            .status-value { 
              color: #ff6600; 
              font-size: 1.1em;
            }
            .features {
              text-align: left;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
            .features h3 { 
              color: #ff6600; 
              margin-bottom: 15px;
              text-align: center;
            }
            .features ul { 
              list-style: none; 
              columns: 2;
              gap: 20px;
            }
            .features li { 
              padding: 5px 0; 
              color: #64748b;
            }
            .features li:before { 
              content: '✓'; 
              color: #ff6600; 
              font-weight: bold; 
              margin-right: 10px;
            }
            .api-links {
              margin: 20px 0;
            }
            .api-links a {
              display: inline-block;
              background: #ff6600;
              color: white;
              padding: 10px 20px;
              border-radius: 5px;
              text-decoration: none;
              margin: 0 10px;
              transition: background 0.3s;
            }
            .api-links a:hover {
              background: #e55a00;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Business Daily Deals</h1>
            <h2>South Africa's Premier B2B Marketplace</h2>
            
            <div class="promo-banner">
              🎉 FREE PROMOTIONAL PERIOD UNTIL 20TH FEBRUARY 2026! 🎉
            </div>
            
            <div class="status-grid">
              <div class="status-item">
                <span class="status-label">Server Status</span>
                <span class="status-value">✅ Running</span>
              </div>
              <div class="status-item">
                <span class="status-label">Environment</span>
                <span class="status-value">${process.env.NODE_ENV || 'Production'}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Application Root</span>
                <span class="status-value">✅ Configured</span>
              </div>
              <div class="status-item">
                <span class="status-label">Complete Routes</span>
                <span class="status-value">${hasCompleteRoutes ? '✅ Loaded' : '⏳ Loading'}</span>
              </div>
            </div>

            <div class="features">
              <h3>Marketplace Features Ready</h3>
              <ul>
                <li>Hot Deals Premium Placement</li>
                <li>Regular Deals Marketplace</li>
                <li>Supplier Dashboard</li>
                <li>Buyer Registration</li>
                <li>Search & Discovery</li>
                <li>Inquiry System</li>
                <li>Credit Management</li>
                <li>Banner Advertising</li>
                <li>Analytics Dashboard</li>
                <li>Mobile Responsive</li>
                <li>PayFast Integration</li>
                <li>Coupon System</li>
              </ul>
            </div>

            <div class="api-links">
              <a href="/api/health">API Health Check</a>
              <a href="/api/deals">Sample Deals</a>
            </div>

            <p style="color: #64748b; margin-top: 30px;">
              <strong>Node.js Application Successfully Running</strong><br>
              Complete marketplace deployment in progress...
            </p>
          </div>
        </body>
      </html>
    `);
  }
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Business Daily Deals running on port ${port}`);
  console.log(`🌐 Visit: www.businessdailydeals.co.za`);
  console.log(`📊 API: /api/health`);
  console.log(`🛍️ Deals: /api/deals`);
});

module.exports = app;