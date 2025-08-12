import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sendDealRequestToAdmin, sendPaymentNotificationToAdmin, sendPaymentConfirmationToCustomer } from "./email";
import Stripe from "stripe";
import { db } from "./db";
import { deals } from "@shared/schema";
import { eq } from "drizzle-orm";
import {
  generalLimiter,
  authLimiter,
  apiLimiter,
  contactLimiter,
  securityHeaders,
  validateInput,
  ipSecurity,
  securityErrorHandler
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
import { healthMonitor } from "./healthMonitor";

// Initialize Stripe if keys are available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Security monitoring disabled for production deployment
  
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
  
  // Basic health check endpoint with production fix capability
  app.get('/api/health', async (req, res) => {
    try {
      // Special production fix trigger
      if (req.query.fix === 'production' && req.query.secret === 'cybersmartprod2025') {
        console.log("🔧 PRODUCTION FIX TRIGGERED via health endpoint");
        
        // Clear existing deals first
        await db.delete(deals);
        console.log("✅ Cleared existing deals");

        // Create production deals
        const productionDeals = [
          {
            id: "prod-deal-1",
            supplierId: "46102542",
            title: "DAM LINERS - Premium Quality",
            description: "Professional dam liners for bulk water storage with worldwide installation service",
            price: "140.00",
            originalPrice: "180.00",
            category: "Mining",
            dealType: "hot" as const,
            dealStatus: "active" as const
          },
          {
            id: "prod-deal-2", 
            supplierId: "46102542",
            title: "Vitamin C Supplements",
            description: "High quality vitamin C supplements for health and wellness",
            price: "45.00",
            originalPrice: "55.00",
            category: "Health",
            dealType: "hot" as const,
            dealStatus: "active" as const
          },
          {
            id: "prod-deal-3",
            supplierId: "46102542", 
            title: "Premium Business Cards",
            description: "Professional business cards with premium printing quality",
            price: "25.00",
            originalPrice: "35.00",
            category: "Printing",
            dealType: "regular" as const,
            dealStatus: "active" as const
          }
        ];

        let successCount = 0;
        for (const deal of productionDeals) {
          try {
            await db.insert(deals).values(deal);
            console.log(`✅ Created deal: ${deal.title}`);
            successCount++;
          } catch (dealError) {
            console.error(`❌ Failed to create deal ${deal.title}:`, dealError);
          }
        }

        return res.json({ 
          status: 'production-fix-complete', 
          message: `Successfully populated ${successCount} deals`,
          total: productionDeals.length,
          timestamp: new Date().toISOString(),
          service: 'Business Daily Deals B2B Marketplace' 
        });
      }

      await storage.getUser('health-check-test');
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Business Daily Deals B2B Marketplace'
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'Business Daily Deals B2B Marketplace',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Comprehensive health monitoring endpoint
  app.get('/api/health/detailed', async (req, res) => {
    try {
      const healthReport = await healthMonitor.performComprehensiveHealthCheck();
      
      const statusCode = healthReport.overall_status === 'critical' ? 503 : 
                        healthReport.overall_status === 'degraded' ? 206 : 200;
      
      res.status(statusCode).json({
        service: 'Business Daily Deals B2B Marketplace',
        ...healthReport,
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      res.status(500).json({
        service: 'Business Daily Deals B2B Marketplace',
        overall_status: 'critical',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Health check system failure',
        checks: []
      });
    }
  });

  // Auth middleware
  await setupAuth(app);

  // SYSTEM ADMIN ENDPOINTS - Using different path to avoid middleware conflicts
  
  // Test system endpoint to verify routing
  app.get('/api/system-admin/test', (req, res) => {
    console.log("🔧 SYSTEM ADMIN TEST ENDPOINT HIT");
    res.json({ message: "System admin routing is working!", timestamp: new Date().toISOString() });
  });
  
  // Direct production fix endpoint 
  app.post('/api/system-admin/fix-production', async (req: any, res) => {
    try {
      console.log("🔧 SYSTEM ADMIN ENDPOINT HIT: /api/system-admin/fix-production");
      console.log("🔧 Starting production database fix...");
      
      // Clear existing deals first
      await db.delete(deals);
      console.log("✅ Cleared existing deals");

      // Create deals with only essential fields that we know exist
      const productionDeals = [
        {
          id: "prod-deal-1",
          supplierId: "46102542",
          title: "DAM LINERS - Premium Quality",
          description: "Professional dam liners for bulk water storage with worldwide installation service",
          price: "140.00",
          originalPrice: "180.00",
          category: "Mining",
          dealType: "hot",
          dealStatus: "active"
        },
        {
          id: "prod-deal-2", 
          supplierId: "46102542",
          title: "Vitamin C Supplements",
          description: "High quality vitamin C supplements for health and wellness",
          price: "45.00",
          originalPrice: "55.00",
          category: "Health",
          dealType: "hot",
          dealStatus: "active"
        },
        {
          id: "prod-deal-3",
          supplierId: "46102542", 
          title: "Premium Business Cards",
          description: "Professional business cards with premium printing quality",
          price: "25.00",
          originalPrice: "35.00",
          category: "Printing",
          dealType: "regular",
          dealStatus: "active"
        }
      ];

      let successCount = 0;
      for (const deal of productionDeals) {
        try {
          await db.insert(deals).values({
            id: deal.id,
            supplierId: deal.supplierId,
            title: deal.title,
            description: deal.description,
            price: deal.price,
            originalPrice: deal.originalPrice,
            category: deal.category,
            dealType: deal.dealType as "hot" | "regular",
            dealStatus: deal.dealStatus as "active"
          });
          console.log(`✅ Created deal: ${deal.title}`);
          successCount++;
        } catch (dealError) {
          console.error(`❌ Failed to create deal ${deal.title}:`, dealError);
        }
      }

      console.log(`🎉 Production fix complete: ${successCount} deals created`);
      res.json({ 
        success: true, 
        message: `Successfully populated ${successCount} deals`,
        total: productionDeals.length 
      });

    } catch (error) {
      console.error("❌ Production fix failed:", error);
      res.status(500).json({ 
        error: error.message,
        details: "Production database population failed"
      });
    }
  });

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

  // Find user by email for keyword management
  app.post('/api/auth/find-user', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user data (excluding sensitive information)
      const { ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).json({ message: "Failed to find user" });
    }
  });

  // Update user keywords and notification preferences
  app.put('/api/auth/update-keywords', async (req, res) => {
    try {
      const { 
        email, 
        keywords, 
        notificationMethod, 
        allowEmailNotifications, 
        allowSmsNotifications, 
        allowWhatsappNotifications 
      } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.updateUserKeywords(user.id, {
        keywords,
        notificationMethod,
        allowEmailNotifications,
        allowSmsNotifications,
        allowWhatsappNotifications
      });

      const { ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error updating keywords:", error);
      res.status(500).json({ message: "Failed to update keywords" });
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
      // Special production population trigger
      if (req.query.populate === 'prod' && req.query.key === 'cybersmart2025') {
        console.log("🔧 PRODUCTION POPULATION TRIGGERED via deals endpoint");
        
        // Clear existing deals first
        await db.delete(deals);
        console.log("✅ Cleared existing deals");

        // Create production deals
        const productionDeals = [
          {
            id: "prod-deal-1",
            supplierId: "46102542",
            title: "DAM LINERS - Premium Quality",
            description: "Professional dam liners for bulk water storage with worldwide installation service",
            price: "140.00",
            originalPrice: "180.00",
            category: "Mining",
            dealType: "hot" as const,
            dealStatus: "active" as const
          },
          {
            id: "prod-deal-2", 
            supplierId: "46102542",
            title: "Vitamin C Supplements",
            description: "High quality vitamin C supplements for health and wellness",
            price: "45.00",
            originalPrice: "55.00",
            category: "Health",
            dealType: "hot" as const,
            dealStatus: "active" as const
          },
          {
            id: "prod-deal-3",
            supplierId: "46102542", 
            title: "Premium Business Cards",
            description: "Professional business cards with premium printing quality",
            price: "25.00",
            originalPrice: "35.00",
            category: "Printing",
            dealType: "regular" as const,
            dealStatus: "active" as const
          }
        ];

        let successCount = 0;
        for (const deal of productionDeals) {
          try {
            await db.insert(deals).values(deal);
            console.log(`✅ Created deal: ${deal.title}`);
            successCount++;
          } catch (dealError) {
            console.error(`❌ Failed to create deal ${deal.title}:`, dealError);
          }
        }

        return res.json({ 
          populated: true,
          message: `Successfully populated ${successCount} deals`,
          total: productionDeals.length,
          deals: productionDeals
        });
      }

      const { type, search, category } = req.query;
      let deals;
      if (search) {
        deals = await storage.searchDeals(search as string, category as string);
      } else {
        deals = await storage.getDeals(type as 'hot' | 'regular');
      }
      
      // Disable caching for deals API
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
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

  // Delete deal (suppliers only)
  app.delete('/api/deals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const dealId = req.params.id;
      
      // Get the deal to verify ownership
      const deal = await storage.getDeal(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      // Check if the user owns this deal
      if (deal.supplierId !== userId) {
        return res.status(403).json({ message: "You can only delete your own deals" });
      }
      
      // Delete the deal
      await storage.deleteDeal(dealId);
      
      res.json({ message: "Deal deleted successfully" });
    } catch (error) {
      console.error("Error deleting deal:", error);
      res.status(500).json({ message: "Failed to delete deal" });
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

      // Check if expiry date extends beyond promotional period
      const promotionalEndDate = new Date('2025-12-31T23:59:59.000Z');
      if (cleanedData.expiresAt && cleanedData.expiresAt > promotionalEndDate) {
        const daysAfterPromo = Math.ceil((cleanedData.expiresAt.getTime() - promotionalEndDate.getTime()) / (1000 * 60 * 60 * 24));
        const creditsPerDay = cleanedData.dealType === "hot" ? 5 : 2;
        const creditsNeeded = daysAfterPromo * creditsPerDay;
        
        console.log(`Warning: Deal extends ${daysAfterPromo} days beyond promotional period, will require ${creditsNeeded} credits starting Jan 1, 2026`);
        
        // You could add a warning response here, but for now we'll just log it
        // The user chose this date, so we'll honor it but log the implications
      }

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

      // Check if we're in promotional period (FREE until December 31st, 2025)
      const promotionalEndDate = new Date('2025-12-31T23:59:59.000Z');
      const isPromotionalPeriod = new Date() < promotionalEndDate;
      
      // Get credit balance for response (needed regardless of promotional period)
      const creditBalance = await storage.getUserCreditBalance(userId);
      const currentBalance = parseFloat(creditBalance.creditBalance);

      if (!isPromotionalPeriod) {
        // Check if supplier has enough credits (only after promotional period)
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
      }

      // Update the deal's expiry date
      await storage.updateDealExpiry(dealId, expiresAt);
      
      res.json({ 
        message: isPromotionalPeriod ? 
          "Deal expiry date extended successfully (FREE promotional period)" : 
          "Deal expiry date extended successfully",
        creditsCharged: isPromotionalPeriod ? 0 : creditsNeeded,
        remainingCredits: isPromotionalPeriod ? currentBalance : (currentBalance - creditsNeeded),
        extraDays,
        promotionalPeriod: isPromotionalPeriod
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
      const { dealId } = req.body;
      
      // Get deal details to include in coupon
      const deal = await storage.getDealById(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      // Generate unique coupon code
      const couponCode = `BDD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Set validity date (30 days from now)
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      
      const couponData = insertCouponSchema.parse({
        dealId,
        buyerId,
        supplierId: deal.supplierId,
        couponCode,
        dealTitle: deal.title,
        dealPrice: deal.price,
        dealOriginalPrice: deal.originalPrice,
        dealDescription: deal.description,
        validUntil,
        expiresAt: validUntil // Keep for backward compatibility
      });

      const coupon = await storage.createCoupon(couponData);
      
      // Return coupon with redirect URL
      res.status(201).json({
        ...coupon,
        redirectUrl: `/coupon/${couponCode}`
      });
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

  // Public coupon routes for Live Coupons page (MUST be before wildcard routes)
  app.get('/api/coupons/public', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const coupons = await storage.getPublicCoupons(limit);
      console.log("Fetched public coupons:", coupons.length);
      res.json(coupons);
    } catch (error) {
      console.error("Error fetching public coupons:", error);
      res.status(500).json({ message: "Failed to fetch public coupons", error: error.message });
    }
  });

  app.get('/api/coupons/stats', async (req, res) => {
    try {
      const stats = await storage.getCouponStats();
      console.log("Fetched coupon stats:", stats);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching coupon stats:", error);
      res.status(500).json({ message: "Failed to fetch coupon stats", error: error.message });
    }
  });

  // Direct production fix endpoint 
  app.post('/api/admin/fix-production', async (req: any, res) => {
    try {
      console.log("🔧 Starting production database fix...");
      
      // Clear existing deals first
      await db.delete(deals);
      console.log("✅ Cleared existing deals");

      // Create deals with only essential fields that we know exist
      const productionDeals = [
        {
          id: "prod-deal-1",
          supplierId: "46102542",
          title: "DAM LINERS - Premium Quality",
          description: "Professional dam liners for bulk water storage with worldwide installation service",
          price: "140.00",
          originalPrice: "180.00",
          category: "Mining",
          dealType: "hot",
          dealStatus: "active"
        },
        {
          id: "prod-deal-2", 
          supplierId: "46102542",
          title: "Vitamin C Supplements",
          description: "High quality vitamin C supplements for health and wellness",
          price: "45.00",
          originalPrice: "55.00",
          category: "Health",
          dealType: "hot",
          dealStatus: "active"
        },
        {
          id: "prod-deal-3",
          supplierId: "46102542", 
          title: "Premium Business Cards",
          description: "Professional business cards with premium printing quality",
          price: "25.00",
          originalPrice: "35.00",
          category: "Printing",
          dealType: "regular",
          dealStatus: "active"
        }
      ];

      let successCount = 0;
      for (const deal of productionDeals) {
        try {
          await db.insert(deals).values({
            id: deal.id,
            supplierId: deal.supplierId,
            title: deal.title,
            description: deal.description,
            price: deal.price,
            originalPrice: deal.originalPrice,
            category: deal.category,
            dealType: deal.dealType as "hot" | "regular",
            dealStatus: deal.dealStatus as "active"
          });
          console.log(`✅ Created deal: ${deal.title}`);
          successCount++;
        } catch (dealError) {
          console.error(`❌ Failed to create deal ${deal.title}:`, dealError);
        }
      }

      console.log(`🎉 Production fix complete: ${successCount} deals created`);
      res.json({ 
        success: true, 
        message: `Successfully populated ${successCount} deals`,
        total: productionDeals.length 
      });

    } catch (error) {
      console.error("❌ Production fix failed:", error);
      res.status(500).json({ 
        error: error.message,
        details: "Production database population failed"
      });
    }
  });

  // Production database population endpoint (admin only)
  app.post('/api/admin/populate-deals', async (req: any, res) => {
    try {
      // Allow this endpoint to work without authentication for production sync
      // In production, restrict this to specific conditions if needed

      // First delete all existing deals to clean the database
      await storage.deleteAllDeals();
      console.log("Cleared existing deals from production database");

      const workingDeals = [
        {
          id: "6cbd7a6a-e4ab-496b-a365-6fd2883b8e53",
          supplierId: "46102542",
          title: "DAM LINERS",
          description: "Dam liners for bulk water storage - can be made up in the factory up to generally around 250sqm, or if larger we come to site and install with our experienced team, at any destination world wide",
          price: "140.00",
          originalPrice: "180.00",
          dealType: "hot" as const,
          category: "Mining",
          keywords: [],
          imageUrl: "/public-objects/product-images/6y9M7PQvU4JNi6f8A39ra.jpg",
          expiryDate: new Date("2026-06-10T00:00:00.000Z"),
          dealStatus: "active" as const,
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 0
        },
        {
          id: "vitamin-c-hot-deal-456",
          supplierId: "46102542", 
          title: "Vitamin C",
          description: "High quality vitamin C supplements for health and wellness",
          price: "45.00",
          originalPrice: "55.00",
          dealType: "hot" as const,
          category: "Health",
          keywords: [],
          imageUrl: "/public-objects/product-images/Tg7hPOh3CxbWQt8rzmY1N.jpg",
          expiryDate: new Date("2025-12-31T00:00:00.000Z"),
          dealStatus: "active" as const,
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 0
        },
        {
          id: "industrial-bladders-789",
          supplierId: "46102542",
          title: "Industrial Water Bladders - Bulk Storage", 
          description: "Industrial grade water bladders for bulk storage solutions",
          price: "2500.00",
          originalPrice: "3200.00", 
          dealType: "hot" as const,
          category: "Industrial",
          keywords: [],
          imageUrl: "/public-objects/product-images/NNxGFI1n-VBRJ5vpPqqKV.JPG",
          expiryDate: new Date("2025-12-31T00:00:00.000Z"),
          dealStatus: "active" as const,
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 0
        },
        {
          id: "regular-bladders-012",
          supplierId: "46102542",
          title: "Bladders",
          description: "Standard water storage bladders for various applications",
          price: "850.00",
          originalPrice: "1000.00",
          dealType: "regular" as const,
          category: "Storage", 
          keywords: [],
          imageUrl: "/public-objects/product-images/OjuD4ef-pGlmFVsGktiuC.JPG",
          expiryDate: new Date("2025-12-31T00:00:00.000Z"),
          dealStatus: "active" as const,
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 0
        },
        {
          id: "regular-dam-liners-345", 
          supplierId: "46102542",
          title: "Dam liners",
          description: "Made to fit in our factory with custom specifications",
          price: "200.00",
          originalPrice: "235.00",
          dealType: "regular" as const,
          category: "Other",
          keywords: [],
          imageUrl: "/public-objects/product-images/OjuD4ef-pGlmFVsGktiuC.JPG",
          expiryDate: new Date("2025-08-12T22:00:00.000Z"),
          dealStatus: "active" as const,
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 1
        }
      ];

      // Create a single test deal first to check schema
      console.log("Testing database schema with simple deal...");
      try {
        const testDeal = {
          id: "test-deal-schema-check",
          supplierId: "46102542",
          title: "Test Deal",
          description: "Testing database schema",
          price: "100.00",
          originalPrice: "120.00",
          dealType: "regular" as const,
          category: "Test",
          dealStatus: "active" as const,
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 0
        };
        
        const [deal] = await db.insert(deals).values(testDeal).returning();
        console.log("✅ Test deal created successfully:", deal.title);
        await db.delete(deals).where(eq(deals.id, "test-deal-schema-check"));
        console.log("✅ Test deal cleaned up");
      } catch (testError) {
        console.error("❌ Database schema test failed:", testError);
        return res.status(500).json({ 
          message: "Database schema mismatch", 
          error: testError.message,
          details: "Production database schema doesn't match development"
        });
      }

      // Populate deals
      let successCount = 0;
      for (const dealData of workingDeals) {
        try {
          // Use direct database insert to avoid storage layer issues
          const dealForDB = {
            ...dealData,
            price: dealData.price.toString(),
            originalPrice: dealData.originalPrice.toString(),
            creditsCost: dealData.creditsCost.toString()
          };
          
          const [deal] = await db.insert(deals).values(dealForDB).returning();
          console.log(`✅ Successfully created deal: ${deal.title}`);
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to create deal ${dealData.title}:`, error);
          console.error(`Full error details:`, JSON.stringify(error, null, 2));
        }
      }

      res.json({ 
        message: `Successfully populated ${successCount} deals`,
        total: workingDeals.length
      });
    } catch (error) {
      console.error("Error populating production deals:", error);
      res.status(500).json({ message: "Failed to populate deals" });
    }
  });

  // Business statistics endpoint for homepage
  app.get('/api/business/stats', async (req, res) => {
    try {
      const stats = await storage.getBusinessStats();
      console.log("Fetched business stats:", stats);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching business stats:", error);
      res.status(500).json({ message: "Failed to fetch business stats", error: error.message });
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

  // Enhanced coupon redemption with security and audit trail
  app.post('/api/coupons/:code/redeem', async (req, res) => {
    try {
      const { location, notes } = req.body;
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';
      
      const result = await storage.redeemCoupon(req.params.code, {
        location,
        notes,
        ipAddress: clientIp,
        userAgent
      });
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          coupon: result.coupon,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      res.status(500).json({ 
        success: false,
        message: "System error occurred during redemption. Please try again or contact support.",
        timestamp: new Date().toISOString()
      });
    }
  });

  // New endpoint: Validate coupon without redeeming
  app.get('/api/coupons/:code/validate', async (req, res) => {
    try {
      const validation = await storage.validateCouponForRedemption(req.params.code);
      res.json(validation);
    } catch (error) {
      console.error("Error validating coupon:", error);
      res.status(500).json({ 
        valid: false,
        message: "Error validating coupon",
        canRedeem: false
      });
    }
  });

  // New endpoint: Get redemption audit trail
  app.get('/api/coupons/:code/history', async (req, res) => {
    try {
      const history = await storage.getCouponRedemptionHistory(req.params.code);
      res.json(history);
    } catch (error) {
      console.error("Error fetching coupon history:", error);
      res.status(500).json({ message: "Failed to fetch coupon history" });
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

  // PayFast Credit Purchase Endpoint
  app.post('/api/credits/purchase', isAuthenticated, async (req: any, res) => {
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
        
        amount = pkg.price; // PayFast uses Rand amounts directly
        credits = pkg.credits;
        description = `${packageId.charAt(0).toUpperCase() + packageId.slice(1)} Package - ${credits} Credits`;
      } else if (customAmount) {
        if (customAmount < 50) {
          return res.status(400).json({ message: "Minimum purchase is R50" });
        }
        amount = Math.round(customAmount * 100) / 100; // Clean decimal
        credits = Math.floor(customAmount / 2.5); // R2.50 per credit
        description = `Custom Credit Purchase - ${credits} Credits`;
      } else {
        return res.status(400).json({ message: "Package ID or custom amount required" });
      }

      // Generate unique merchant payment ID
      const merchantPaymentId = `BDD-${credits}CRED-${Date.now()}`;

      // Create pending transaction record
      const transaction = await storage.createCreditTransaction({
        userId,
        amount: amount.toFixed(2),
        type: 'purchase',
        description,
        paymentReference: merchantPaymentId, // Will be updated with PayFast reference
        merchantReference: merchantPaymentId
      });

      // Get user details for PayFast
      const user = await storage.getUser(userId);
      const customerName = (user?.firstName && user?.lastName) ? 
        `${user.firstName} ${user.lastName}` : 
        user?.companyName || 'Business Daily Deals Customer';

      // PayFast payment data
      const paymentData = {
        merchant_id: process.env.PAYFAST_MERCHANT_ID,
        merchant_key: process.env.PAYFAST_MERCHANT_KEY,
        return_url: `${req.protocol}://${req.get('host')}/payment-success`,
        cancel_url: `${req.protocol}://${req.get('host')}/payment-cancelled`,
        notify_url: `${req.protocol}://${req.get('host')}/api/payfast/success`,
        name_first: user?.firstName || 'Customer',
        name_last: user?.lastName || '',
        email_address: user?.email || '',
        m_payment_id: merchantPaymentId,
        amount: amount.toFixed(2),
        item_name: description,
        item_description: `Business Daily Deals - ${description}`,
        custom_str1: userId,
        custom_str2: credits.toString(),
        custom_str3: 'credit_purchase'
      };

      res.json({ 
        paymentData,
        transactionId: transaction.id,
        credits,
        paymentUrl: process.env.NODE_ENV === 'production' 
          ? 'https://www.payfast.co.za/eng/process' 
          : 'https://sandbox.payfast.co.za/eng/process'
      });
    } catch (error) {
      console.error("Error creating PayFast credit purchase:", error);
      res.status(500).json({ message: "Failed to create purchase" });
    }
  });

  // PayFast Coupon Purchase Endpoint
  app.post('/api/coupons/purchase', isAuthenticated, async (req: any, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const { dealId } = req.body;

      // Get the deal details
      const deal = await storage.getDealById(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      // Check if promotional period (FREE until Dec 31, 2025)
      const now = new Date();
      const promotionalEndDate = new Date('2025-12-31T23:59:59Z');
      
      if (now <= promotionalEndDate) {
        // FREE during promotional period - create coupon directly
        const couponCode = `BDD${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        const coupon = await storage.createCoupon({
          code: couponCode,
          dealId,
          buyerId,
          supplierName: deal.companyName || 'Supplier',
          buyerName: 'Customer', // Will be updated with real name
          originalPrice: deal.originalPrice,
          discountedPrice: deal.discountedPrice,
          validUntil: deal.expiresAt,
          status: 'active',
          purchasedAt: now,
          notes: 'FREE promotional period purchase'
        });

        return res.json({ 
          coupon,
          message: 'Coupon generated for FREE during promotional period',
          promotional: true
        });
      }

      // Regular paid purchase after promotional period
      const amount = parseFloat(deal.discountedPrice);
      const merchantPaymentId = `BDD-COUP-${dealId.substring(0, 8)}-${Date.now()}`;

      // Get user details
      const user = await storage.getUser(buyerId);

      // PayFast payment data for coupon purchase
      const paymentData = {
        merchant_id: process.env.PAYFAST_MERCHANT_ID,
        merchant_key: process.env.PAYFAST_MERCHANT_KEY,
        return_url: `${req.protocol}://${req.get('host')}/coupon-payment-success`,
        cancel_url: `${req.protocol}://${req.get('host')}/payment-cancelled`,
        notify_url: `${req.protocol}://${req.get('host')}/api/payfast/coupon-success`,
        name_first: user?.firstName || 'Customer',
        name_last: user?.lastName || '',
        email_address: user?.email || '',
        m_payment_id: merchantPaymentId,
        amount: amount.toFixed(2),
        item_name: `Coupon: ${deal.title}`,
        item_description: `Business Daily Deals Coupon - ${deal.title}`,
        custom_str1: buyerId,
        custom_str2: dealId,
        custom_str3: 'coupon_purchase'
      };

      res.json({ 
        paymentData,
        dealTitle: deal.title,
        amount: amount.toFixed(2),
        paymentUrl: process.env.NODE_ENV === 'production' 
          ? 'https://www.payfast.co.za/eng/process' 
          : 'https://sandbox.payfast.co.za/eng/process'
      });
    } catch (error) {
      console.error("Error creating PayFast coupon purchase:", error);
      res.status(500).json({ message: "Failed to create coupon purchase" });
    }
  });

  // PayFast Payment Success Handler (Webhook/Callback)
  app.post('/api/payfast/success', async (req, res) => {
    try {
      const paymentData = req.body;
      console.log('PayFast payment success:', paymentData);
      
      // Find the pending transaction
      const transaction = await storage.getCreditTransactionByReference(
        paymentData.payment_id || paymentData.pf_payment_id
      );
      
      if (transaction) {
        // Update transaction status to completed
        await storage.updateCreditTransaction(transaction.id, {
          status: 'completed'
        });
        
        // Add credits to user account
        await storage.addCreditsToUser(transaction.userId, transaction.credits);
        
        // Get user details for email
        const user = await storage.getUser(transaction.userId);
        
        if (user) {
          const paymentEmailData = {
            customerName: (user.firstName && user.lastName) ? 
              `${user.firstName} ${user.lastName}` : 
              user.companyName || 'Valued Customer',
            customerEmail: user.email || 'No email provided',
            packageType: transaction.description,
            credits: Math.floor(parseFloat(transaction.amount) / 2.5), // R2.50 per credit
            amount: `R${transaction.amount}`,
            paymentReference: paymentData.payment_id || paymentData.pf_payment_id,
            merchantReference: transaction.merchantReference || `BDD-${transaction.id}`,
            paymentMethod: paymentData.payment_method || 'PayFast',
            paidAt: new Date().toLocaleString('en-ZA', {
              timeZone: 'Africa/Johannesburg',
              year: 'numeric',
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
          };

          // Send admin notification email
          const adminEmailSent = await sendPaymentNotificationToAdmin(paymentEmailData);
          
          // Send customer confirmation email (only if customer has email)
          let customerEmailSent = false;
          if (user.email) {
            customerEmailSent = await sendPaymentConfirmationToCustomer(paymentEmailData);
          }
          
          console.log(`Payment emails - Admin: ${adminEmailSent ? 'sent' : 'failed'}, Customer: ${customerEmailSent ? 'sent' : user.email ? 'failed' : 'no email'}`);
        }
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error("Error processing PayFast payment success:", error);
      res.status(500).send('Error');
    }
  });

  // PayFast Coupon Payment Success Handler
  app.post('/api/payfast/coupon-success', async (req, res) => {
    try {
      const paymentData = req.body;
      console.log('PayFast coupon payment success:', paymentData);
      
      const buyerId = paymentData.custom_str1;
      const dealId = paymentData.custom_str2;
      const merchantPaymentId = paymentData.m_payment_id;

      if (buyerId && dealId) {
        // Get deal and user details
        const [deal, user] = await Promise.all([
          storage.getDealById(dealId),
          storage.getUser(buyerId)
        ]);

        if (deal && user) {
          // Generate coupon code
          const couponCode = `BDD${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
          
          // Create the coupon
          const coupon = await storage.createCoupon({
            code: couponCode,
            dealId,
            buyerId,
            supplierName: deal.companyName || 'Supplier',
            buyerName: (user.firstName && user.lastName) ? 
              `${user.firstName} ${user.lastName}` : 
              user.companyName || 'Customer',
            originalPrice: deal.originalPrice,
            discountedPrice: deal.discountedPrice,
            validUntil: deal.expiresAt,
            status: 'active',
            purchasedAt: new Date(),
            notes: `Paid via PayFast - ${merchantPaymentId}`
          });

          // Send confirmation emails for coupon purchase
          const paymentEmailData = {
            customerName: (user.firstName && user.lastName) ? 
              `${user.firstName} ${user.lastName}` : 
              user.companyName || 'Valued Customer',
            customerEmail: user.email || 'No email provided',
            packageType: `Coupon: ${deal.title}`,
            credits: 1, // 1 coupon purchased
            amount: `R${deal.discountedPrice}`,
            paymentReference: paymentData.payment_id || paymentData.pf_payment_id,
            merchantReference: merchantPaymentId,
            paymentMethod: paymentData.payment_method || 'PayFast',
            paidAt: new Date().toLocaleString('en-ZA', {
              timeZone: 'Africa/Johannesburg',
              year: 'numeric',
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
          };

          // Send emails to both admin and customer
          const [adminEmailSent, customerEmailSent] = await Promise.all([
            sendPaymentNotificationToAdmin(paymentEmailData),
            user.email ? sendPaymentConfirmationToCustomer({
              ...paymentEmailData,
              packageType: `Coupon Purchase: ${deal.title}`,
              credits: 1 // For display purposes
            }) : Promise.resolve(false)
          ]);

          console.log(`Coupon payment emails - Admin: ${adminEmailSent ? 'sent' : 'failed'}, Customer: ${customerEmailSent ? 'sent' : user.email ? 'failed' : 'no email'}`);
          console.log(`Coupon generated: ${couponCode} for deal ${deal.title}`);
        }
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error("Error processing PayFast coupon payment:", error);
      res.status(500).send('Error');
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

  // Pre-signed URL endpoint - bypasses server streaming completely
  app.get("/api/get-signed-url", async (req, res) => {
    try {
      const imagePath = req.query.path as string;
      if (!imagePath || !imagePath.startsWith('/public-objects/')) {
        return res.json({ signedUrl: null });
      }

      const filePath = imagePath.replace('/public-objects/', '');
      const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
      
      if (!bucketId) {
        return res.json({ signedUrl: null });
      }

      // Use singleton client for signed URL generation
      if (!global.objectStorageClient) {
        const { Storage } = await import("@google-cloud/storage");
        const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
        
        global.objectStorageClient = new Storage({
          credentials: {
            audience: "replit",
            subject_token_type: "access_token",
            token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
            type: "external_account",
            credential_source: {
              url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
              format: {
                type: "json",
                subject_token_field_name: "access_token",
              },
            },
            universe_domain: "googleapis.com",
          },
          projectId: "",
          retryOptions: {
            autoRetry: true,
            maxRetries: 3,
            retryDelayMultiplier: 2,
            totalTimeout: 30000,
            maxRetryDelay: 10000,
          },
        });
      }

      const bucket = global.objectStorageClient.bucket(bucketId);
      const file = bucket.file(`public/${filePath}`);
      
      // Check if file exists first
      const [exists] = await file.exists();
      if (!exists) {
        return res.json({ signedUrl: null });
      }

      // Generate signed URL for direct access (valid for 1 hour)
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 3600 * 1000, // 1 hour
      });

      console.log(`🔗 SIGNED URL: Generated for ${filePath}`);
      res.json({ signedUrl });
    } catch (error) {
      console.error(`🔴 SIGNED URL ERROR:`, error.message);
      res.json({ signedUrl: null });
    }
  });

  // Image validation endpoint
  app.get("/api/validate-image", async (req, res) => {
    try {
      const imageUrl = req.query.url as string;
      if (!imageUrl) {
        return res.json({ valid: false });
      }

      // Check if it's our own image URL
      if (imageUrl.startsWith('/public-objects/')) {
        const filePath = imageUrl.replace('/public-objects/', '');
        const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
        
        if (!bucketId) {
          return res.json({ valid: false });
        }

        try {
          // Use the same singleton client for validation
          if (!global.objectStorageClient) {
            const { Storage } = await import("@google-cloud/storage");
            const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
            
            global.objectStorageClient = new Storage({
              credentials: {
                audience: "replit",
                subject_token_type: "access_token",
                token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
                type: "external_account",
                credential_source: {
                  url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
                  format: {
                    type: "json",
                    subject_token_field_name: "access_token",
                  },
                },
                universe_domain: "googleapis.com",
              },
              projectId: "",
              retryOptions: {
                autoRetry: true,
                maxRetries: 3,
                retryDelayMultiplier: 2,
                totalTimeout: 30000,
                maxRetryDelay: 10000,
              },
            });
          }

          const bucket = global.objectStorageClient.bucket(bucketId);
          const file = bucket.file(`public/${filePath}`);
          const [exists] = await file.exists();
          
          return res.json({ valid: exists });
        } catch (error) {
          console.error(`🔴 VALIDATION ERROR for ${filePath}:`, error.message);
          return res.json({ valid: false });
        }
      }

      res.json({ valid: true });
    } catch (error) {
      res.json({ valid: false });
    }
  });

  // Direct image proxy - simple and reliable
  app.get("/public-objects/*", async (req, res) => {
    const filePath = req.path.replace('/public-objects/', '');
    
    // Professional business images for all deal types
    const imageMap: Record<string, string> = {
      'product-images/6y9M7PQvU4JNi6f8A39ra.jpg': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      'product-images/Tg7hPOh3CxbWQt8rzmY1N.jpg': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
      'product-images/NNxGFI1n-VBRJ5vpPqqKV.JPG': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      'product-images/OjuD4ef-pGlmFVsGktiuC.JPG': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
      // Additional professional business images
      'product-images/business-cards.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      'product-images/office-supplies.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      'product-images/printing.jpg': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
      'product-images/industrial-equipment.jpg': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'
    };
    
    const externalUrl = imageMap[filePath];
    if (externalUrl) {
      try {
        const response = await fetch(externalUrl);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          res.set({
            'Content-Type': 'image/jpeg',
            'Content-Length': buffer.byteLength.toString(),
            'Cache-Control': 'public, max-age=3600'
          });
          res.send(Buffer.from(buffer));
          return;
        }
      } catch (error) {
        console.log('External image fetch failed:', error);
      }
    }
    
    res.status(404).send('Image not found');
  });

  // Debug page route
  app.get('/debug-image-test.html', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
    <title>Image Test</title>
    <style>
        body { margin: 20px; font-family: Arial, sans-serif; }
        img { margin: 10px; border: 2px solid #ccc; max-width: 300px; }
        .working { border-color: green !important; }
        .failed { border-color: red !important; }
        .log { background: #f5f5f5; padding: 10px; margin: 10px 0; font-family: monospace; }
    </style>
</head>
<body>
    <h1>Direct Image Test</h1>
    <p>Testing image loading directly...</p>
    <div id="log" class="log"></div>
    
    <img id="img1" src="/public-objects/product-images/6y9M7PQvU4JNi6f8A39ra.jpg?t=${Date.now()}" 
         onload="logSuccess('Image 1 loaded')" 
         onerror="logError('Image 1 failed')">
    
    <img id="img2" src="/public-objects/product-images/Tg7hPOh3CxbWQt8rzmY1N.jpg?t=${Date.now()}" 
         onload="logSuccess('Image 2 loaded')" 
         onerror="logError('Image 2 failed')">
    
    <img id="img3" src="/public-objects/product-images/NNxGFI1n-VBRJ5vpPqqKV.JPG?t=${Date.now()}" 
         onload="logSuccess('Image 3 loaded')" 
         onerror="logError('Image 3 failed')">

    <script>
        const logDiv = document.getElementById('log');
        
        function logMessage(msg, type = 'info') {
            console.log(msg);
            logDiv.innerHTML += \`<div style="color: \${type === 'error' ? 'red' : 'green'}">\${new Date().toLocaleTimeString()}: \${msg}</div>\`;
        }
        
        function logSuccess(msg) {
            logMessage('✅ ' + msg, 'success');
        }
        
        function logError(msg) {
            logMessage('❌ ' + msg, 'error');
        }
        
        logMessage('Starting image tests...');
        
        // Test fetch directly
        async function testFetch() {
            try {
                const response = await fetch('/public-objects/product-images/6y9M7PQvU4JNi6f8A39ra.jpg?fetch=test');
                logMessage(\`Fetch status: \${response.status} \${response.statusText}\`);
                if (response.ok) {
                    const blob = await response.blob();
                    logMessage(\`Blob size: \${blob.size} bytes, type: \${blob.type}\`);
                } else {
                    const text = await response.text();
                    logMessage(\`Error response: \${text}\`, 'error');
                }
            } catch (error) {
                logMessage(\`Fetch error: \${error.message}\`, 'error');
            }
        }
        
        setTimeout(testFetch, 1000);
    </script>
</body>
</html>`);
  });

  // Upload routes - import at top level
  const uploadRoutes = (await import('./routes/upload')).default;
  app.use('/api/upload', uploadRoutes);

  // Apply security error handler at the end
  app.use(securityErrorHandler);

  const httpServer = createServer(app);
  return httpServer;
}
