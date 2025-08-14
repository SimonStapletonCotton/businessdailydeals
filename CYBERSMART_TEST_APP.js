const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

console.log('=== BUSINESS DAILY DEALS TEST APP ===');
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
console.log('MYSQL_USER:', process.env.MYSQL_USER);
console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD ? '***SET***' : 'NOT SET');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route to show environment status
app.get('/test', (req, res) => {
  res.json({
    status: 'TEST APP RUNNING',
    environment: process.env.NODE_ENV,
    mysql_configured: !!(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD && process.env.MYSQL_DATABASE),
    mysql_host: process.env.MYSQL_HOST,
    mysql_user: process.env.MYSQL_USER,
    mysql_database: process.env.MYSQL_DATABASE
  });
});

// Check if server folder exists
const serverExists = require('fs').existsSync(path.join(__dirname, 'server'));
const clientExists = require('fs').existsSync(path.join(__dirname, 'client'));
const clientDistExists = require('fs').existsSync(path.join(__dirname, 'client/dist'));

console.log('Directory Check:');
console.log('server folder exists:', serverExists);
console.log('client folder exists:', clientExists);
console.log('client/dist folder exists:', clientDistExists);

// Try to load complete routes
let routesLoaded = false;
try {
  const { registerRoutes } = require('./server/routes');
  registerRoutes(app).then(() => {
    console.log('✅ Complete marketplace routes loaded successfully');
    routesLoaded = true;
  }).catch(err => {
    console.log('❌ Route registration failed:', err.message);
  });
} catch (error) {
  console.log('❌ Routes module not found:', error.message);
}

// Serve static files
if (clientExists) {
  app.use(express.static(path.join(__dirname, 'client')));
}
if (clientDistExists) {
  app.use(express.static(path.join(__dirname, 'client/dist')));
}

// Main route
app.get('*', (req, res) => {
  const reactIndex = path.join(__dirname, 'client/dist/index.html');
  
  if (require('fs').existsSync(reactIndex)) {
    console.log('Serving React app from:', reactIndex);
    res.sendFile(reactIndex);
  } else {
    console.log('React index.html not found, serving test page');
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Business Daily Deals - Test Mode</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .status { background: #f0f0f0; padding: 10px; margin: 10px 0; }
            .success { background: #d4edda; }
            .error { background: #f8d7da; }
          </style>
        </head>
        <body>
          <h1>🎰 Business Daily Deals - Test Mode</h1>
          <div class="status">
            <h3>App Status:</h3>
            <p>✅ Node.js app is running successfully</p>
            <p>✅ Environment: ${process.env.NODE_ENV || 'development'}</p>
            <p>${process.env.MYSQL_HOST ? '✅' : '❌'} MySQL Host: ${process.env.MYSQL_HOST || 'NOT SET'}</p>
            <p>${process.env.MYSQL_USER ? '✅' : '❌'} MySQL User: ${process.env.MYSQL_USER || 'NOT SET'}</p>
            <p>${process.env.MYSQL_DATABASE ? '✅' : '❌'} MySQL Database: ${process.env.MYSQL_DATABASE || 'NOT SET'}</p>
            <p>${process.env.MYSQL_PASSWORD ? '✅' : '❌'} MySQL Password: ${process.env.MYSQL_PASSWORD ? 'SET' : 'NOT SET'}</p>
          </div>
          <div class="status">
            <h3>File Structure:</h3>
            <p>${serverExists ? '✅' : '❌'} Server folder exists</p>
            <p>${clientExists ? '✅' : '❌'} Client folder exists</p>
            <p>${clientDistExists ? '✅' : '❌'} Client/dist folder exists</p>
            <p>${routesLoaded ? '✅' : '❌'} Marketplace routes loaded</p>
          </div>
          <p><a href="/test">View detailed status JSON</a></p>
          <hr>
          <p><strong>If all items show ✅, your marketplace should be working!</strong></p>
        </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log(`✅ Business Daily Deals Test App running on port ${port}`);
  console.log('Visit your domain to see the test status page');
});

module.exports = app;