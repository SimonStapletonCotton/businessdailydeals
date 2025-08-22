# Business Daily Deals - Production Deployment

This folder contains the production-ready files for deploying Business Daily Deals to cPanel hosting.

## Files for cPanel Upload

### Required Files:
- `package.json` - CommonJS configuration (fixes ES module error)
- `app.js` - Production server with MySQL integration
- `public/` folder - React frontend build (copy from ../dist/public/)

### Environment Configuration:
The app expects these environment variables (already configured for Cybersmart):
- `MYSQL_HOST=localhost`
- `MYSQL_USER=simonsta_businessdailydeals_main`  
- `MYSQL_PASSWORD=!$}e{SJW_q)xa`
- `MYSQL_DATABASE=simonsta_businessdailydeals_main`

## cPanel Setup Instructions:

1. **Upload Files**:
   - Upload `package.json` to your domain folder
   - Upload `app.js` to your domain folder  
   - Copy `../dist/public/` contents to `public/` folder

2. **Configure Node.js App**:
   - In cPanel → Node.js App
   - Set "Startup File": `app.js`
   - Set "Application Root": your domain folder
   - Click "Run NPM Install" (installs express, mysql2)

3. **Test Deployment**:
   - Visit `/api/health` - should show database connection status
   - Visit root URL - should show casino homepage with deals

## Features Included:
- ✅ CommonJS compatibility (no ES module errors)
- ✅ Cybersmart MySQL database integration
- ✅ All API endpoints (deals, hot deals, business stats)
- ✅ Static file serving for React frontend
- ✅ February 20th, 2026 promotional content
- ✅ Health check and error handling

## Troubleshooting:
- If ES module error persists, ensure `package.json` has `"type": "commonjs"`
- If database connection fails, verify Cybersmart MySQL credentials
- If frontend doesn't load, ensure `public/` folder contains React build files