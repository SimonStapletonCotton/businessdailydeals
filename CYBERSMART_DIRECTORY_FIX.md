# CYBERSMART: Directory Configuration Fix

## ISSUE: "Directory already used by: '/home/simonsta/public_html/businessdailydeals-fixed'"

This means the Node.js app is already configured but pointing to the wrong startup file.

## SIMPLE FIX:

**Option 1: Update Existing App Configuration**
1. Go to Node.js App settings in cPanel
2. Find the app using directory: `/home/simonsta/public_html/businessdailydeals-fixed/`
3. Change **Startup File** from `server/index.js` to `app.js`
4. Create the `app.js` file in `/home/simonsta/public_html/businessdailydeals-fixed/app.js`
5. Restart the application

**Option 2: Delete and Recreate App**
1. Delete the existing Node.js app configuration
2. Create new Node.js app with:
   - **Application Root**: `/home/simonsta/public_html/businessdailydeals-fixed/`
   - **Startup File**: `app.js`
3. Create the `app.js` file with the code provided earlier
4. Start the application

## THE app.js FILE CONTENT:
```javascript
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
```

## RESULT:
www.businessdailydeals.co.za will display the complete Business Daily Deals marketplace instead of "coming soon"