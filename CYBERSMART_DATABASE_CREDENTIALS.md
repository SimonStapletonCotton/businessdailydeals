# Cybersmart MySQL Database Credentials

## Database Connection Details (Received August 11, 2025)

### MySQL Credentials
- **Database User**: `simonsta_user`
- **Database Password**: `+9#XPRw!{~8K`
- **Database Name**: [Existing database - check "MySQL® Databases" interface in cPanel]
- **Host**: `localhost`
- **Port**: `3306`

### Access Information
- **cPanel Login**: https://cpanel26.mywebserver.co.za:2083/
- **Database Management**: "MySQL® Databases" interface within cPanel
- **Database Access**: phpMyAdmin interface

### Connection String Format
```bash
mysql://simonsta_user:+9#XPRw!{~8K@localhost:3306/[database_name]
```

## Next Steps
1. ✅ Database user created and assigned
2. 🔄 **Current**: Need to identify existing database name via cPanel
3. 📋 **Ready**: Switch application to MySQL configuration
4. 🚀 **Deploy**: Push database schema and test application

## Application Configuration
Once database name is confirmed, update environment variables:
```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=[database_name_from_cpanel]
MYSQL_USER=simonsta_user
MYSQL_PASSWORD=+9#XPRw!{~8K
MYSQL_DATABASE_URL=mysql://simonsta_user:+9#XPRw!{~8K@localhost:3306/[database_name]
```

## Security Note
Password contains special characters: `+9#XPRw!{~8K`
Ensure proper URL encoding if needed: `%2B9%23XPRw%21%7B~8K`