# Simple Step-by-Step Deployment Guide

## Phase 1: Create Essential Files in cPanel (5 minutes)

### Step 1: Open cPanel File Manager
1. Log into your cPanel
2. Click "File Manager" 
3. Navigate to: `/public_html/businessdailydeals/`

### Step 2: Create package.json
1. Click "New File"
2. Name it: `package.json`
3. Copy and paste this content:

```json
{
  "name": "business-daily-deals",
  "version": "1.0.0",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5"
  }
}
```

### Step 3: Create server folder and startup file
1. Create new folder: `server`
2. Inside server folder, create file: `index.js`
3. Copy this simple startup code:

```javascript
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('<h1>Business Daily Deals - Coming Soon!</h1><p>Marketplace is being deployed...</p>');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server running' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
```

## Phase 2: Test Basic Setup (2 minutes)
1. Go back to Node.js App in cPanel
2. Click "Run NPM Install"
3. Click "Restart Node.js"
4. Visit www.businessdailydeals.co.za

If you see "Business Daily Deals - Coming Soon!" then we're ready for Phase 3!

## Phase 3: Upload Full Marketplace
(We'll do this after Phase 2 works)

---

**Start with Phase 1 - just get the basic setup working first!**