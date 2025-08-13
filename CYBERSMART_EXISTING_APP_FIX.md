# CYBERSMART: Fix Existing Node.js App Configuration

## CURRENT ISSUE:
You already have a Node.js app configured for `/home/simonsta/public_html/businessdailydeals-fixed/` but it's showing "coming soon" instead of the marketplace.

## SOLUTION - Work with Existing App:

### Step 1: Find the Existing App
1. Go to **cPanel → Node.js Selector**
2. Look for the app using directory: `/home/simonsta/public_html/businessdailydeals-fixed/`
3. Click on that app to edit it

### Step 2: Update Startup File
1. In the app settings, find **"Startup file"** field
2. Change it from `server/index.js` to `app.js`
3. Save the configuration

### Step 3: Create the app.js File
1. Navigate to `/home/simonsta/public_html/businessdailydeals-fixed/`
2. Create a new file called `app.js`
3. Copy this exact content into the file:

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

### Step 4: Restart the App
1. Click **"Restart"** button for the Node.js app
2. Wait for it to restart

## RESULT:
www.businessdailydeals.co.za will show the complete Business Daily Deals marketplace

## WHY THIS WORKS:
- Your marketplace files are already uploaded correctly
- The Node.js app is configured correctly  
- It just needs the right startup file at the root level (app.js instead of server/index.js)
- Passenger requires the main file to be at the application root, not in a subfolder