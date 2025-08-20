# FIXED: Simple cPanel Upload Solution

## ERROR SOLVED: "Cannot find module './routes'"

**Problem**: You uploaded the development server files which have complex dependencies and separate route files.

**Solution**: Use the self-contained production server that has everything built-in.

## CORRECT FILES TO UPLOAD:

### 1. Replace Your Current Server File:
- ❌ DELETE: `/home/simonsta/public_html/businessdailydeals/server/index.js`
- ✅ UPLOAD: `businessdailydeals-app.js` → rename to `app.js`

### 2. cPanel Node.js App Settings:
- **Application Startup File**: `app.js` (not server/index.js)
- **Application Root**: `/public_html/businessdailydeals/`
- All other settings stay the same

## QUICK FIX STEPS:

### Step 1: Replace Server File (1 minute)
1. Download the updated `businessdailydeals-app.js`
2. In cPanel File Manager, navigate to `/home/simonsta/public_html/businessdailydeals/`
3. DELETE the entire `server/` folder
4. UPLOAD `businessdailydeals-app.js` and rename it to `app.js`

### Step 2: Update cPanel Settings (30 seconds)
1. Go to cPanel → Setup Node.js App
2. Edit your existing application
3. Change **Application Startup File** to: `app.js`
4. Save changes

### Step 3: Restart App (10 seconds)
1. Click "Restart" in the Node.js app interface
2. Your marketplace will be live!

## VERIFICATION:
Visit: `www.businessdailydeals.co.za/api/health`
Should return: `{"status":"healthy","promotional_period":"FREE until February 20, 2026"}`

**The self-contained app.js file has no dependencies on separate route files - this fixes the module error completely.**