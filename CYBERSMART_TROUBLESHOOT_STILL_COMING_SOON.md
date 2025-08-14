# Troubleshooting: Site Still Shows "Coming Soon"

## You've Done:
✅ Created `app.js` file  
✅ Changed startup file to `app.js`  
✅ Restarted the application

## But Still Getting "Coming Soon"

## Possible Issues & Solutions:

### 1. Check app.js File Location
**Verify the file is in the correct location:**
- File should be at: `/home/simonsta/public_html/businessdailydeals-fixed/app.js`
- NOT in any subfolder
- Must be directly in the `businessdailydeals-fixed` directory

### 2. Verify app.js Content
**Make sure the file contains this EXACT content:**

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

### 3. Check Node.js App Status
In cPanel Node.js Selector:
- Make sure the app shows as "Running" 
- If it shows "Stopped", click "Start"
- If there are any error messages, note them

### 4. Check Passenger Log
Look at the log file: `/home/simonsta/logs/businessdailydeals.log`
- Check for any error messages
- Look for startup messages from app.js

### 5. Force Restart Again
- In Node.js Selector, click "Stop" then "Start" 
- Or click "Restart" again
- Wait 30 seconds, then check the site

### 6. Alternative Test
If still not working, create a simple test app.js:

```javascript
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('*', (req, res) => {
  res.send('<h1>Business Daily Deals - TEST MODE</h1><p>App.js is working!</p>');
});

app.listen(port, () => {
  console.log('Test app running on port ' + port);
});

module.exports = app;
```

If this test version works, then gradually add back the complete code.

## Next Steps:
1. Double-check the app.js file location and content
2. Check the application status in Node.js Selector
3. Look at the Passenger log for errors
4. Try the simple test version if needed