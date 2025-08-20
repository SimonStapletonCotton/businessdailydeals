# cPanel Node.js Deployment Guide - Business Daily Deals

## SOLUTION: No Spaces in Directory Names

The error occurs because cPanel Node.js apps require directory names without spaces. Here's the corrected deployment process:

## FILES TO UPLOAD:

### 1. Server Files (No Spaces in Names):
- `businessdailydeals-app.js` (renamed from cybersmart-app.js)
- `package-cpanel.json` (rename to package.json after upload)
- `cybersmart-schema.sql` (database schema)

### 2. Frontend Files:
- Complete `dist/public/` folder → rename to just `public/`

## STEP-BY-STEP DEPLOYMENT:

### Step 1: Database Setup (2 minutes)
1. Login to cPanel
2. Go to MySQL Databases
3. Import `cybersmart-schema.sql`
4. Verify tables created successfully

### Step 2: File Upload (3 minutes)
1. Open cPanel File Manager
2. Navigate to your domain's root directory
3. Upload these files:
   - `businessdailydeals-app.js`
   - `package-cpanel.json` → rename to `package.json`
4. Upload `dist/public/` folder → rename to `public/`

### Step 3: Node.js App Setup (2 minutes)
1. Go to cPanel → Setup Node.js App
2. Click "Create Application"
3. **Application Root**: `/` (or your domain folder)
4. **Application URL**: www.businessdailydeals.co.za
5. **Application Startup File**: `businessdailydeals-app.js`
6. **Node.js Version**: Select latest available
7. Click "Create"

### Step 4: Install Dependencies (1 minute)
1. In the Node.js app interface, click "Run NPM Install"
2. Wait for express and mysql2 packages to install

### Step 5: Start Application (Instant)
1. Click "Start App" in the Node.js interface
2. Your marketplace will be live at www.businessdailydeals.co.za

## VERIFICATION:
- Visit www.businessdailydeals.co.za
- Check that homepage loads with February 2026 content
- Verify deals are displaying correctly
- Test navigation and search functionality

## TROUBLESHOOTING:
- If app won't start, check the error logs in cPanel
- Ensure database credentials are correct
- Verify all files uploaded without spaces in names
- Make sure package.json is in the correct location

**Total Deployment Time: 8 minutes**