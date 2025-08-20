# cPanel .htaccess Error Fix

## Error: "Unable to set environment variables in htaccess file"

**Root Cause**: cPanel expects a `.htaccess` file to exist in the public_html directory before it can modify it for Node.js environment variables.

## SOLUTION:

### Step 1: Upload .htaccess File
1. Download the `.htaccess` file from this deployment package
2. Upload it to `/home/simonsta/public_html/.htaccess` via cPanel File Manager
3. Ensure the file is named exactly `.htaccess` (with the leading dot)

### Step 2: Set Correct Permissions
1. Right-click the `.htaccess` file in cPanel File Manager
2. Select "Change Permissions"
3. Set permissions to `644` (read/write for owner, read for group/others)

### Step 3: Retry Node.js App Update
1. Go back to cPanel → Setup Node.js App
2. Try updating your application again
3. The environment variables should now be set successfully

## ALTERNATIVE SOLUTION:

If the above doesn't work, you can set environment variables directly in your Node.js app code instead of relying on cPanel to manage them through .htaccess.

The `businessdailydeals-app.js` file already has the database credentials hardcoded, so you don't need environment variables from .htaccess for basic functionality.

## FILES TO ENSURE ARE UPLOADED:
- `.htaccess` (this file) → `/home/simonsta/public_html/`
- `businessdailydeals-app.js` → `/home/simonsta/public_html/`
- `package.json` → `/home/simonsta/public_html/`
- `public/` folder → `/home/simonsta/public_html/public/`

**The .htaccess file enables proper routing for your React single-page application and sets up performance optimizations.**