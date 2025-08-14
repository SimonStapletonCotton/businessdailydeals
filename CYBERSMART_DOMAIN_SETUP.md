# Cybersmart Domain Setup for businessdailydeals.co.za

## Step-by-Step Instructions for Cybersmart Customers

### Step 1: Get Your DNS Records from Replit
1. In your Replit project, click **"Deployments"** tab at the top
2. Click **"Deploy"** button (creates official deployment)
3. After deployment, click **"Settings"** 
4. Click **"Link a domain"**
5. Enter: `businessdailydeals.co.za`
6. Replit will show you records like:
   - **A Record**: `@` → IP address (e.g., 123.45.67.89)
   - **TXT Record**: Verification code

### Step 2: Access Your Cybersmart Account
1. Go to **cybersmart.co.za**
2. Click **"Client Login"** or **"My Account"**
3. Log in with your Cybersmart username/password
4. Find your domain: **businessdailydeals.co.za**

### Step 3: Find DNS Management in Cybersmart
Look for one of these sections:
- **"Domain Management"**
- **"DNS Zone Editor"** 
- **"DNS Management"**
- **"Advanced DNS"**
- **"Name Server Management"**

### Step 4: Add DNS Records in Cybersmart
1. **Delete existing A records** (if any point to old servers)
2. **Add new A Record**:
   - **Name/Host**: `@` or leave blank
   - **Type**: A
   - **Value/Points to**: The IP address from Replit
   - **TTL**: 3600 (or leave default)

3. **Add TXT Record** (if Replit provided one):
   - **Name/Host**: As specified by Replit
   - **Type**: TXT  
   - **Value**: The verification code from Replit
   - **TTL**: 3600 (or leave default)

4. **Add www subdomain** (optional but recommended):
   - **Name/Host**: `www`
   - **Type**: A
   - **Value/Points to**: Same IP address from Replit
   - **TTL**: 3600

### Step 5: Save and Wait
1. Click **"Save"** or **"Update Zone"**
2. Wait 10 minutes to 48 hours for changes to take effect
3. Test by visiting: `businessdailydeals.co.za`

## Cybersmart Support Contact
If you get stuck:
- **Phone**: 087 820 7700
- **Email**: support@cybersmart.co.za
- **Help Desk**: Available via your Cybersmart account

## What You'll Achieve
✅ **Professional URL**: www.businessdailydeals.co.za
✅ **Perfect for marketing** to South African suppliers and buyers
✅ **Same marketplace functionality** with professional branding
✅ **Business credibility** with local .co.za domain

## Troubleshooting
- If records don't save: Contact Cybersmart support
- If domain doesn't work after 48 hours: Check with Cybersmart
- If you can't find DNS settings: Ask Cybersmart where to manage DNS for your domain

Your Business Daily Deals marketplace will then be accessible at the professional domain instead of the technical Replit URL.