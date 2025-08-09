# Business Daily Deals - Production Deployment Requirements

**To:** hosting@cybersmart.co.za  
**CC:** simons@cybersmart.co.za  
**Subject:** Production Deployment Request - Business Daily Deals B2B Marketplace

## Project Overview

Business Daily Deals (www.businessdailydeals.co.za) is a full-stack B2B marketplace for the South African market. The application is currently developed and tested on Replit and ready for production deployment.

## Technical Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with Shadcn/ui components
- **State Management:** TanStack Query for server state

### Backend
- **Runtime:** Node.js (v18+ recommended)
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Replit OpenID Connect (OIDC)
- **Session Storage:** PostgreSQL with express-session

## Server Requirements

### Hosting Environment
- **Node.js:** Version 18 or higher
- **Process Manager:** PM2 or similar for production stability
- **Reverse Proxy:** Nginx (recommended) for static file serving and SSL termination
- **SSL Certificate:** Required for HTTPS (Let's Encrypt recommended)

### Database Requirements
- **PostgreSQL:** Version 13+ 
- **Database Name:** businessdailydeals (or as preferred)
- **Connection Pooling:** Configured for production load
- **Backup Strategy:** Daily automated backups recommended

## Environment Variables Required

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name
PGHOST=your_postgres_host
PGPORT=5432
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=businessdailydeals

# Application Configuration
NODE_ENV=production
PORT=5000
SESSION_SECRET=your_secure_random_session_secret_here

# Authentication (Replit OIDC)
REPLIT_CLIENT_ID=your_replit_client_id
REPLIT_CLIENT_SECRET=your_replit_client_secret
REPLIT_REDIRECT_URI=https://businessdailydeals.co.za/api/auth/callback

# Optional: Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_if_needed
```

## Domain Configuration

- **Primary Domain:** www.businessdailydeals.co.za
- **SSL Required:** Yes (HTTPS only)
- **DNS Configuration:** A record pointing to your server IP
- **CDN:** Optional but recommended for static assets

## Deployment Steps

### 1. Server Setup
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install PostgreSQL (if not using external service)
sudo apt-get install postgresql postgresql-contrib
```

### 2. Application Deployment
```bash
# Clone/upload application code
# Navigate to application directory
cd /path/to/businessdailydeals

# Install dependencies
npm install

# Build production assets
npm run build

# Set up database schema
npm run db:push

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. Database Migration
- Transfer database schema using provided SQL dump or Drizzle migrations
- Import any existing data from development environment
- Set up regular backup schedule

### 4. SSL and Domain
- Configure SSL certificate (Let's Encrypt recommended)
- Set up Nginx reverse proxy configuration
- Point domain DNS to server IP address

## Application Structure

```
businessdailydeals/
├── client/                 # React frontend
├── server/                 # Express.js backend
├── shared/                 # Shared types and schemas
├── migrations/             # Database migrations
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS config
└── tsconfig.json          # TypeScript configuration
```

## Key Features to Test After Deployment

1. **User Registration:** Both buyer and supplier registration flows
2. **Authentication:** Login/logout functionality
3. **Deal Management:** Creating, editing, and browsing deals
4. **Search Functionality:** Deal search and filtering
5. **Credit System:** Credit package purchasing and balance management
6. **File Uploads:** Deal images and supplier verification documents
7. **Email Notifications:** Deal alerts and system notifications
8. **Responsive Design:** Mobile and desktop compatibility

## Production Monitoring

### Recommended Monitoring
- **Application Logs:** PM2 logs or centralized logging
- **Database Performance:** PostgreSQL query monitoring
- **Server Resources:** CPU, memory, disk usage
- **Uptime Monitoring:** External service to monitor availability
- **SSL Certificate:** Monitor expiration dates

### Performance Optimization
- **Static File Caching:** Nginx configuration for CSS/JS/images
- **Database Indexing:** Ensure proper indexes on search columns
- **Connection Pooling:** Configure appropriate pool sizes
- **Compression:** Enable gzip compression for responses

## Security Considerations

- **HTTPS Only:** Redirect all HTTP traffic to HTTPS
- **Security Headers:** Implement CSP, HSTS, and other security headers
- **Rate Limiting:** Implement API rate limiting
- **Input Validation:** All user inputs are validated server-side
- **SQL Injection Protection:** Using Drizzle ORM with parameterized queries
- **Session Security:** Secure session configuration with httpOnly cookies

## Support and Maintenance

- **Initial Testing Period:** 1-2 weeks of monitoring after deployment
- **Regular Updates:** Plan for application updates and security patches
- **Database Maintenance:** Regular VACUUM and ANALYZE operations
- **Backup Verification:** Regular backup restoration tests

## Contact Information

For technical questions during deployment:
- **Development Contact:** simons@cybersmart.co.za
- **Hosting Contact:** hosting@cybersmart.co.za

## Deployment Checklist

- [ ] Server environment prepared (Node.js, PostgreSQL)
- [ ] Database created and configured
- [ ] Environment variables set
- [ ] Application code deployed
- [ ] Dependencies installed
- [ ] Database schema migrated
- [ ] SSL certificate configured
- [ ] Domain DNS pointed to server
- [ ] PM2 process manager configured
- [ ] Nginx reverse proxy set up
- [ ] Firewall configured (ports 80, 443 open)
- [ ] Monitoring tools configured
- [ ] Initial functionality testing completed
- [ ] Backup procedures established

## Estimated Timeline

- **Server Setup:** 1-2 days
- **Application Deployment:** 1 day
- **Testing and Optimization:** 2-3 days
- **Go-Live:** 4-6 days total

Please confirm receipt of these requirements and provide an estimated timeline for deployment. We are ready to proceed with making Business Daily Deals live at www.businessdailydeals.co.za.