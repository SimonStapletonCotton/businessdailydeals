# Business Daily Deals - Server Setup Guide for Cybersmart

**For**: Priya @ Cybersmart  
**Date**: January 9, 2025  
**Project**: www.businessdailydeals.co.za  

## IMMEDIATE ACTION REQUIRED

### 1. Node.js Installation
**REQUIRED**: Node.js version 18.0 or higher
```bash
# Check current version
node --version

# If less than v18.0.0, install Node.js 18+
# Use your preferred method (nvm, package manager, etc.)
```

### 2. MySQL Database Setup
**REQUIRED**: MySQL 8.0+ database with the following credentials needed:
- Database name: `businessdailydeals` (or your preferred name)
- Username and password for database access
- Host: `localhost` (unless using remote database)
- Port: `3306` (unless using custom port)

### 3. Environment Variables Configuration
Create these environment variables (can be configured in application code):

```bash
# Database Connection
DATABASE_URL="mysql://[username]:[password]@localhost:3306/[database_name]"

# Application Security
SESSION_SECRET="[generate_random_64_character_string]"
NODE_ENV="production"
PORT="3000"

# Authentication (Replit OIDC)
REPLIT_CLIENT_ID="[will_be_provided_separately]"
REPLIT_CLIENT_SECRET="[will_be_provided_separately]"
CALLBACK_URL="https://businessdailydeals.co.za/api/auth/callback"

# Email Service (Optional - for notifications)
SENDGRID_API_KEY="[optional_for_email_notifications]"
FROM_EMAIL="noreply@businessdailydeals.co.za"
```

### 4. Apache Configuration
Ensure your Apache configuration supports:
- **Mod_rewrite** (for URL routing)
- **Mod_proxy** (for Node.js proxying) 
- **Mod_headers** (for security headers)

The `.htaccess` file is already included in the project files.

## DEPLOYMENT PROCESS

### Step 1: File Upload
Upload all project files to your hosting directory:
- Complete project folder structure
- Includes: `client/`, `server/`, `shared/`, `package.json`, `.htaccess`

### Step 2: Install Dependencies
Run in hosting terminal:
```bash
npm install --production
```

### Step 3: Database Initialization
Run database setup:
```bash
node migrate.js
```

### Step 4: Start Application
```bash
node server/index.production.js
```

## TECHNICAL REQUIREMENTS SUMMARY

✅ **CONFIRMED AVAILABLE (from our previous discussion):**
- Node.js 18+ support
- MySQL database  
- Apache web server
- SSL Certificate (will be handled by Cybersmart)
- Environment variable configuration

❌ **NOT REQUIRED (alternatives already prepared):**
- PostgreSQL (using MySQL instead)
- PM2 process manager (using Node.js clustering)
- Nginx (using Apache configuration)

## TESTING CHECKLIST

After deployment, please verify:
1. **Application starts**: `https://businessdailydeals.co.za` loads
2. **Database connected**: No database connection errors in logs
3. **SSL working**: Green padlock in browser
4. **Static files loading**: Images, CSS, JavaScript working
5. **Authentication ready**: Login system accessible

## DEPENDENCIES BREAKDOWN

**Core Runtime:**
- Node.js 18+ (TypeScript execution)
- MySQL 8+ (Database)
- Apache 2.4+ (Web server)

**Node.js Packages** (automatically installed with `npm install`):
- Express.js (Backend framework)
- React 18 (Frontend framework)  
- Drizzle ORM (Database operations)
- Passport.js (Authentication)
- 80+ other packages (all listed in package.json)

## FILES PROVIDED

The deployment package includes:
- **Application Code**: Full React + Express application
- **Database Schema**: MySQL-compatible database structure
- **Apache Configuration**: `.htaccess` with security headers and routing
- **Migration Script**: `migrate.js` for database setup
- **Production Server**: `server/index.production.js` with clustering

## SECURITY FEATURES INCLUDED

- Rate limiting on API endpoints
- SQL injection protection via parameterized queries
- XSS protection with content security policies
- Session security with HTTP-only cookies
- CSRF protection
- Input validation on all forms
- Security headers in Apache configuration

## CONTACT FOR TECHNICAL SUPPORT

- **Primary**: admin@businessdailydeals.co.za
- **Technical Issues**: Available for troubleshooting after deployment
- **Hosting Support**: Continue with Priya @ Cybersmart

## NEXT STEPS FOR CYBERSMART

1. **Confirm Node.js 18+ is installed**
2. **Create MySQL database and provide credentials**
3. **Upload project files to hosting directory**
4. **Configure environment variables**
5. **Run installation commands listed above**
6. **Test basic functionality**
7. **Confirm SSL certificate is active**

---

**IMPORTANT**: This is a production-ready application with comprehensive testing. All components are compatible with your hosting infrastructure as confirmed in our previous communications.

**STATUS**: ✅ Ready for immediate deployment