#!/bin/bash

# Business Daily Deals - Cybersmart Production Build
# August 13, 2025

echo "🚀 Building Business Daily Deals for Cybersmart Production..."

# Create production directory
mkdir -p cybersmart-deploy
cd cybersmart-deploy

# Copy essential application files
echo "📁 Copying application files..."
cp -r ../client .
cp -r ../server .
cp -r ../shared .
cp -r ../migrations .
cp ../package.json .
cp ../package-lock.json .
cp ../tsconfig.json .
cp ../vite.config.ts .
cp ../tailwind.config.ts .
cp ../postcss.config.js .
cp ../components.json .
cp ../drizzle.config.ts .

# Create production environment file
echo "⚙️ Creating production environment configuration..."
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=mysql://[CYBERSMART_USERNAME]:[CYBERSMART_PASSWORD]@localhost:3306/businessdailydeals_prod
SENDGRID_API_KEY=[TO_BE_PROVIDED]
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json
REPLIT_DOMAIN=businessdailydeals.co.za
REPLIT_URL=https://www.businessdailydeals.co.za
SESSION_SECRET=business-daily-deals-cybersmart-2025
EOF

# Create production-specific package.json scripts
echo "📦 Optimizing package.json for production..."
cat > package.json << 'EOF'
{
  "name": "business-daily-deals",
  "version": "1.0.0",
  "description": "B2B Marketplace for South African Market",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "build": "tsc && vite build",
    "production": "NODE_ENV=production node server/index.js",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate"
  },
  "dependencies": {
    "@google-cloud/storage": "^7.7.0",
    "@neondatabase/serverless": "^0.9.0",
    "@sendgrid/mail": "^8.1.0",
    "drizzle-orm": "^0.29.0",
    "drizzle-zod": "^0.5.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "express-session": "^1.17.3",
    "mysql2": "^3.6.5",
    "nanoid": "^5.0.4",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/express-session": "^1.17.10",
    "@types/node": "^20.10.5",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "drizzle-kit": "^0.20.6",
    "typescript": "^5.3.3",
    "tsx": "^4.6.2",
    "vite": "^5.0.10"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Create deployment instructions
cat > CYBERSMART_DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
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
EOF

echo "✅ Cybersmart production build complete!"
echo "📁 Files ready in: ./cybersmart-deploy/"
echo "📧 Send database credentials request to Cybersmart"