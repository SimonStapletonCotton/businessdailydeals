import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sendDealRequestToAdmin } from "./email";
import Stripe from "stripe";
import {
  generalLimiter,
  authLimiter,
  apiLimiter,
  contactLimiter,
  securityHeaders,
  validateInput,
  ipSecurity,
  securityErrorHandler,
  cleanupSecurityData
} from "./middleware/security";
import { 
  insertDealSchema, 
  insertKeywordSchema, 
  insertInquirySchema, 
  insertCouponSchema,
  insertCreditTransactionSchema, 
  insertOrderSchema, 
  insertBannerAdSchema,
  insertBasketItemSchema 
} from "@shared/schema";
import { z } from "zod";

// Initialize Stripe if keys are available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize security cleanup
  cleanupSecurityData();
  
  // Apply security middleware (skip rate limiting for development static assets)
  app.use(securityHeaders);
  app.use(ipSecurity);
  app.use(validateInput);
  
  // Apply rate limiting only to API routes and exclude Vite dev resources
  app.use((req, res, next) => {
    if (req.path.includes('/@') || req.path.includes('/node_modules') || req.path.includes('/.vite/')) {
      // Skip rate limiting for Vite development resources
      return next();
    }
    return generalLimiter(req, res, next);
  });
  
  // Health check endpoint for autoscale deployment diagnostics
  app.get('/api/health', async (req, res) => {
    try {
      // Test database connection by checking if we can query users table
      await storage.getUser('health-check-test');
      
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || '5000',
        database: 'connected',
        service: 'Business Daily Deals B2B Marketplace'
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || '5000',
        database: 'disconnected',
        service: 'Business Daily Deals B2B Marketplace',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Registration endpoint with rate limiting
  app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
      const {
        firstName,
        surname,
        email,
        mobile,
        province,
        subscribeToNewsletter,
        acceptDataOffer,
        mobileProvider,
        keywordsList,
        notificationMethod,
        allowEmailNotifications,
        allowSmsNotifications,
        allowWhatsappNotifications,
        userType
      } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      // Create user record
      const userData = {
        email,
        firstName,
        lastName: surname,
        userType: userType || 'buyer',
        mobile,
        province,
        subscribeToNewsletter: subscribeToNewsletter || false,
        acceptDataOffer: acceptDataOffer || false,
        mobileProvider,
        notificationMethod: notificationMethod || 'email',
        allowEmailNotifications: allowEmailNotifications !== false,
        allowSmsNotifications: allowSmsNotifications || false,
        allowWhatsappNotifications: allowWhatsappNotifications || false,
      };

      const user = await storage.createUser(userData);

      // Activate FREE promotional period for suppliers (4 months)
      if (userType === 'supplier') {
        await storage.activateSupplierPromotionalPeriod(user.id);
      }

      // Create keywords for the user if provided
      if (keywordsList && Array.isArray(keywordsList) && keywordsList.length > 0) {
        for (const keyword of keywordsList) {
          if (keyword.trim()) {
            await storage.createKeyword(user.id, keyword.trim());
          }
        }
      }

      res.status(201).json({ 
        message: "Registration successful", 
        user: { 
          id: user.id, 
          email: user.email, 
          userType: user.userType,
          promotionalMessage: userType === 'supplier' ? 'FREE deal posting for 4 months!' : null
        } 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // User routes
  app.patch('/api/user/type', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { userType } = req.body;
      
      if (!['buyer', 'supplier'].includes(userType)) {
        return res.status(400).json({ message: "Invalid user type" });
      }

      const user = await storage.updateUserType(userId, userType);
      
      // Activate FREE promotional period for new suppliers (4 months)
      if (userType === 'supplier') {
        await storage.activateSupplierPromotionalPeriod(userId);
      }
      
      res.json({
        ...user,
        promotionalMessage: userType === 'supplier' ? 'FREE deal posting for 4 months activated!' : null
      });
    } catch (error) {
      console.error("Error updating user type:", error);
      res.status(500).json({ message: "Failed to update user type" });
    }
  });

  // Deal routes
  app.get('/api/deals', async (req, res) => {
    try {
      const { type, search, category } = req.query;
      
      let deals;
      if (search) {
        deals = await storage.searchDeals(search as string, category as string);
      } else {
        deals = await storage.getDeals(type as 'hot' | 'regular');
      }
      
      res.json(deals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  // Deal pricing endpoint - must be before dynamic route
  app.get('/api/deals/pricing', (req, res) => {
    const pricing = {
      hot: {
        credits: 50,
        cost: 125, // R125 (50 credits × R2.50)
        description: "Premium placement on home page",
        features: ["Home page featured placement", "Enhanced visibility", "Priority in search results"]
      },
      regular: {
        credits: 20,
        cost: 50, // R50 (20 credits × R2.50)
        description: "Standard deal listing",
        features: ["Category page listing", "Search visibility", "Basic deal placement"]
      }
    };
    res.json(pricing);
  });

  // Hottest deals endpoint - must be before dynamic route
  app.get('/api/deals/hottest', async (req, res) => {
    try {
      const deals = await storage.getDeals('hot');
      // Sort by view count for hottest deals
      const hottestDeals = deals.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      res.json(hottestDeals);
    } catch (error) {
      console.error("Error fetching hottest deals:", error);
      res.status(500).json({ message: "Failed to fetch hottest deals" });
    }
  });

  app.get('/api/deals/:id', async (req, res) => {
    try {
      const deal = await storage.getDeal(req.params.id);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Error fetching deal:", error);
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });

  app.post('/api/deals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.userType !== 'supplier') {
        return res.status(403).json({ message: "Only suppliers can create deals" });
      }

      console.log("Received request body:", JSON.stringify(req.body, null, 2));

      // Clean up data before validation
      const cleanedData = {
        ...req.body,
        supplierId: userId,
        originalPrice: req.body.originalPrice || null,
        keywords: Array.isArray(req.body.keywords) ? req.body.keywords : [],
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
      };

      const dealData = insertDealSchema.parse(cleanedData);

      console.log("Parsed deal data:", JSON.stringify(dealData, null, 2));

      const deal = await storage.createDeal(dealData);
      res.status(201).json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: "Invalid deal data", errors: error.errors });
      }
      
      // Handle credit-related errors
      if (error instanceof Error && error.message.includes('Insufficient credits')) {
        return res.status(400).json({ 
          message: "Insufficient Credits", 
          details: error.message,
          creditError: true 
        });
      }
      
      console.error("Error creating deal:", error);
      res.status(500).json({ message: "Failed to create deal" });
    }
  });

  app.get('/api/supplier/deals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deals = await storage.getDealsBySupplier(userId);
      res.json(deals);
    } catch (error) {
      console.error("Error fetching supplier deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.get('/api/supplier/expired-deals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const expiredDeals = await storage.getExpiredDealsBySupplier(userId);
      res.json(expiredDeals);
    } catch (error) {
      console.error("Error fetching expired deals:", error);
      res.status(500).json({ message: "Failed to fetch expired deals" });
    }
  });

  app.patch('/api/deals/:id/reactivate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const dealId = req.params.id;
      const { expiresAt } = req.body;

      // Verify the deal belongs to this supplier
      const existingDeal = await storage.getDeal(dealId);
      if (!existingDeal || existingDeal.supplierId !== userId) {
        return res.status(404).json({ message: "Deal not found or unauthorized" });
      }

      const reactivatedDeal = await storage.reactivateDeal(dealId, new Date(expiresAt));
      res.json(reactivatedDeal);
    } catch (error) {
      console.error("Error reactivating deal:", error);
      res.status(500).json({ message: "Failed to reactivate deal" });
    }
  });

  app.patch('/api/deals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deal = await storage.getDeal(req.params.id);
      
      if (!deal || deal.supplierId !== userId) {
        return res.status(404).json({ message: "Deal not found or unauthorized" });
      }

      const updatedDeal = await storage.updateDeal(req.params.id, req.body);
      res.json(updatedDeal);
    } catch (error) {
      // Handle credit-related errors
      if (error instanceof Error && error.message.includes('Insufficient credits')) {
        return res.status(400).json({ 
          message: "Insufficient Credits", 
          details: error.message,
          creditError: true 
        });
      }
      
      console.error("Error updating deal:", error);
      res.status(500).json({ message: "Failed to update deal" });
    }
  });

  app.delete('/api/deals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deal = await storage.getDeal(req.params.id);
      
      if (!deal || deal.supplierId !== userId) {
        return res.status(404).json({ message: "Deal not found or unauthorized" });
      }

      await storage.deleteDeal(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting deal:", error);
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });

  // Extend deal expiry date
  app.patch('/api/deals/:id/extend', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const dealId = req.params.id;
      const { expiresAt } = req.body;

      if (!expiresAt) {
        return res.status(400).json({ message: "New expiry date is required" });
      }

      // Verify deal ownership
      const deal = await storage.getDeal(dealId);
      if (!deal || deal.supplierId !== userId) {
        return res.status(404).json({ message: "Deal not found or unauthorized" });
      }

      // Calculate extension cost
      const currentExpiry = new Date(deal.expiresAt || Date.now());
      const newExpiry = new Date(expiresAt);
      const extraDays = Math.ceil((newExpiry.getTime() - currentExpiry.getTime()) / (1000 * 60 * 60 * 24));
      
      if (extraDays <= 0) {
        return res.status(400).json({ message: "New expiry date must be after current expiry date" });
      }

      // Calculate credits needed: HOT deals = 5 credits per day, REGULAR = 2 credits per day
      const creditsPerDay = deal.dealType === "hot" ? 5 : 2;
      const creditsNeeded = extraDays * creditsPerDay;

      // Check if supplier has enough credits
      const creditBalance = await storage.getUserCreditBalance(userId);
      const currentBalance = parseFloat(creditBalance.creditBalance);
      
      if (currentBalance < creditsNeeded) {
        return res.status(400).json({ 
          message: "Insufficient credits", 
          creditsNeeded,
          currentBalance: currentBalance,
          shortfall: creditsNeeded - currentBalance
        });
      }

      // Charge credits for extension
      await storage.updateUserCreditBalance(userId, creditsNeeded.toString(), 'subtract');
      
      // Create credit transaction record
      await storage.createCreditTransaction({
        userId,
        amount: creditsNeeded.toString(),
        type: 'debit',
        description: `Deal extension: ${extraDays} extra days for "${deal.title}"`,
        dealId: dealId
      });

      // Update the deal's expiry date
      await storage.updateDealExpiry(dealId, expiresAt);
      
      res.json({ 
        message: "Deal expiry date extended successfully",
        creditsCharged: creditsNeeded,
        remainingCredits: currentBalance - creditsNeeded,
        extraDays
      });
    } catch (error) {
      console.error("Error extending deal:", error);
      res.status(500).json({ message: "Failed to extend deal" });
    }
  });

  // Keyword routes
  app.get('/api/keywords', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const keywords = await storage.getUserKeywords(userId);
      res.json(keywords);
    } catch (error) {
      console.error("Error fetching keywords:", error);
      res.status(500).json({ message: "Failed to fetch keywords" });
    }
  });

  app.post('/api/keywords', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const keywordData = insertKeywordSchema.parse({
        ...req.body,
        userId
      });

      const keyword = await storage.addKeyword(keywordData);
      res.status(201).json(keyword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid keyword data", errors: error.errors });
      }
      console.error("Error adding keyword:", error);
      res.status(500).json({ message: "Failed to add keyword" });
    }
  });

  app.delete('/api/keywords/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.removeKeyword(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing keyword:", error);
      res.status(500).json({ message: "Failed to remove keyword" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Inquiry routes
  app.post('/api/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const { dealId, supplierId, message } = req.body;

      // Get deal to verify it exists and get supplier info if not provided
      const deal = await storage.getDealById(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      // Get buyer and supplier information for email notifications
      const buyer = await storage.getUser(buyerId);
      const supplier = await storage.getUser(supplierId || deal.supplierId);
      
      if (!buyer || !supplier) {
        return res.status(404).json({ message: "User information not found" });
      }

      const inquiryData = insertInquirySchema.parse({
        dealId,
        buyerId,
        supplierId: supplierId || deal.supplierId,
        message: message || ""
      });

      const inquiry = await storage.createInquiry(inquiryData);

      // Send email notifications to supplier and admin
      const emailData = {
        buyerName: `${buyer.firstName} ${buyer.lastName}`.trim(),
        buyerEmail: buyer.email || '',
        supplierName: supplier.companyName || `${supplier.firstName} ${supplier.lastName}`.trim(),
        supplierEmail: supplier.email || '',
        dealTitle: deal.title,
        dealPrice: `R${parseFloat(deal.price).toLocaleString()}`,
        inquiryMessage: message || "",
        submittedAt: new Date().toLocaleString('en-ZA')
      };

      // Import and send email notifications
      const { sendInquiryNotifications } = await import('./email');
      const emailSent = await sendInquiryNotifications(emailData);
      
      if (!emailSent) {
        console.warn('Failed to send inquiry email notifications, but inquiry was created successfully');
      }

      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inquiry data", errors: error.errors });
      }
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  app.get('/api/supplier/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const supplierId = req.user.claims.sub;
      const inquiries = await storage.getInquiriesBySupplier(supplierId);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching supplier inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.get('/api/buyer/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const inquiries = await storage.getInquiriesByBuyer(buyerId);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching buyer inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.patch('/api/inquiries/:id/status', isAuthenticated, async (req, res) => {
    try {
      const { status } = req.body;
      const inquiry = await storage.updateInquiryStatus(req.params.id, status);
      res.json(inquiry);
    } catch (error) {
      console.error("Error updating inquiry status:", error);
      res.status(500).json({ message: "Failed to update inquiry status" });
    }
  });

  // Coupon routes
  app.post('/api/coupons', isAuthenticated, async (req: any, res) => {
    try {
      const buyerId = req.user.claims.sub;
      
      // Generate unique coupon code
      const couponCode = `BDD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Set expiration date (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      const couponData = insertCouponSchema.parse({
        ...req.body,
        buyerId,
        couponCode,
        expiresAt
      });

      const coupon = await storage.createCoupon(couponData);
      res.status(201).json(coupon);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid coupon data", errors: error.errors });
      }
      console.error("Error creating coupon:", error);
      res.status(500).json({ message: "Failed to create coupon" });
    }
  });

  app.get('/api/buyer/coupons', isAuthenticated, async (req: any, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const coupons = await storage.getCouponsByBuyer(buyerId);
      res.json(coupons);
    } catch (error) {
      console.error("Error fetching buyer coupons:", error);
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });

  app.get('/api/supplier/coupons', isAuthenticated, async (req: any, res) => {
    try {
      const supplierId = req.user.claims.sub;
      const coupons = await storage.getCouponsBySupplier(supplierId);
      res.json(coupons);
    } catch (error) {
      console.error("Error fetching supplier coupons:", error);
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });

  app.get('/api/coupons/:code', async (req, res) => {
    try {
      const coupon = await storage.getCouponByCode(req.params.code);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error) {
      console.error("Error fetching coupon:", error);
      res.status(500).json({ message: "Failed to fetch coupon" });
    }
  });

  app.post('/api/coupons/:code/redeem', async (req, res) => {
    try {
      const { redemptionNotes } = req.body;
      const coupon = await storage.redeemCoupon(req.params.code, redemptionNotes);
      res.json(coupon);
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      res.status(500).json({ message: "Failed to redeem coupon" });
    }
  });

  // Rates routes
  app.get("/api/rates", async (req, res) => {
    try {
      const rates = await storage.getRates();
      res.json(rates);
    } catch (error) {
      console.error("Error fetching rates:", error);
      res.status(500).json({ message: "Failed to fetch rates" });
    }
  });

  app.post("/api/rates", isAuthenticated, async (req, res) => {
    try {
      const rate = await storage.createRate(req.body);
      res.json(rate);
    } catch (error) {
      console.error("Error creating rate:", error);
      res.status(500).json({ message: "Failed to create rate" });
    }
  });

  app.post("/api/rates/bulk-upload", isAuthenticated, async (req, res) => {
    try {
      const { rates } = req.body;
      if (!Array.isArray(rates)) {
        return res.status(400).json({ message: "Rates must be an array" });
      }
      
      const createdRates = await storage.bulkCreateRates(rates);
      res.json({ 
        message: `Successfully uploaded ${createdRates.length} rates`,
        rates: createdRates 
      });
    } catch (error) {
      console.error("Error bulk uploading rates:", error);
      res.status(500).json({ message: "Failed to upload rates" });
    }
  });

  app.put("/api/rates/:id", isAuthenticated, async (req, res) => {
    try {
      const rate = await storage.updateRate(req.params.id, req.body);
      res.json(rate);
    } catch (error) {
      console.error("Error updating rate:", error);
      res.status(500).json({ message: "Failed to update rate" });
    }
  });

  app.delete("/api/rates/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteRate(req.params.id);
      res.json({ message: "Rate deleted successfully" });
    } catch (error) {
      console.error("Error deleting rate:", error);
      res.status(500).json({ message: "Failed to delete rate" });
    }
  });

  app.delete("/api/rates", isAuthenticated, async (req, res) => {
    try {
      await storage.clearAllRates();
      res.json({ message: "All rates cleared successfully" });
    } catch (error) {
      console.error("Error clearing rates:", error);
      res.status(500).json({ message: "Failed to clear rates" });
    }
  });

  // Advanced Search Endpoints
  app.get('/api/search', async (req, res) => {
    try {
      const { query, type = 'deals', category, dealType, minPrice, maxPrice } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }

      let results: any[] = [];
      
      if (type === 'deals') {
        const filters: any = {};
        if (category && category !== 'All') filters.category = category as string;
        if (dealType && dealType !== 'all') filters.dealType = dealType as 'hot' | 'regular';
        if (minPrice || maxPrice) {
          filters.priceRange = {
            min: minPrice ? parseFloat(minPrice as string) : 0,
            max: maxPrice ? parseFloat(maxPrice as string) : 0
          };
        }
        
        results = await storage.searchDealsAdvanced(query as string, filters);
      } else if (type === 'companies') {
        results = await storage.searchCompanies(query as string);
      }
      
      res.json(results);
    } catch (error) {
      console.error("Error in advanced search:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });


  // Credits Management Endpoints
  app.get('/api/credits/balance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const balance = await storage.getUserCreditBalance(userId);
      res.json(balance);
    } catch (error) {
      console.error("Error fetching credit balance:", error);
      res.status(500).json({ message: "Failed to fetch credit balance" });
    }
  });

  app.get('/api/credits/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserCreditTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching credit transactions:", error);
      res.status(500).json({ message: "Failed to fetch credit transactions" });
    }
  });

  app.post('/api/credits/purchase', isAuthenticated, async (req: any, res) => {
    if (!stripe) {
      return res.status(500).json({ 
        message: "Payment system not configured. Please contact support." 
      });
    }

    try {
      const userId = req.user.claims.sub;
      const { packageId, customAmount } = req.body;

      let amount: number;
      let credits: number;
      let description: string;

      if (packageId) {
        // Predefined packages
        const packages: any = {
          'starter': { credits: 100, price: 250 },
          'business': { credits: 550, price: 1000 }, // 500 + 50 bonus
          'enterprise': { credits: 1200, price: 1800 }, // 1000 + 200 bonus
          'premium': { credits: 2500, price: 3200 }, // 2000 + 500 bonus
        };
        
        const pkg = packages[packageId];
        if (!pkg) {
          return res.status(400).json({ message: "Invalid package" });
        }
        
        amount = pkg.price * 100; // Convert to cents
        credits = pkg.credits;
        description = `${packageId.charAt(0).toUpperCase() + packageId.slice(1)} Package - ${credits} Credits`;
      } else if (customAmount) {
        if (customAmount < 50) {
          return res.status(400).json({ message: "Minimum purchase is R50" });
        }
        amount = Math.round(customAmount * 100); // Convert to cents
        credits = Math.floor(customAmount / 2.5); // R2.50 per credit
        description = `Custom Credit Purchase - ${credits} Credits`;
      } else {
        return res.status(400).json({ message: "Package ID or custom amount required" });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'zar',
        metadata: {
          userId,
          credits: credits.toString(),
          type: 'credit_purchase'
        }
      });

      // Create pending transaction record
      await storage.createCreditTransaction({
        userId,
        amount: (amount / 100).toFixed(2),
        type: 'purchase',
        description,
        stripePaymentIntentId: paymentIntent.id
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        credits 
      });
    } catch (error) {
      console.error("Error creating credit purchase:", error);
      res.status(500).json({ message: "Failed to create purchase" });
    }
  });

  // Direct Purchase Endpoints
  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const orderData = insertOrderSchema.parse({ ...req.body, buyerId });
      
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type = 'buyer' } = req.query;
      
      const orders = await storage.getUserOrders(userId, type as 'buyer' | 'seller');
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Directory Endpoints
  app.get('/api/directory', async (req, res) => {
    try {
      const { type = 'products', letter, category, search } = req.query;
      
      if (type === 'products') {
        let deals = await storage.getDeals();
        
        // Apply filters
        if (letter) {
          deals = deals.filter(deal => 
            deal.title.toUpperCase().startsWith(letter as string)
          );
        }
        
        if (category && category !== 'All') {
          deals = deals.filter(deal => deal.category === category);
        }
        
        if (search) {
          deals = deals.filter(deal =>
            deal.title.toLowerCase().includes((search as string).toLowerCase()) ||
            deal.description.toLowerCase().includes((search as string).toLowerCase())
          );
        }
        
        res.json(deals);
      } else if (type === 'companies') {
        const companies = await storage.getCompanies(
          category !== 'All' ? category as string : undefined,
          true // alphabetical
        );
        res.json(companies);
      }
    } catch (error) {
      console.error("Error fetching directory data:", error);
      res.status(500).json({ message: "Failed to fetch directory" });
    }
  });

  // Suppliers Directory
  app.get('/api/suppliers/directory', async (req, res) => {
    try {
      const suppliers = await storage.getSuppliersDirectory();
      res.json(suppliers);
    } catch (error) {
      console.error("Error fetching suppliers directory:", error);
      res.status(500).json({ message: "Failed to fetch suppliers directory" });
    }
  });

  // Basket Management Endpoints
  app.get('/api/basket', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const basketItems = await storage.getBasketItems(userId);
      res.json(basketItems);
    } catch (error) {
      console.error("Error fetching basket items:", error);
      res.status(500).json({ message: "Failed to fetch basket items" });
    }
  });

  app.post('/api/basket', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const basketData = insertBasketItemSchema.parse({ ...req.body, userId });
      
      const basketItem = await storage.addBasketItem(basketData);
      res.json(basketItem);
    } catch (error) {
      console.error("Error adding basket item:", error);
      res.status(500).json({ message: "Failed to add item to basket" });
    }
  });

  app.delete('/api/basket/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      await storage.removeBasketItem(id, userId);
      res.json({ message: "Item removed from basket" });
    } catch (error) {
      console.error("Error removing basket item:", error);
      res.status(500).json({ message: "Failed to remove item from basket" });
    }
  });

  app.delete('/api/basket', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearBasket(userId);
      res.json({ message: "Basket cleared" });
    } catch (error) {
      console.error("Error clearing basket:", error);
      res.status(500).json({ message: "Failed to clear basket" });
    }
  });

  // Local payment processing for South African market
  app.post('/api/purchase-basket-credits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { totalAmount, currency = 'ZAR' } = req.body;

      // Get basket items
      const basketItems = await storage.getBasketItems(userId);
      
      if (!basketItems || basketItems.length === 0) {
        return res.status(400).json({ message: "Basket is empty" });
      }

      // Calculate total credits (1:1 ratio with ZAR for now)
      const totalCredits = parseFloat(totalAmount);

      // Create credit transaction record (without dealId for basket purchases)
      const transaction = await storage.createCreditTransaction({
        userId,
        amount: totalAmount.toString(),
        type: 'purchase',
        description: `Purchase of ${totalCredits} advertising credits from basket items`,
      });

      // Clear the basket after successful purchase
      await storage.clearBasket(userId);

      res.json({ 
        message: "Credits purchased successfully",
        credits: totalCredits,
        transaction: transaction.id,
        currency
      });
    } catch (error) {
      console.error("Error processing credit purchase:", error);
      res.status(500).json({ message: "Failed to process purchase" });
    }
  });

  app.get('/api/directory/featured', async (req, res) => {
    try {
      const hotDeals = await storage.getDeals('hot');
      // Get top viewed hot deals as featured
      const featured = hotDeals
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 12);
      res.json(featured);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  // Banner Advertising Endpoints
  app.get('/api/banner-ads', async (req, res) => {
    try {
      const { position } = req.query;
      const bannerAds = await storage.getActiveBannerAds(position as string);
      res.json(bannerAds);
    } catch (error) {
      console.error("Error fetching banner ads:", error);
      res.status(500).json({ message: "Failed to fetch banner ads" });
    }
  });

  app.post('/api/banner-ads', isAuthenticated, async (req: any, res) => {
    try {
      const advertiserId = req.user.claims.sub;
      const bannerData = insertBannerAdSchema.parse({ ...req.body, advertiserId });
      
      const bannerAd = await storage.createBannerAd(bannerData);
      res.json(bannerAd);
    } catch (error) {
      console.error("Error creating banner ad:", error);
      res.status(500).json({ message: "Failed to create banner ad" });
    }
  });

  app.put('/api/banner-ads/:id/stats', async (req, res) => {
    try {
      const { id } = req.params;
      const { type } = req.body; // 'click' or 'impression'
      
      const updated = await storage.updateBannerAdStats(id, type);
      res.json(updated);
    } catch (error) {
      console.error("Error updating banner ad stats:", error);
      res.status(500).json({ message: "Failed to update stats" });
    }
  });

  // Analytics Endpoints
  app.get('/api/analytics/site', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await storage.getSiteAnalytics(
        startDate as string, 
        endDate as string
      );
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching site analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.post('/api/analytics/record', async (req, res) => {
    try {
      const { type } = req.body; // 'visit', 'unique_visitor', 'deal_view', 'search_query'
      const today = new Date().toISOString().split('T')[0];
      
      await storage.recordSiteAnalytics(today, type);
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording analytics:", error);
      res.status(500).json({ message: "Failed to record analytics" });
    }
  });

  app.put('/api/deals/:id/analytics', async (req, res) => {
    try {
      const { id } = req.params;
      const { type } = req.body; // 'view' or 'click'
      
      const updated = await storage.updateDealAnalytics(id, type);
      res.json(updated);
    } catch (error) {
      console.error("Error updating deal analytics:", error);
      res.status(500).json({ message: "Failed to update analytics" });
    }
  });

  // Suppliers Directory API
  app.get('/api/suppliers/directory', async (req, res) => {
    try {
      const suppliers = await storage.getSuppliersDirectory();
      res.json(suppliers);
    } catch (error) {
      console.error("Error fetching suppliers directory:", error);
      res.status(500).json({ message: "Failed to fetch suppliers directory" });
    }
  });

  // Deal Requests API
  app.post("/api/deal-requests", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const userId = user?.id || user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const requestData = {
        requesterId: userId,
        productName: req.body.productName,
        productSize: req.body.productSize,
        quantityRequired: req.body.quantityRequired,
        deliveryDestination: req.body.deliveryDestination,
        priceRangeMin: req.body.priceRangeMin,
        priceRangeMax: req.body.priceRangeMax,
        additionalRequirements: req.body.additionalRequirements,
      };

      const dealRequest = await storage.createDealRequest(requestData);

      // Get user information for email
      const userInfo = await storage.getUser(userId);
      
      // Send email notification to admin
      const emailSuccess = await sendDealRequestToAdmin({
        requesterName: userInfo ? `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || 'Unknown' : 'Unknown',
        requesterEmail: userInfo?.email || user?.claims?.email || 'unknown@unknown.com',
        productName: requestData.productName,
        productSize: requestData.productSize,
        quantityRequired: requestData.quantityRequired,
        deliveryDestination: requestData.deliveryDestination,
        priceRangeMin: requestData.priceRangeMin ? Number(requestData.priceRangeMin) : undefined,
        priceRangeMax: requestData.priceRangeMax ? Number(requestData.priceRangeMax) : undefined,
        additionalRequirements: requestData.additionalRequirements,
        submittedAt: new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })
      });

      if (!emailSuccess) {
        console.warn('Failed to send deal request email to admin');
      }

      res.status(201).json({
        ...dealRequest,
        emailSent: emailSuccess
      });
    } catch (error) {
      console.error("Error creating deal request:", error);
      res.status(500).json({ message: "Failed to create deal request" });
    }
  });

  app.get("/api/deal-requests", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const userId = user?.id || user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userRequests = await storage.getDealRequestsByUser(userId);
      res.json(userRequests);
    } catch (error) {
      console.error("Error fetching deal requests:", error);
      res.status(500).json({ message: "Failed to fetch deal requests" });
    }
  });

  // Upload routes - import at top level
  const uploadRoutes = (await import('./routes/upload')).default;
  app.use('/api/upload', uploadRoutes);

  // Apply security error handler at the end
  app.use(securityErrorHandler);

  const httpServer = createServer(app);
  return httpServer;
}
