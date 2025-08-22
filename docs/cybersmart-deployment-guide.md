# Business Daily Deals - Cybersmart Deployment Guide

## Step 1: Download Project Files
All files needed for deployment are in this Replit project. You'll need to download:

### Core Files (Required)
```
client/          - Frontend application
server/          - Backend server
shared/          - Database schemas  
package.json     - Dependencies
tsconfig.json    - TypeScript config
vite.config.ts   - Build configuration
```

### Database Files (MySQL Integration)
```
server/db-mysql.ts       - MySQL connection
server/db-selector.ts    - Database selector
shared/schema.mysql.ts   - MySQL schemas
drizzle.config.mysql.ts  - Migration config
mysql-setup.cjs          - Database initialization
```

## Step 2: Build Production Version
Since Cybersmart shared hosting typically supports static files, you'll need the built version:

1. Run build command to create production files
2. Upload the built static files to Cybersmart
3. Configure database connection

## Step 3: Upload to Cybersmart
1. Access your Cybersmart cPanel
2. Go to File Manager
3. Navigate to public_html/businessdailydeals.co.za/
4. Upload all built files
5. Set proper file permissions

## Step 4: Database Configuration
Your MySQL will activate automatically with:
- Host: localhost (confirmed by Cybersmart)
- Database: simonsta_businessdailydeals.co.za
- User: simonsta_Simon36200
- Password: [your configured password]

## Ready for Deployment
All 13 deals and complete marketplace functionality ready to transfer.