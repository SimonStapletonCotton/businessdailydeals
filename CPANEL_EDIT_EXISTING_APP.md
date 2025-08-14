# cPanel: Edit Existing Node.js App (Don't Create New One)

## ISSUE: Getting "Directory already used" error when trying to save

This means you're in the CREATE NEW APP section instead of EDIT EXISTING APP.

## SOLUTION: Find and Edit the Existing App

### Step 1: Look for Your Existing App
In the Node.js Selector page, scroll down to find a section that shows **EXISTING APPLICATIONS** or **CURRENT APPLICATIONS**.

You should see an entry like:
- **Directory**: `/home/simonsta/public_html/businessdailydeals-fixed/`
- **Status**: Running or Stopped
- **Actions**: Edit | Delete | Start | Stop | Restart

### Step 2: Click "Edit" on the Existing App
Click the **"Edit"** button (NOT create new app) for the existing `businessdailydeals-fixed` application.

### Step 3: Update the Startup File
In the edit screen:
- Change **"Application startup file"** from `server/index.js` to `app.js`
- Leave everything else the same
- Click **"Save"**

### Step 4: Create app.js File
- Go to File Manager
- Navigate to: `/home/simonsta/public_html/businessdailydeals-fixed/`
- Create new file: `app.js`
- Copy content from the code provided earlier

### Step 5: Restart the App
Back in Node.js Selector, click **"Restart"** for your app.

## KEY POINT:
Don't use "Create Application" - use "Edit" on the existing application that's already configured for your directory.