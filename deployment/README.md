# Business Daily Deals - cPanel Deployment Package

## Ready for Deployment

**Deployment package updated: August 22, 2025**
- Fresh React build with working deals (8 hot + 5 regular)
- Casino homepage with February 20th, 2026 promotional content
- Sample deals data included for immediate functionality
- MySQL integration with PostgreSQL fallback

## Files in this Package:

- `app.js` - Production Node.js server (CommonJS format)
- `package.json` - Production dependencies 
- `public/` - Complete React frontend build
- `public/index.html` - Main entry point
- `public/assets/` - CSS and JavaScript bundles

## cPanel Setup Instructions:

1. **Upload Files**:
   - Upload `deployment/package.json` to your domain folder
   - Upload `deployment/app.js` to your domain folder  
   - Upload `deployment/public/` folder to your domain folder

2. **Configure Node.js App**:
   - Entry Point: `app.js`
   - Environment: `production`
   - Port: Use cPanel assigned port

3. **Set Environment Variables**:
- `MYSQL_HOST=localhost`
- `MYSQL_USER=simonsta_businessdailydeals_main`  
- `MYSQL_PASSWORD=!$}e{SJW_q)xa`
- `MYSQL_DATABASE=simonsta_businessdailydeals_main`

4. **Start Application**:
   - Install dependencies: `npm install`
   - Start server: `node app.js`

## Features Included:

- Casino-themed homepage with animated slot machine
- 8 Hot Deals with premium pricing
- 5 Regular Deals with standard pricing  
- Sample data for immediate functionality
- Automatic MySQL/PostgreSQL database switching
- February 20th, 2026 promotional content
- Professional business marketplace design

Total package size: ~1MB
Ready for immediate deployment to Cybersmart hosting.