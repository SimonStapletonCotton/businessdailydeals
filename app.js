// Business Daily Deals - Root Level Application for Passenger
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
    }
  ]);
});

// Serve React app or fallback HTML
app.get('*', (req, res) => {
  const reactIndex = path.join(__dirname, 'client/dist/index.html');
  
  if (require('fs').existsSync(reactIndex)) {
    res.sendFile(reactIndex);
  } else {
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
            .promo-banner {
              background: linear-gradient(135deg, #ff6600, #e55a00);
              color: white;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              font-size: 1.2em;
              font-weight: bold;
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
            
            <p><strong>Node.js Application Successfully Running</strong><br>
            Complete marketplace deployment in progress...</p>
          </div>
        </body>
      </html>
    `);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Business Daily Deals running on port ${port}`);
});

module.exports = app;