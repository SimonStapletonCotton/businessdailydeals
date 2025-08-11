# Cybersmart Server Setup for Business Daily Deals

## Required Modifications for Cybersmart Compatibility

### 1. Database Migration (PostgreSQL → MySQL)
- Convert Drizzle schema to MySQL format
- Update database connection configuration
- Modify data types for MySQL compatibility
- Update migration scripts

### 2. Remove PM2 Dependencies
- Use standard Node.js process management
- Implement graceful shutdown handling
- Add process restart capabilities within Node.js

### 3. Cybersmart Configuration Requirements
- Node.js version: 18, 19, or 20 (confirmed available)
- SSL certificate: Available for businessdailydeals.co.za
- Web server: Nginx (available)
- Database: MySQL (need to confirm with Cybersmart)

## Email to Send to Cybersmart

**Subject:** Database Requirements for Website 155365 - Business Daily Deals

Hi Cybersmart Team,

Following your response about Node.js availability, I need to confirm database support for my B2B marketplace application:

**Required Database Features:**
- MySQL database server
- Database creation and management access
- Support for database connections from Node.js
- Backup and restore capabilities
- Database size limit information

**Additional Questions:**
1. What MySQL versions are available?
2. How do I access database management (phpMyAdmin/cPanel)?
3. What are the database size and connection limits?
4. Can you provide database connection details (host, port, credentials)?
5. Do you support automated database backups?

**Application Details:**
- Node.js B2B marketplace with user authentication
- Image upload and storage capabilities
- PayFast payment integration
- Email notification system

Please confirm MySQL availability so I can proceed with the application setup.

Best regards,
Simon

## Technical Implementation Plan

### Phase 1: Database Schema Conversion
1. Convert PostgreSQL schema to MySQL
2. Update Drizzle configuration for MySQL
3. Test database operations

### Phase 2: Deployment Configuration
1. Remove PM2 dependencies
2. Create standard Node.js startup script
3. Configure environment variables

### Phase 3: Testing & Deployment
1. Test full application with MySQL
2. Prepare deployment package
3. Upload to Cybersmart server

## Estimated Timeline
- Database conversion: 2-3 hours
- Testing and validation: 1-2 hours
- Deployment preparation: 1 hour
- **Total: 4-6 hours of development work**

This approach keeps you with Cybersmart while maintaining all application functionality.