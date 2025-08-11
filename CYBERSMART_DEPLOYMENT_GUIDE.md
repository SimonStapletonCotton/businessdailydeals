# Business Daily Deals - Cybersmart Deployment Guide

## Project Overview
Business Daily Deals is a full-stack B2B marketplace for the South African market connecting suppliers and buyers. The platform is built with Node.js, React, TypeScript, and PostgreSQL.

**Domain:** www.businessdailydeals.co.za

## Technical Requirements

### Server Environment
- **Node.js:** Version 18 or higher
- **Database:** PostgreSQL (latest stable version)
- **SSL Certificate:** Required for www.businessdailydeals.co.za
- **File Storage:** Local file storage OR Google Cloud Storage integration
- **Email Support:** SMTP or SendGrid integration capability

### Domain Configuration
- Point www.businessdailydeals.co.za to your server
- Configure SSL/HTTPS (essential for authentication and payments)
- Ensure proper DNS propagation

### Database Setup
Please provide:
- PostgreSQL database with full admin access
- Database connection URL in this format:
  ```
  postgresql://username:password@host:port/database_name
  ```

### Environment Variables
Configure these environment variables on your server:

```bash
# Database
DATABASE_URL=postgresql://[your_provided_connection_string]

# Application
NODE_ENV=production
PORT=80
SESSION_SECRET=[generate_secure_random_string_64_chars]

# Additional variables will be provided for:
# - SENDGRID_API_KEY (for email notifications)
# - PAYFAST credentials (for payments)
# - Google Cloud Storage (if using cloud storage)
```

## Deployment Process

### Step 1: Code Deployment
1. We will provide you with the complete application codebase
2. Extract to your web server directory
3. Install dependencies: `npm install`
4. Build the application: `npm run build` (if required)

### Step 2: Database Setup
1. Create the PostgreSQL database
2. Run database migrations: `npm run db:push`
3. Verify database connection

### Step 3: Application Startup
1. Start the application: `npm start`
2. Verify the application runs on your assigned port
3. Test access via www.businessdailydeals.co.za

### Step 4: SSL and Security
1. Configure SSL certificate for HTTPS
2. Ensure all traffic redirects to HTTPS
3. Verify secure connection for login functionality

## File Upload Configuration

### Option A: Local File Storage
- Ensure sufficient disk space for user uploads
- Configure proper file permissions
- Set up backup procedures for uploaded files

### Option B: Google Cloud Storage (Recommended)
- We can provide Google Cloud Storage credentials
- More scalable and reliable for production use
- Automatic backup and CDN capabilities

## Payment Integration Requirements

### PayFast Webhook Support
- Server must support incoming webhook POST requests
- HTTPS required for PayFast integration
- Webhook endpoints will be configured at:
  - `/api/payfast/success`
  - `/api/payfast/coupon-success`

## Email Notifications

### SendGrid Integration
- We will provide SendGrid API key when ready
- Used for deal notifications and payment confirmations
- Admin notifications sent to: admin@businessdailydeals.co.za

## Monitoring and Maintenance

### Health Checks
- Application provides health check endpoint: `/api/health`
- Monitor this endpoint for application status
- Database connectivity verification included

### Log Files
- Application logs important events and errors
- Please ensure log rotation is configured
- Monitor for any database connection issues

## Security Considerations

- HTTPS is mandatory for all traffic
- Session data is stored securely in PostgreSQL
- Rate limiting is implemented in the application
- Input validation and sanitization included

## Support and Testing

### Pre-Launch Testing
1. Verify all pages load correctly
2. Test user registration and login
3. Confirm deal posting functionality
4. Validate image uploads work properly
5. Test email notifications (when configured)

### Go-Live Checklist
- [ ] Domain points to server
- [ ] SSL certificate active
- [ ] Database connected and migrated
- [ ] Application starts without errors
- [ ] File uploads working
- [ ] Health check endpoint responding
- [ ] Email notifications configured (optional initially)

## Contact Information
Once deployment begins, we can provide:
- Real-time support during setup
- Additional configuration details as needed
- Testing assistance before go-live

## Next Steps
1. Confirm technical requirements can be met
2. Provide database connection details
3. Schedule deployment window
4. We'll prepare the complete codebase package

Please confirm if you can meet these requirements and provide the database connection details when ready.