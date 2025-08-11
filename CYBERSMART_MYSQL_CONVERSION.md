# Cybersmart MySQL Database Configuration

## Cybersmart MySQL Details (Confirmed)

✅ **MySQL Version**: 5.7.44
✅ **Database Management**: phpMyAdmin via cPanel
✅ **Storage Limit**: 51,200 MB (50GB)
✅ **Connection Limit**: 151 concurrent connections
✅ **Connection Details**: localhost only, port 3306
✅ **Backups**: Weekly automated backups
✅ **Domain**: businessdailydeals.co.za

## Database Connection Configuration

### Environment Variables for Production
```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=businessdailydeals_db
MYSQL_USER=[to be provided by Cybersmart]
MYSQL_PASSWORD=[to be provided by Cybersmart]
MYSQL_DATABASE_URL=mysql://[user]:[password]@localhost:3306/businessdailydeals_db
```

## Conversion Process

### 1. Schema Conversion Status
- ✅ MySQL schema complete: `shared/schema.mysql.ts` (296 lines)
- ✅ MySQL Drizzle config: `drizzle.config.mysql.ts`
- ✅ MySQL database connection: `server/db-mysql.ts`
- ✅ mysql2 package installed

### 2. Application Modification Required
- Switch import in `server/storage.ts` from PostgreSQL to MySQL
- Update database connection from `server/db.ts` to `server/db-mysql.ts`
- Test all functionality with MySQL schema

### 3. Deployment Package
- Build production bundle
- Environment variable configuration
- Upload to Cybersmart cPanel file manager
- Configure database credentials

## Migration Commands

### Development Testing (once credentials available)
```bash
# Set MySQL environment variables
export MYSQL_DATABASE_URL="mysql://user:password@localhost:3306/businessdailydeals_db"

# Push MySQL schema
npm run db:push:mysql

# Test application with MySQL
npm run dev:mysql
```

### Production Deployment
1. Upload built application to Cybersmart
2. Configure MySQL database via cPanel
3. Set environment variables
4. Initialize database schema
5. Start Node.js application

## Next Steps

1. **Request Database Credentials** from Cybersmart:
   - Database username
   - Database password
   - Exact database name format

2. **Test MySQL Conversion** locally with credentials

3. **Create Production Build** for Cybersmart deployment

4. **Deploy to Cybersmart** servers

Total estimated time: 3-4 hours once credentials are provided.