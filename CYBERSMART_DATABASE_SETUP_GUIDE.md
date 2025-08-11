# Cybersmart MySQL Database Setup Guide

## Instructions from Cybersmart (Received: August 11, 2025)

### Step 1: Access cPanel
1. **Login URL**: https://cpanel26.mywebserver.co.za:2083/
2. **Use your provided login details**

### Step 2: Create MySQL Database
1. **Navigate to**: "Manage My Databases" interface in cPanel
2. **Actions available**:
   - Create a new database
   - Create a database username and assign it to the database

### Step 3: Access phpMyAdmin
1. **Access**: phpMyAdmin interface in cPanel
2. **Purpose**: Create and manage the database structure

### Step 4: Notify Cybersmart
- **Contact**: Let them know once backup/database has been created
- **Support**: Available for further assistance

---

## Database Setup for Business Daily Deals

### Recommended Database Configuration

**Database Name**: `businessdailydeals_db` (or follow Cybersmart's naming convention)
**Database User**: Create dedicated user for the application
**Tables to Create**: Will be automatically created via our schema migration

### Schema Deployment Process

Once you have the database credentials:

1. **Update Environment Variables**:
```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=[your_database_name]
MYSQL_USER=[your_database_user]
MYSQL_PASSWORD=[your_database_password]
MYSQL_DATABASE_URL=mysql://[user]:[password]@localhost:3306/[database_name]
```

2. **Switch Application to MySQL**:
   - Change 2 import lines in `server/storage.ts`
   - From PostgreSQL schema to MySQL schema

3. **Deploy Schema**:
   - Run database migration to create all 15+ tables
   - Initialize with proper indexes and relationships

4. **Test Connection**:
   - Verify all application features work with MySQL
   - Test deal posting, user registration, credit system

### Application Tables to be Created

The schema will automatically create:
- ✅ **users** - Buyer and supplier accounts
- ✅ **deals** - Hot and regular deals
- ✅ **inquiries** - Buyer-supplier communication  
- ✅ **coupons** - Deal acceptance coupons
- ✅ **keywords** - Notification keywords
- ✅ **notifications** - Alert system
- ✅ **creditTransactions** - Payment tracking
- ✅ **rates** - Advertising rates
- ✅ **companies** - Business directory
- ✅ **bannerAds** - Advertisement system
- ✅ **dealRequests** - "Find Me a Deal" requests
- ✅ **orders** - Purchase tracking
- ✅ **siteAnalytics** - Business statistics
- ✅ **basketItems** - Shopping cart
- ✅ **sessions** - User sessions

**Total: 15 tables with complete relationships and indexes**

---

## Next Steps for You

1. **Follow Cybersmart's cPanel instructions** to create the database
2. **Note down the database credentials** (name, username, password)
3. **Share credentials with me** so I can configure the application
4. **Deploy application** - estimated 2-3 hours after credentials received

Your MySQL conversion is **100% ready** - we just need the database credentials to activate it!