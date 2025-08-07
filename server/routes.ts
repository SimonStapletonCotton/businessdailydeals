import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertDealSchema, insertKeywordSchema, insertInquirySchema, insertCouponSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // User routes
  app.patch('/api/user/type', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { userType } = req.body;
      
      if (!['buyer', 'supplier'].includes(userType)) {
        return res.status(400).json({ message: "Invalid user type" });
      }

      const user = await storage.updateUserType(userId, userType);
      res.json(user);
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
      const inquiryData = insertInquirySchema.parse({
        ...req.body,
        buyerId
      });

      const inquiry = await storage.createInquiry(inquiryData);
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

  const httpServer = createServer(app);
  return httpServer;
}
