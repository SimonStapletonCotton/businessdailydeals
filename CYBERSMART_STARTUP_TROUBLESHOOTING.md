# Cybersmart Application Startup Issue

## PROBLEM: "Coming Soon" Instead of Full Marketplace

**Current Status**: Files extracted successfully, but Node.js app not starting properly
**Symptom**: www.businessdailydeals.co.za shows "coming soon" placeholder

## IMMEDIATE ACTIONS NEEDED

### 1. Check Node.js App Status in cPanel
1. Log into Cybersmart cPanel
2. Navigate to "Node.js Apps" section
3. Look for "Business Daily Deals" application
4. Check if status shows "Running" or "Stopped"

### 2. If App Shows "Stopped" - Restart It
1. Click "Restart" button next to the app
2. Wait 30-60 seconds for initialization
3. Refresh www.businessdailydeals.co.za

### 3. Check Application Entry Point
The app should be configured to use:
- **Startup file**: `app.js` or `index.js`
- **Application root**: `/public_html/`
- **Node.js version**: 18.20.8

### 4. Verify Environment Variables
Ensure these are set in Node.js app configuration:
- NODE_ENV=production
- MYSQL_HOST=localhost
- MYSQL_USER=[your_username]
- MYSQL_PASSWORD=[your_password]
- MYSQL_DATABASE=[your_database]

### 5. Check Error Logs
In cPanel Node.js Apps section:
1. Click "Error logs" or "View logs"
2. Look for startup errors or missing dependencies
3. Common issues: missing npm modules, database connection failures

## POSSIBLE SOLUTIONS

### Solution A: Missing Dependencies
If logs show missing modules:
1. In cPanel Terminal or File Manager
2. Navigate to public_html directory
3. Run: `npm install`

### Solution B: Wrong Entry Point
If app won't start:
1. Check Node.js app configuration
2. Set startup file to `server/index.js` or `app.js`
3. Verify application URL points to correct directory

### Solution C: Database Connection
If MySQL errors appear:
1. Verify database credentials in environment variables
2. Check if MySQL database exists
3. Ensure database user has proper permissions

## EXPECTED RESULT AFTER FIX
- Homepage loads with orange casino theme
- 8 Hot Deals visible with professional images
- Navigation menus work properly
- "FREE UNTIL 20TH FEBRUARY 2026" promotional banner

## CONTACT CYBERSMART IF NEEDED
If issues persist, contact Priya or Cybersmart support with:
- Error logs from Node.js app
- Screenshot of Node.js app status
- Mention: "Business Daily Deals marketplace not starting after file extraction"