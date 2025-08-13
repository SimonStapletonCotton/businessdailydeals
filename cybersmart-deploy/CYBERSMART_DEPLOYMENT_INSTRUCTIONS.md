# Cybersmart Deployment Instructions

## 1. Upload Files
Upload all files to: `/public_html/businessdailydeals/`

## 2. cPanel Node.js App Configuration
- Application Name: Business Daily Deals
- Application URL: /
- Node.js Version: Latest
- Application Root: /public_html/businessdailydeals
- Startup File: server/index.js

## 3. Environment Variables
Set in cPanel Node.js App:
- NODE_ENV=production
- DATABASE_URL=mysql://[username]:[password]@localhost:3306/businessdailydeals_prod
- SENDGRID_API_KEY=[your_sendgrid_key]

## 4. Database Setup
Run: `npm run db:push`

## 5. Start Application
Application will start automatically via cPanel configuration
