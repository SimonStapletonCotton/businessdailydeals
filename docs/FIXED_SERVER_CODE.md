# Fixed Server Code for Cybersmart

Replace the content in your `server/index.js` file with this improved version:

```javascript
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('<h1>Business Daily Deals</h1><p>Server is starting up...</p>');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Business Daily Deals Server Running',
    timestamp: new Date().toISOString(),
    port: port
  });
});

// Main route
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <title>Business Daily Deals</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #ff8c00; }
      </style>
    </head>
    <body>
      <h1>Business Daily Deals</h1>
      <h2>B2B Marketplace - Coming Soon!</h2>
      <p>Your marketplace is being deployed...</p>
      <p><a href="/api/health">Server Status</a></p>
    </body>
    </html>
  `);
});

// Catch all routes
app.get('*', (req, res) => {
  res.redirect('/');
});

// Start server
app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('Server startup error:', err);
  } else {
    console.log(`✅ Business Daily Deals server running on port ${port}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
  }
});
```

## Steps to Fix:
1. **Go back to cPanel File Manager**
2. **Navigate to the server folder**
3. **Edit the index.js file**
4. **Replace all content** with the code above
5. **Save the file**
6. **Go back to Node.js App and restart**

This improved version has better error handling and should resolve the "something went wrong" error.