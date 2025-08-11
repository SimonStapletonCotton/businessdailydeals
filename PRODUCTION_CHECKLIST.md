# 🎯 Production Launch Checklist - Business Daily Deals

## Quick Launch Steps

### Phase 1: Deploy (5 minutes)
- [ ] Click "Deploy" button in Replit
- [ ] Choose "Autoscale Deployment"
- [ ] Name: `business-daily-deals-prod`
- [ ] Wait for deployment success

### Phase 2: Database Switch (5 minutes)  
- [ ] Add MySQL DATABASE_URL to deployment environment
- [ ] Set NODE_ENV=production
- [ ] Run database migration
- [ ] Verify connection successful

### Phase 3: Domain Setup (5 minutes + propagation time)
- [ ] Note Replit deployment URL
- [ ] Configure DNS for www.businessdailydeals.co.za
- [ ] Point to Replit deployment
- [ ] Verify SSL certificate active

### Phase 4: Final Testing (10 minutes)
- [ ] Test /api/health endpoint
- [ ] Verify deals API working
- [ ] Check image uploads
- [ ] Test business analytics
- [ ] Confirm PayFast integration ready

## Environment Variables Required
```
NODE_ENV=production
DATABASE_URL=[MySQL from Cybersmart]
VITE_APP_URL=https://www.businessdailydeals.co.za
SENDGRID_API_KEY=[Your key]
PAYFAST_MERCHANT_ID=[Your ID]
PAYFAST_MERCHANT_KEY=[Your key]
```

## Success Indicators
✅ Replit shows "Deployment Successful"  
✅ Website loads at www.businessdailydeals.co.za  
✅ All APIs return 200 status  
✅ Images display correctly  
✅ Database queries working  
✅ SSL certificate shows secure connection  

## Emergency Contacts
- **Database Issues**: Use `CYBERSMART_DATABASE_CREDENTIALS.md`
- **Rollback**: Revert DNS, switch to development DB
- **Monitoring**: Check Replit deployment logs

---
**Total Time**: ~25 minutes + DNS propagation  
**Status**: Ready for immediate launch 🚀