# Quick Fixes for Cybersmart Deployment

## ISSUE: "Coming Soon" Page Instead of Marketplace

### Most Common Cause: Node.js App Not Running

**Step 1: Check App Status**
- cPanel → Node.js Apps → Business Daily Deals
- Status should show "Running"
- If "Stopped" → Click "Restart"

**Step 2: Verify Startup File**
App configuration should have:
- Startup file: `server/index.js`
- Application root: `/public_html/`
- Node.js version: 18.20.8

**Step 3: Check Dependencies**
If restart fails:
- Access cPanel File Manager
- Navigate to public_html
- Check if `node_modules` folder exists
- If missing: Terminal → `npm install`

### Alternative Entry Points to Try:
1. `app.js` (main application file)
2. `server/index.js` (backend server)
3. `index.js` (if exists in root)

### Environment Variables Required:
```
NODE_ENV=production
MYSQL_HOST=localhost
MYSQL_USER=your_db_username
MYSQL_PASSWORD=your_db_password
MYSQL_DATABASE=your_db_name
```

## SUCCESS INDICATOR
When fixed, www.businessdailydeals.co.za will show:
- Orange gradient homepage
- "Business Daily Deals B2B Marketplace" title
- Hot Deals section with 8 business deals
- Professional navigation and styling

## If Still Shows "Coming Soon"
1. Check error logs in cPanel Node.js Apps
2. Contact Cybersmart support: "Node.js app not starting after extraction"
3. Request verification of application configuration