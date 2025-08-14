# cPanel: Delete Existing App and Create Fresh One

## Current Problem:
- Can't edit existing app (can't find edit option)
- Can't create new app (directory already used error)

## Solution: Delete the Old App First

### Step 1: Find and Delete the Existing App
1. In Node.js Selector, look for any section that shows your current apps
2. Look for app using directory: `/home/simonsta/public_html/businessdailydeals-fixed`
3. Click **"Delete"** or **"Remove"** for that app
4. Confirm the deletion

### Step 2: Create Fresh App
After deleting the old one:
1. **Application root**: `/home/simonsta/public_html/businessdailydeals-fixed`
2. **Application startup file**: `app.js`
3. **Passenger log file**: `/home/simonsta/logs/businessdailydeals.log`
4. Click **"Create"**

### Step 3: Verify app.js File Exists
Make sure `/home/simonsta/public_html/businessdailydeals-fixed/app.js` exists with the correct content.

### Step 4: Start the App
Click **"Start"** for the newly created app.

## Alternative: Contact Cybersmart Support
If you can't find a way to delete the existing app, contact Cybersmart support and ask them to:
1. Delete the existing Node.js app for `/home/simonsta/public_html/businessdailydeals-fixed`
2. Create a new one with startup file `app.js`
3. Make sure the `app.js` file exists in the root directory

This should resolve the "directory already used" error.