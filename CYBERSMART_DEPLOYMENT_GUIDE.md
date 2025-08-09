# Business Daily Deals - Cybersmart Deployment Guide

## Deployment Confirmation from Cybersmart (January 2025)

✅ **Confirmed Available:**
- Node.js 18+ support
- SSL Certificate (will be provided and configured by Cybersmart)  
- MySQL database
- Apache web server
- Environment variables (configured in application code)

❌ **Not Available:**
- PostgreSQL (MySQL required instead)
- PM2 process manager (Node.js clustering used instead)
- Nginx reverse proxy (Apache handles this)

## Pre-Deployment Checklist

### 1. Database Configuration
- [x] MySQL schema ready (`drizzle.config.mysql.ts`)
- [x] MySQL storage adapter ready (`server/storage.mysql.ts`)
- [x] Database connection configured for MySQL
- [ ] Update production environment to use MySQL config

### 2. Server Configuration
- [x] Apache .htaccess file ready
- [x] Node.js clustering for process management
- [x] Production server entry point (`server/index.production.js`)
- [ ] Environment variables configured for production

### 3. SSL and Domain
- [ ] SSL certificate installation (handled by Cybersmart)
- [ ] Domain pointing to businessdailydeals.co.za
- [ ] DNS configuration confirmed

## Deployment Steps

### Step 1: Upload Files
Upload the entire project to the Cybersmart hosting directory:
```
/public_html/
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared schema and types
├── migrations/      # Database migration files
├── .htaccess        # Apache configuration
├── package.json     # Dependencies
├── package-lock.json
└── migrate.js       # Database migration script
```

### Step 2: Install Dependencies
Run in the hosting terminal:
```bash
npm install --production
```

### Step 3: Configure Environment Variables
Create/update environment variables in the application:
```bash
# Database
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# Authentication (Replit OIDC for production)
REPLIT_CLIENT_ID="your_client_id"
REPLIT_CLIENT_SECRET="your_client_secret"
CALLBACK_URL="https://businessdailydeals.co.za/api/auth/callback"

# Session Security
SESSION_SECRET="your_secure_session_secret"

# Email Service (Optional)
SENDGRID_API_KEY="your_sendgrid_key"
FROM_EMAIL="noreply@businessdailydeals.co.za"

# Node Environment
NODE_ENV="production"
PORT="3000"
```

### Step 4: Database Setup
Run database migrations:
```bash
node migrate.js
```

### Step 5: Start Application
```bash
node server/index.production.js
```

## Production Configuration Files

### Apache .htaccess
```apache
RewriteEngine On

# Handle Node.js application
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>
```

### Process Management (server/index.production.js)
```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < Math.min(numCPUs, 4); i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Start the application
  require('./index.ts');
  console.log(`Worker ${process.pid} started`);
}
```

## Post-Deployment Verification

### 1. Health Checks
- [ ] Application loads at https://businessdailydeals.co.za
- [ ] Database connection working
- [ ] Authentication system functional
- [ ] SSL certificate active
- [ ] All pages accessible

### 2. Functionality Tests
- [ ] User registration (buyer/supplier)
- [ ] Deal posting and browsing
- [ ] Search functionality
- [ ] Credit system working
- [ ] Email notifications
- [ ] Mobile responsiveness

### 3. Performance Monitoring
- [ ] Page load times acceptable
- [ ] Database queries optimized
- [ ] Static asset caching working
- [ ] Memory usage within limits

## Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Verify MySQL credentials
   - Check database exists
   - Confirm host/port settings

2. **Authentication Issues**
   - Verify Replit OIDC configuration
   - Check callback URL matches domain
   - Confirm session secret is set

3. **Static Files Not Loading**
   - Check Apache .htaccess configuration
   - Verify file permissions
   - Confirm build process completed

4. **Application Won't Start**
   - Check Node.js version (requires 18+)
   - Verify all dependencies installed
   - Review application logs

## Support Contacts

- **Cybersmart Hosting**: Priya (hosting support)
- **Application Support**: admin@businessdailydeals.co.za
- **Technical Issues**: Contact development team

## Security Notes

- All environment variables contain sensitive data
- Database credentials must be secured
- SSL certificate ensures encrypted communication
- Session secrets should be randomly generated
- Regular security updates recommended

---

**Last Updated**: January 9, 2025
**Status**: Ready for Production Deployment