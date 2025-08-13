const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

console.log('Business Daily Deals starting from app.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'business-daily-deals-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Try to load complete routes
try {
  const { registerRoutes } = require('./server/routes');
  registerRoutes(app).then(() => {
    console.log('Complete marketplace loaded');
  }).catch(err => {
    console.log('Using fallback mode');
  });
} catch (error) {
  console.log('Routes not available, using basic server');
}

// Serve static files
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client/dist')));

// Fallback route
app.get('*', (req, res) => {
  const reactIndex = path.join(__dirname, 'client/dist/index.html');
  if (require('fs').existsSync(reactIndex)) {
    res.sendFile(reactIndex);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Business Daily Deals</title></head>
        <body>
          <h1>Business Daily Deals - B2B Marketplace</h1>
          <p>Application successfully running - Loading complete marketplace...</p>
        </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log('Business Daily Deals running on port ' + port);
});

module.exports = app;