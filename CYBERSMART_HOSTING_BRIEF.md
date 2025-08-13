# Business Daily Deals - Cybersmart Hosting Brief

## Project Overview
Business Daily Deals (www.businessdailydeals.co.za) is a complete B2B marketplace for the South African market. The platform connects suppliers and buyers through targeted deal notifications and special pricing.

## Technical Requirements

### Server Environment
- **Node.js**: Version 18+ required
- **Operating System**: Linux (Ubuntu/CentOS preferred)
- **RAM**: Minimum 2GB, recommended 4GB
- **Storage**: Minimum 20GB SSD
- **Bandwidth**: Standard business hosting package

### Database Requirements
- **MySQL**: Version 8.0+ required
- **Database Name**: [Your choice - e.g., businessdailydeals]
- **Storage**: Minimum 5GB, growth capacity needed
- **Backup**: Daily automated backups required

### Domain Configuration
- **Primary Domain**: www.businessdailydeals.co.za
- **SSL Certificate**: Required (Let's Encrypt acceptable)
- **DNS Management**: Full control needed for subdomain setup

### Application Specifications
- **Framework**: Node.js Express application
- **Port**: Application runs on port 5000 (configurable)
- **Static Files**: Includes frontend assets and images
- **File Uploads**: Image upload functionality via Google Cloud Storage

## Services Integration Required

### Email Services
- **Provider**: SendGrid integration
- **Purpose**: Automated notifications, payment confirmations
- **Volume**: Low to medium (< 1000 emails/month initially)

### Payment Gateway
- **Provider**: PayFast (South African payment processor)
- **Integration**: Webhook endpoints required
- **Security**: HTTPS mandatory for payment processing

### Cloud Storage
- **Provider**: Google Cloud Storage (already configured)
- **Purpose**: Product image storage and serving
- **Access**: API-based integration (no server-side storage needed)

## Environment Variables Needed
Please set up these environment variables on your server:

### Database Configuration
```
MYSQL_HOST=localhost
MYSQL_USER=[your_mysql_username]
MYSQL_PASSWORD=[your_mysql_password]  
MYSQL_DATABASE=[your_database_name]
DATABASE_URL=mysql://[user]:[password]@localhost:3306/[database]
```

### Application Settings
```
NODE_ENV=production
PORT=5000
```

### External Service Keys (Client will provide)
```
SENDGRID_API_KEY=[client_provides]
DEFAULT_OBJECT_STORAGE_BUCKET_ID=[client_provides]
PUBLIC_OBJECT_SEARCH_PATHS=[client_provides]
PRIVATE_OBJECT_DIR=[client_provides]
```

## Deployment Process

### 1. Initial Setup
- Install Node.js 18+
- Install MySQL 8.0+
- Configure domain DNS pointing
- Install SSL certificate

### 2. Application Deployment
- Upload application files to server
- Run `npm install` to install dependencies
- Configure environment variables
- Import database schema (provided)

### 3. Service Configuration
- Configure reverse proxy (Nginx recommended)
- Set up process manager (PM2 recommended)
- Configure firewall (ports 80, 443, 22)
- Enable automated backups

### 4. Testing Checklist
- Website loads at www.businessdailydeals.co.za
- MySQL connection working
- SSL certificate active
- Email notifications sending
- File uploads functioning

## Ongoing Maintenance Required

### Server Management
- **OS Updates**: Regular security updates
- **Application Updates**: Code deployment capability
- **Monitoring**: Server health monitoring
- **Backups**: Daily database and file backups

### Support Requirements
- **Uptime**: 99.9% uptime target
- **Response Time**: 4-hour response for critical issues
- **Backup Retention**: 30-day backup retention minimum
- **Log Access**: Web server and application logs accessible

## Security Requirements

### Essential Security Measures
- **Firewall**: Only necessary ports open (22, 80, 443)
- **SSH**: Key-based authentication only
- **SSL**: Force HTTPS redirect
- **Updates**: Automated security updates
- **Access Control**: Limited user access with proper permissions

### Application Security
- **Rate Limiting**: Application includes built-in rate limiting
- **Input Validation**: All user inputs validated
- **Session Security**: Secure session management implemented
- **Payment Security**: PCI-compliant payment processing

## Expected Traffic & Growth
- **Initial**: 50-100 daily users
- **6 Month**: 500-1000 daily users  
- **12 Month**: 2000-5000 daily users
- **Peak Times**: Business hours (8 AM - 6 PM SAST)

## Additional Services Needed

### Email Setup
- Business email accounts for support@businessdailydeals.co.za
- Email forwarding capability
- Spam filtering

### Monitoring & Analytics
- Server performance monitoring
- Uptime monitoring with alerts
- Basic web analytics setup

## Files & Documentation Provided
1. Complete application source code
2. Database schema and initial data
3. Deployment scripts and configuration
4. Environment setup documentation
5. Production cleanup scripts

## Support Contacts
- **Technical Lead**: [Your contact information]
- **Project Owner**: [Business owner contact]
- **Preferred Communication**: Email, WhatsApp business hours

## Go-Live Timeline
- **Server Setup**: 2-3 business days
- **Application Deployment**: 1 business day  
- **Testing & Validation**: 1-2 business days
- **Total Timeline**: 5-7 business days

## Cost Expectations
Please provide hosting quotes for:
- Server hosting (specs above)
- MySQL database hosting
- Domain management
- SSL certificate
- Email services
- Monthly maintenance

---

**Note**: This is a complete, production-ready B2B marketplace with full functionality including user authentication, payment processing, email notifications, and file management. The application has been tested and is currently running successfully.