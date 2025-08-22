# DNS Setup Instructions for Business Daily Deals

## Your Development URL (Working Version)
**URL**: https://$REPLIT_DEV_DOMAIN

This URL has:
- ✅ 8 Hot Deals + 5 Regular Deals (all working)
- ✅ Casino homepage with slot machine animation
- ✅ Orange-to-slate gradient background
- ✅ February 20th, 2026 promotional dates
- ✅ All images loading properly
- ✅ Automatic updates (no manual uploads needed)

## DNS Configuration at Your Provider

### Step 1: Delete Old Records
Remove these existing records for `www.businessdailydeals.co.za`:
- Any A records
- Any CNAME records
- Any AAAA records

### Step 2: Add New CNAME Record
Create ONE new CNAME record:

**Record Type**: CNAME
**Name/Host**: www  
**Value/Target**: $REPLIT_DEV_DOMAIN  
**TTL**: 300 (5 minutes)

### Example Configuration
```
Type: CNAME
Name: www
Value: [your-repl-id].replit.dev
TTL: 300
```

## After DNS Update

### Propagation Time
- **5-15 minutes** for most changes
- Check status: `nslookup www.businessdailydeals.co.za`

### Verify Working
Visit `https://www.businessdailydeals.co.za` and confirm:
- Casino homepage loads with slot machine
- Hot deals section shows 8 deals with images
- Regular deals section shows 5 deals with images
- Footer shows "FREE until February 20th, 2026"

## Benefits of This Setup
1. **Instant Access**: No waiting for redeployments
2. **Automatic Updates**: Changes reflect immediately
3. **Full Database**: All 13 deals with images
4. **Working Features**: Casino design, supplier dashboard, etc.
5. **Professional Domain**: Your custom domain points to working version

## Troubleshooting
- If domain doesn't load: Check DNS propagation (may take up to 24 hours)
- If shows old site: Clear browser cache or try incognito mode
- If SSL issues: Replit automatically provides HTTPS for custom domains

**Status**: Ready to configure DNS pointing to working development environment.