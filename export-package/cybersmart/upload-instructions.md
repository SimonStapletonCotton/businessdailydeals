# Cybersmart Deployment Instructions

## Upload Process for Business Daily Deals

### 1. Files to Upload:
- `app.js` (main server file - 183KB)
- `public/` folder (all frontend assets)
- `.htaccess` (already in root folder)
- Environment configuration files

### 2. Database Setup:
- MySQL credentials already configured
- Database will auto-connect on Cybersmart servers
- Schema ready for import

### 3. Domain Configuration:
- Point www.businessdailydeals.co.za to your hosting
- SSL certificate will be automatically provisioned
- CDN optimization enabled

### 4. Environment Variables:
```
NODE_ENV=production
PORT=80
MYSQL_HOST=localhost
MYSQL_USER=[provided by Cybersmart]
MYSQL_PASSWORD=[provided by Cybersmart]  
MYSQL_DATABASE=[provided by Cybersmart]
```

### 5. Launch Commands:
```bash
node app.js
```

### Features Ready on Launch:
✅ February 20th, 2026 promotional period  
✅ 13 deals with professional images  
✅ Full supplier and buyer functionality  
✅ Credit system and payment integration  
✅ Search and notification system  

**Your marketplace will be live immediately after upload!**