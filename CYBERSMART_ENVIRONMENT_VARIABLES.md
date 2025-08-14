# Cybersmart Environment Variables Setup

## Required Environment Variables for Business Daily Deals

You need to add these environment variables in your Node.js app configuration:

### Database Variables (From Cybersmart MySQL Credentials)
```
MYSQL_HOST=localhost
MYSQL_USER=[your_mysql_username]
MYSQL_PASSWORD=[your_mysql_password]  
MYSQL_DATABASE=[your_database_name]
```

### Application Variables
```
NODE_ENV=production
PORT=5000
SESSION_SECRET=business-daily-deals-production-secret
```

### Optional (if you have them)
```
SENDGRID_API_KEY=[your_sendgrid_key]
PAYFAST_MERCHANT_ID=[your_payfast_id]
PAYFAST_MERCHANT_KEY=[your_payfast_key]
```

## How to Add Environment Variables in cPanel:

1. **In your Node.js app configuration** (when editing the app)
2. **Look for "Environment Variables" section**
3. **Add each variable** as Name=Value pairs
4. **Save the configuration**
5. **Restart the app**

## Important Notes:
- Use `MYSQL_HOST=localhost` (Cybersmart confirmed this works on their servers)
- The MySQL credentials should have been provided by Cybersmart when they set up your database
- Your app is designed to automatically detect MySQL credentials and use them instead of PostgreSQL

## If You Don't Have MySQL Credentials:
Contact Cybersmart support and request:
- MySQL database username
- MySQL database password  
- MySQL database name
- Confirm that MYSQL_HOST=localhost

Once you add these environment variables and restart the app, your marketplace will connect to the Cybersmart MySQL database and display properly.