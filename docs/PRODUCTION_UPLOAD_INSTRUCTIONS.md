# Production Upload Instructions - Business Daily Deals

## CYBERSMART DEPLOYMENT STEPS

### Step 1: Access cPanel File Manager
1. Log into your Cybersmart cPanel
2. Open File Manager
3. Navigate to public_html directory

### Step 2: Upload Production Package
1. Upload `businessdailydeals-upload.tar.gz` to public_html
2. Extract the archive (right-click → Extract)
3. This will create all necessary files and folders

### Step 3: Verify File Structure
Your public_html should now contain:
```
public_html/
├── server/           (Backend Node.js application)
├── client/           (React frontend build)
├── shared/           (Shared database schemas)
├── package.json      (Dependencies - now corrected by Cybersmart)
├── .htaccess         (URL rewriting rules)
├── app.js           (Main application entry point)
└── node_modules/     (Dependencies installed by Cybersmart)
```

### Step 4: Environment Configuration
MySQL credentials are already configured:
- MYSQL_HOST=localhost
- MYSQL_USER=[your_username]  
- MYSQL_PASSWORD=[your_password]
- MYSQL_DATABASE=[your_database]

### Step 5: Database Initialization
The application will automatically:
1. Detect MySQL credentials
2. Create database tables via Drizzle migrations
3. Populate with 13 sample deals and professional images
4. Set up credit system with promotional period until Feb 20, 2026

### Step 6: Restart Application (if needed)
In cPanel → Node.js Apps:
1. Click "Restart" for Business Daily Deals app
2. Verify Status shows "Running"

### Step 7: Test Website
Visit www.businessdailydeals.co.za and verify:
- Homepage loads with orange casino theme
- 8 Hot Deals visible on homepage
- 5 Regular Deals in dropdown menu
- Supplier registration works
- Buyer search functions
- All images load properly

## SUPPORT CONTACT
Priya - Cybersmart Hosting Support
(Technical team has already resolved Passenger configuration)

## SUCCESS INDICATORS
✅ Homepage displays "Business Daily Deals B2B Marketplace"
✅ All 13 deals show professional business images  
✅ FREE promotional banner until Feb 20, 2026
✅ Supplier dashboard accessible
✅ Credit system shows no charges during promotional period
✅ Mobile responsive design works across devices

Your complete B2B marketplace is ready for production deployment!