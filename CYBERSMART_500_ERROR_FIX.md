# CYBERSMART: 500 Internal Server Error Fix

## Current Status:
✅ Node.js app is configured correctly  
✅ app.js file exists  
✅ MySQL credentials provided  
❌ **500 Internal Server Error** - App is crashing on startup

## Root Cause:
The 500 error means your Node.js app is starting but crashing. This is likely because:
1. **Missing dependencies** - Express, MySQL2, etc. not installed
2. **Node modules not installed** - Need to run `npm install`

## SOLUTION: Install Dependencies

**Ask Cybersmart to run these commands in your application directory:**

```bash
cd /home/simonsta/public_html/businessdailydeals-fixed
npm install
```

## Required Dependencies (if manual install needed):
```bash
npm install express
npm install mysql2
npm install express-session
```

## Alternative: Create package.json

If npm install fails, create a `package.json` file in your application root:

```json
{
  "name": "business-daily-deals",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "mysql2": "^3.6.0",
    "express-session": "^1.17.0"
  }
}
```

Then run `npm install`

## After Installing Dependencies:
1. Restart your Node.js app in cPanel
2. Check www.businessdailydeals.co.za
3. Should work without 500 error

## Contact Cybersmart:
"Please run `npm install` in my application directory `/home/simonsta/public_html/businessdailydeals-fixed/` to install the required Node.js dependencies for my application."