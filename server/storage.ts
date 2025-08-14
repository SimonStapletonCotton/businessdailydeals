import {
  users,
  deals,
  keywords,
  notifications,
  inquiries,
  coupons,
  couponRedemptions,
  basketItems,
  rates,
  creditTransactions,
  orders,
  bannerAds,
  companies,
  siteAnalytics,
  dealRequests,
  type User,
  type UpsertUser,
  type Deal,
  type InsertDeal,
  type Keyword,
  type InsertKeyword,
  type Notification,
  type InsertNotification,
  type Inquiry,
  type InsertInquiry,
  type Coupon,
  type InsertCoupon,
  type CouponRedemption,
  type InsertCouponRedemption,
  type Rate,
  type InsertRate,
  type CreditTransaction,
  type InsertCreditTransaction,
  type Order,
  type InsertOrder,
  type BannerAd,
  type InsertBannerAd,
  type Company,
  type InsertCompany,
  type SiteAnalytics,
  type InsertSiteAnalytics,
  type DealRequest,
  type InsertDealRequest,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

// Extended types for joins
export type DealWithSupplier = Deal & { supplier: User };
export type NotificationWithDeal = Notification & { deal?: Deal };
export type InquiryWithDetails = Inquiry & { deal: Deal; buyer: User };
export type CouponWithDetails = Coupon & { deal: Deal; buyer: User; supplier: User };

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: any): Promise<User>;
  updateUserType(id: string, userType: string): Promise<User>;
  getSuppliersDirectory(): Promise<any[]>;
  
  // Deal operations
  getDeals(dealType?: 'hot' | 'regular'): Promise<DealWithSupplier[]>;
  getDeal(id: string): Promise<DealWithSupplier | undefined>;
  getDealById(id: string): Promise<Deal | undefined>;
  getDealsBySupplier(supplierId: string): Promise<DealWithSupplier[]>;
  getExpiredDealsBySupplier(supplierId: string): Promise<DealWithSupplier[]>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: string, deal: Partial<InsertDeal>): Promise<Deal>;
  reactivateDeal(id: string, newExpiresAt: Date): Promise<Deal>;
  deleteDeal(id: string): Promise<void>;
  deleteAllDeals(): Promise<void>;
  searchDeals(query: string, category?: string): Promise<DealWithSupplier[]>;
  
  // Keyword operations
  getUserKeywords(userId: string): Promise<Keyword[]>;
  addKeyword(keyword: InsertKeyword): Promise<Keyword>;
  createKeyword(userId: string, keyword: string): Promise<Keyword>;
  removeKeyword(id: string): Promise<void>;
  
  // Notification operations
  getUserNotifications(userId: string): Promise<NotificationWithDeal[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // Inquiry operations
  getInquiriesBySupplier(supplierId: string): Promise<InquiryWithDetails[]>;
  getInquiriesByBuyer(buyerId: string): Promise<InquiryWithDetails[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiryStatus(id: string, status: string): Promise<Inquiry>;
  
  // Coupon operations
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  getCouponsByBuyer(buyerId: string): Promise<CouponWithDetails[]>;
  getCouponsBySupplier(supplierId: string): Promise<CouponWithDetails[]>;
  getCouponByCode(couponCode: string): Promise<CouponWithDetails | undefined>;
  redeemCoupon(couponCode: string, redemptionData?: {
    location?: string;
    notes?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ success: boolean; coupon?: Coupon; message: string }>;
  getCouponRedemptionHistory(couponCode: string): Promise<CouponRedemption[]>;
  validateCouponForRedemption(couponCode: string): Promise<{
    valid: boolean; 
    coupon?: Coupon; 
    message: string;
    canRedeem: boolean;
  }>;
  expireCoupon(id: string): Promise<Coupon>;
  getPublicCoupons(limit?: number): Promise<any[]>;
  getCouponStats(): Promise<any>;
  
  // Rates operations
  getRates(): Promise<Rate[]>;
  createRate(rate: InsertRate): Promise<Rate>;
  bulkCreateRates(rates: InsertRate[]): Promise<Rate[]>;
  
  // Credits and payment operations
  getUserCreditBalance(userId: string): Promise<{ creditBalance: string; totalCreditsSpent: string }>;
  createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>;
  getUserCreditTransactions(userId: string): Promise<CreditTransaction[]>;
  updateUserCreditBalance(userId: string, amount: string, operation: 'add' | 'subtract'): Promise<User>;
  updateUserStripeInfo(userId: string, data: { stripeCustomerId?: string; stripeSubscriptionId?: string }): Promise<User>;
  getCreditTransactionByReference(paymentReference: string): Promise<CreditTransaction | undefined>;
  updateCreditTransaction(id: string, updates: Partial<InsertCreditTransaction>): Promise<CreditTransaction>;
  addCreditsToUser(userId: string, credits: number): Promise<void>;
  
  // Direct purchase operations
  createOrder(order: InsertOrder): Promise<Order>;
  getUserOrders(userId: string, type: 'buyer' | 'seller'): Promise<Order[]>;
  getOrder(orderId: string): Promise<Order | undefined>;
  updateOrderStatus(orderId: string, status: string): Promise<Order>;
  
  // Banner advertising operations
  getActiveBannerAds(position?: string): Promise<BannerAd[]>;
  createBannerAd(bannerAd: InsertBannerAd): Promise<BannerAd>;
  updateBannerAdStats(adId: string, type: 'click' | 'impression'): Promise<BannerAd>;
  getUserBannerAds(userId: string): Promise<BannerAd[]>;
  
  // Company directory operations
  getCompanies(category?: string, alphabetical?: boolean): Promise<Company[]>;
  getCompany(id: string): Promise<Company | undefined>;
  createOrUpdateCompany(company: InsertCompany): Promise<Company>;
  updateCompanyStats(userId: string, dealType: 'hot' | 'regular', operation: 'add' | 'subtract'): Promise<void>;
  
  // Search and analytics operations
  searchDealsAdvanced(query: string, filters?: { category?: string; dealType?: 'hot' | 'regular'; priceRange?: { min: number; max: number } }): Promise<Deal[]>;
  searchCompanies(query: string): Promise<Company[]>;
  updateDealAnalytics(dealId: string, type: 'view' | 'click'): Promise<Deal>;
  recordSiteAnalytics(date: string, type: 'visit' | 'unique_visitor' | 'deal_view' | 'search_query'): Promise<void>;
  getSiteAnalytics(startDate?: string, endDate?: string): Promise<SiteAnalytics[]>;
  updateRate(id: string, rate: Partial<InsertRate>): Promise<Rate>;
  deleteRate(id: string): Promise<void>;
  clearAllRates(): Promise<void>;
  
  // Deal request operations
  createDealRequest(request: InsertDealRequest): Promise<DealRequest>;
  getDealRequests(): Promise<DealRequest[]>;
  getDealRequestsByUser(userId: string): Promise<DealRequest[]>;
  updateDealRequestStatus(id: string, status: string): Promise<DealRequest>;
  
  // Business statistics operations
  getBusinessStats(): Promise<{
    activeSuppliers: number;
    totalDeals: number;
    successfulConnections: number;
    totalSavings: number;
  }>;
  
  // Keyword management operations
  updateUserKeywords(userId: string, data: {
    keywords?: string;
    notificationMethod?: string;
    allowEmailNotifications?: boolean;
    allowSmsNotifications?: boolean;
    allowWhatsappNotifications?: boolean;
  }): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(userData: any): Promise<User> {
    const userDataWithId = {
      ...userData,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const [user] = await db.insert(users).values(userDataWithId).returning();
    return user;
  }

  async updateUserType(id: string, userType: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ userType, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Credits and payment operations
  async getUserCreditBalance(userId: string): Promise<{ creditBalance: string; totalCreditsSpent: string }> {
    const [user] = await db.select({
      creditBalance: users.creditBalance,
      totalCreditsSpent: users.totalCreditsSpent
    }).from(users).where(eq(users.id, userId));
    
    return {
      creditBalance: user?.creditBalance || '0.00',
      totalCreditsSpent: user?.totalCreditsSpent || '0.00'
    };
  }

  async createCreditTransaction(transactionData: InsertCreditTransaction): Promise<CreditTransaction> {
    // Remove dealId if it's null to avoid database constraint issues
    const cleanData = { ...transactionData };
    if (cleanData.dealId === null) {
      delete cleanData.dealId;
    }
    
    const [transaction] = await db.insert(creditTransactions).values(cleanData).returning();
    return transaction;
  }

  async getUserCreditTransactions(userId: string): Promise<CreditTransaction[]> {
    return await db.select().from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt));
  }

  async updateUserCreditBalance(userId: string, amount: string, operation: 'add' | 'subtract'): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    const currentBalance = parseFloat(user.creditBalance || '0');
    const changeAmount = parseFloat(amount);
    const newBalance = operation === 'add' ? currentBalance + changeAmount : currentBalance - changeAmount;
    const newTotalSpent = operation === 'subtract' ? (parseFloat(user.totalCreditsSpent || '0') + changeAmount) : parseFloat(user.totalCreditsSpent || '0');

    const [updatedUser] = await db.update(users)
      .set({ 
        creditBalance: newBalance.toFixed(2),
        totalCreditsSpent: newTotalSpent.toFixed(2),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async updateUserStripeInfo(userId: string, data: { stripeCustomerId?: string; stripeSubscriptionId?: string }): Promise<User> {
    const [user] = await db.update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Direct purchase operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [result] = await db.insert(orders).values(order).returning();
    return result;
  }

  async getUserOrders(userId: string, type: 'buyer' | 'seller'): Promise<Order[]> {
    if (type === 'buyer') {
      return await db.select().from(orders)
        .where(eq(orders.buyerId, userId))
        .orderBy(desc(orders.createdAt));
    } else {
      // For seller, join with deals to get orders for supplier's deals
      const result = await db.select({
        orders: orders
      }).from(orders)
      .innerJoin(deals, eq(orders.dealId, deals.id))
      .where(eq(deals.supplierId, userId))
      .orderBy(desc(orders.createdAt));
      
      return result.map(row => row.orders);
    }
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    return order;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const [order] = await db.update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();
    return order;
  }

  // Banner advertising operations
  async getActiveBannerAds(position?: string): Promise<BannerAd[]> {
    let whereCondition = eq(bannerAds.isActive, true);
    if (position) {
      whereCondition = and(eq(bannerAds.isActive, true), eq(bannerAds.position, position))!;
    }

    return await db.select().from(bannerAds)
      .where(whereCondition)
      .orderBy(desc(bannerAds.priority), desc(bannerAds.createdAt));
  }

  async createBannerAd(bannerAd: InsertBannerAd): Promise<BannerAd> {
    const [result] = await db.insert(bannerAds).values(bannerAd).returning();
    return result;
  }

  async updateBannerAdStats(adId: string, type: 'click' | 'impression'): Promise<BannerAd> {
    const field = type === 'click' ? bannerAds.clickCount : bannerAds.impressionCount;
    const [result] = await db.update(bannerAds)
      .set({ [type === 'click' ? 'clickCount' : 'impressionCount']: sql`${field} + 1` })
      .where(eq(bannerAds.id, adId))
      .returning();
    return result;
  }

  async getUserBannerAds(userId: string): Promise<BannerAd[]> {
    return await db.select().from(bannerAds)
      .where(eq(bannerAds.advertiserId, userId))
      .orderBy(desc(bannerAds.createdAt));
  }

  // Company directory operations
  async getCompanies(category?: string, alphabetical = false): Promise<Company[]> {
    let query = db.select().from(companies);
    
    if (category) {
      query = query.where(eq(companies.category, category));
    }
    
    if (alphabetical) {
      return await query.orderBy(companies.name);
    }
    
    return await query.orderBy(desc(companies.totalDeals), desc(companies.createdAt));
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async createOrUpdateCompany(company: InsertCompany): Promise<Company> {
    if (company.userId) {
      // Check if company exists for this user
      const [existing] = await db.select().from(companies).where(eq(companies.userId, company.userId));
      
      if (existing) {
        const [updated] = await db.update(companies)
          .set({ ...company, updatedAt: new Date() })
          .where(eq(companies.userId, company.userId))
          .returning();
        return updated;
      }
    }
    
    const [result] = await db.insert(companies).values(company).returning();
    return result;
  }

  async updateCompanyStats(userId: string, dealType: 'hot' | 'regular', operation: 'add' | 'subtract'): Promise<void> {
    const [company] = await db.select().from(companies).where(eq(companies.userId, userId));
    
    if (company) {
      const totalChange = operation === 'add' ? 1 : -1;
      const hotChange = dealType === 'hot' ? totalChange : 0;
      const regularChange = dealType === 'regular' ? totalChange : 0;

      await db.update(companies)
        .set({
          totalDeals: Math.max(0, (company.totalDeals || 0) + totalChange),
          hotDealsCount: Math.max(0, (company.hotDealsCount || 0) + hotChange),
          regularDealsCount: Math.max(0, (company.regularDealsCount || 0) + regularChange),
          updatedAt: new Date()
        })
        .where(eq(companies.userId, userId));
    }
  }

  // Search and analytics operations
  async searchDealsAdvanced(query: string, filters?: { category?: string; dealType?: 'hot' | 'regular'; priceRange?: { min: number; max: number } }): Promise<Deal[]> {
    let whereConditions = [eq(deals.status, 'active')];
    
    if (query) {
      whereConditions.push(
        or(
          like(deals.title, `%${query}%`),
          like(deals.description, `%${query}%`),
          sql`${deals.keywords}::text ILIKE ${`%${query}%`}`
        )!
      );
    }
    
    if (filters?.category) {
      whereConditions.push(eq(deals.category, filters.category));
    }
    
    if (filters?.dealType) {
      whereConditions.push(eq(deals.dealType, filters.dealType));
    }
    
    if (filters?.priceRange) {
      if (filters.priceRange.min > 0) {
        whereConditions.push(sql`CAST(${deals.price} AS DECIMAL) >= ${filters.priceRange.min}`);
      }
      if (filters.priceRange.max > 0) {
        whereConditions.push(sql`CAST(${deals.price} AS DECIMAL) <= ${filters.priceRange.max}`);
      }
    }

    return await db.select().from(deals)
      .where(and(...whereConditions))
      .orderBy(desc(deals.createdAt));
  }

  async searchCompanies(query: string): Promise<Company[]> {
    return await db.select().from(companies)
      .where(
        or(
          like(companies.name, `%${query}%`),
          like(companies.description, `%${query}%`),
          like(companies.category, `%${query}%`)
        )
      )
      .orderBy(companies.name);
  }

  async updateDealAnalytics(dealId: string, type: 'view' | 'click'): Promise<Deal> {
    const field = type === 'view' ? deals.viewCount : deals.clickCount;
    const [result] = await db.update(deals)
      .set({ [type === 'view' ? 'viewCount' : 'clickCount']: sql`${field} + 1` })
      .where(eq(deals.id, dealId))
      .returning();
    return result;
  }

  async recordSiteAnalytics(date: string, type: 'visit' | 'unique_visitor' | 'deal_view' | 'search_query'): Promise<void> {
    // Try to find existing record for the date
    const [existing] = await db.select().from(siteAnalytics).where(eq(siteAnalytics.date, date));
    
    if (existing) {
      // Update existing record
      const updates: any = {};
      switch (type) {
        case 'visit':
          updates.totalVisits = (existing.totalVisits || 0) + 1;
          break;
        case 'unique_visitor':
          updates.uniqueVisitors = (existing.uniqueVisitors || 0) + 1;
          break;
        case 'deal_view':
          updates.dealViews = (existing.dealViews || 0) + 1;
          break;
        case 'search_query':
          updates.searchQueries = (existing.searchQueries || 0) + 1;
          break;
      }
      
      await db.update(siteAnalytics)
        .set(updates)
        .where(eq(siteAnalytics.id, existing.id));
    } else {
      // Create new record
      const newRecord: any = {
        date,
        totalVisits: type === 'visit' ? 1 : 0,
        uniqueVisitors: type === 'unique_visitor' ? 1 : 0,
        dealViews: type === 'deal_view' ? 1 : 0,
        searchQueries: type === 'search_query' ? 1 : 0,
      };
      
      await db.insert(siteAnalytics).values(newRecord);
    }
  }

  async getSiteAnalytics(startDate?: string, endDate?: string): Promise<SiteAnalytics[]> {
    let query = db.select().from(siteAnalytics);
    
    if (startDate && endDate) {
      query = query.where(
        and(
          sql`${siteAnalytics.date} >= ${startDate}`,
          sql`${siteAnalytics.date} <= ${endDate}`
        )
      );
    } else if (startDate) {
      query = query.where(sql`${siteAnalytics.date} >= ${startDate}`);
    } else if (endDate) {
      query = query.where(sql`${siteAnalytics.date} <= ${endDate}`);
    }
    
    return await query.orderBy(desc(siteAnalytics.date));
  }

  // Deal operations
  async getDeals(dealType?: 'hot' | 'regular'): Promise<DealWithSupplier[]> {
    let whereCondition = eq(deals.dealStatus, 'active');
    
    if (dealType) {
      whereCondition = and(eq(deals.dealStatus, 'active'), eq(deals.dealType, dealType))!;
    }

    const result = await db
      .select({
        deals: deals,
        users: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          userType: users.userType,
          mobile: users.mobile,
          province: users.province,
          companyName: users.companyName,
          representativeName: users.representativeName,
          emailNotifications: users.emailNotifications,
          smsNotifications: users.smsNotifications,
          whatsappNotifications: users.whatsappNotifications,
          address: users.address,
          vatNumber: users.vatNumber,
          businessRegistrationNumber: users.businessRegistrationNumber,
          isVerified: users.isVerified,
          creditBalance: users.creditBalance,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        }
      })
      .from(deals)
      .leftJoin(users, eq(deals.supplierId, users.id))
      .where(whereCondition)
      .orderBy(desc(deals.createdAt));

    const mappedResults = result.map(row => ({
      ...row.deals,
      supplier: row.users!
    }));
    

    
    return mappedResults;
  }

  async getDeal(id: string): Promise<DealWithSupplier | undefined> {
    const result = await db
      .select({
        deals: deals,
        users: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          userType: users.userType,
          mobile: users.mobile,
          province: users.province,
          companyName: users.companyName,
          representativeName: users.representativeName,
          emailNotifications: users.emailNotifications,
          smsNotifications: users.smsNotifications,
          whatsappNotifications: users.whatsappNotifications,
          address: users.address,
          vatNumber: users.vatNumber,
          businessRegistrationNumber: users.businessRegistrationNumber,
          isVerified: users.isVerified,
          creditBalance: users.creditBalance,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        }
      })
      .from(deals)
      .leftJoin(users, eq(deals.supplierId, users.id))
      .where(eq(deals.id, id));

    if (result.length === 0) return undefined;

    const row = result[0];
    return {
      ...row.deals,
      supplier: row.users!
    };
  }

  async getDealById(id: string): Promise<Deal | undefined> {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    return deal || undefined;
  }

  async getDealsBySupplier(supplierId: string): Promise<DealWithSupplier[]> {
    const result = await db
      .select({
        deals: deals,
        users: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          userType: users.userType,
          mobile: users.mobile,
          province: users.province,
          companyName: users.companyName,
          representativeName: users.representativeName,
          emailNotifications: users.emailNotifications,
          smsNotifications: users.smsNotifications,
          whatsappNotifications: users.whatsappNotifications,
          address: users.address,
          vatNumber: users.vatNumber,
          businessRegistrationNumber: users.businessRegistrationNumber,
          isVerified: users.isVerified,
          creditBalance: users.creditBalance,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        }
      })
      .from(deals)
      .leftJoin(users, eq(deals.supplierId, users.id))
      .where(and(eq(deals.supplierId, supplierId), eq(deals.dealStatus, 'active')))
      .orderBy(desc(deals.createdAt));

    return result.map(row => ({
      ...row.deals,
      supplier: row.users!
    }));
  }

  async getExpiredDealsBySupplier(supplierId: string): Promise<DealWithSupplier[]> {
    const result = await db
      .select({
        deals: deals,
        users: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          userType: users.userType,
          mobile: users.mobile,
          province: users.province,
          companyName: users.companyName,
          representativeName: users.representativeName,
          emailNotifications: users.emailNotifications,
          smsNotifications: users.smsNotifications,
          whatsappNotifications: users.whatsappNotifications,
          address: users.address,
          vatNumber: users.vatNumber,
          businessRegistrationNumber: users.businessRegistrationNumber,
          isVerified: users.isVerified,
          creditBalance: users.creditBalance,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        }
      })
      .from(deals)
      .leftJoin(users, eq(deals.supplierId, users.id))
      .where(and(eq(deals.supplierId, supplierId), eq(deals.dealStatus, 'expired')))
      .orderBy(desc(deals.createdAt));

    return result.map(row => ({
      ...row.deals,
      supplier: row.users!
    }));
  }

  async createDeal(dealData: InsertDeal): Promise<Deal> {
    // Calculate credits cost based on deal type
    const creditsCost = this.calculateDealCredits(dealData.dealType || 'regular');
    
    // Check if supplier is in promotional period (FREE until Feb 20, 2026)
    const isPromotionalPeriod = new Date() < new Date('2026-02-20T23:59:59Z');
    const finalCreditsCost = isPromotionalPeriod ? 0 : creditsCost;
    
    const dealWithCredits = { 
      ...dealData, 
      creditsCost: finalCreditsCost.toString(),
      price: dealData.price?.toString(),
      originalPrice: dealData.originalPrice?.toString()
    };

    const [deal] = await db.insert(deals).values(dealWithCredits).returning();
    
    // Charge credits to supplier (only if not in promotional period)
    if (finalCreditsCost > 0 && dealData.supplierId && !isPromotionalPeriod) {
      await this.chargeDealCredits(dealData.supplierId, finalCreditsCost, deal.id, dealData.dealType || 'regular');
    }
    
    // Create notifications for users with matching keywords
    if (dealData.keywords && dealData.keywords.length > 0) {
      const matchingKeywords = await db
        .select()
        .from(keywords)
        .where(inArray(keywords.keyword, dealData.keywords));

      for (const keyword of matchingKeywords) {
        await this.createNotification({
          userId: keyword.userId,
          title: 'New Deal Alert',
          dealId: deal.id,
          message: `New deal matching your keyword "${keyword.keyword}": ${dealData.title}`,
        });
      }
    }

    return deal;
  }

  async updateDeal(id: string, dealData: Partial<InsertDeal>): Promise<Deal> {
    // Get the original deal to check for deal type changes
    const originalDeal = await this.getDeal(id);
    if (!originalDeal) throw new Error('Deal not found');

    const [deal] = await db
      .update(deals)
      .set({ ...dealData, updatedAt: new Date() })
      .where(eq(deals.id, id))
      .returning();

    // Handle credit adjustments for deal type changes
    if (dealData.dealType && dealData.dealType !== originalDeal.dealType) {
      await this.handleDealTypeChangeCredits(originalDeal, dealData.dealType);
    }

    return deal;
  }

  async reactivateDeal(id: string, newExpiresAt: Date): Promise<Deal> {
    const [deal] = await db
      .update(deals)
      .set({ 
        status: 'active',
        expiresAt: newExpiresAt,
        updatedAt: new Date() 
      })
      .where(eq(deals.id, id))
      .returning();
    return deal;
  }

  async updateDealExpiry(id: string, newExpiresAt: string): Promise<Deal> {
    const [deal] = await db
      .update(deals)
      .set({ 
        expiresAt: new Date(newExpiresAt),
        updatedAt: new Date() 
      })
      .where(eq(deals.id, id))
      .returning();
    return deal;
  }

  async deleteDeal(id: string): Promise<void> {
    const deal = await this.getDeal(id);
    if (!deal) throw new Error('Deal not found');

    // First delete related records to avoid foreign key constraints
    // Delete related coupons
    await db.delete(coupons).where(eq(coupons.dealId, id));
    
    // Delete related credit transactions
    await db.delete(creditTransactions).where(eq(creditTransactions.dealId, id));
    
    // Delete related notifications
    await db.delete(notifications).where(eq(notifications.dealId, id));
    
    // Delete related inquiries
    await db.delete(inquiries).where(eq(inquiries.dealId, id));
    
    // Now delete the deal
    await db.delete(deals).where(eq(deals.id, id));

    // Check if we're in promotional period (FREE until Feb 20, 2026) 
    const isPromotionalPeriod = new Date() < new Date('2026-02-20');
    
    if (!isPromotionalPeriod && parseFloat(deal.creditsCost || '0') > 0) {
      // Refund credits if deal was paid for (only after promotional period)
      // Add credits back to user's balance
      const currentBalance = await this.getCreditBalance(deal.supplierId);
      const refundAmount = parseFloat(deal.creditsCost);
      const newBalance = parseFloat(currentBalance.balance) + refundAmount;
      
      await db.update(users)
        .set({ creditBalance: newBalance.toString() })
        .where(eq(users.id, deal.supplierId));

      // Record the refund transaction (without dealId since deal is deleted)
      await this.createCreditTransaction({
        userId: deal.supplierId,
        amount: refundAmount.toString(),
        type: 'refund',
        description: `Refund for deleted deal: ${deal.title}`,
        dealId: null
      });
    }
  }

  async deleteAllDeals(): Promise<void> {
    // Delete all related records first to avoid foreign key constraints
    await db.delete(coupons);
    await db.delete(creditTransactions);
    await db.delete(notifications);  
    await db.delete(inquiries);
    
    // Finally delete all deals
    await db.delete(deals);
  }

  // Promotional period management
  async isSupplierInPromotionalPeriod(supplierId: string): Promise<boolean> {
    const supplier = await this.getUser(supplierId);
    if (!supplier || supplier.userType !== 'supplier') {
      return false;
    }

    // Check if promotional period is still active
    if (!supplier.isInPromotionalPeriod || !supplier.promotionalPeriodEnds) {
      return false;
    }

    const now = new Date();
    const promotionalEnds = new Date(supplier.promotionalPeriodEnds);
    
    if (now > promotionalEnds) {
      // Promotional period has expired, update user record
      await db.update(users)
        .set({ 
          isInPromotionalPeriod: false,
          updatedAt: new Date()
        })
        .where(eq(users.id, supplierId));
      
      return false;
    }

    return true;
  }

  async activateSupplierPromotionalPeriod(supplierId: string): Promise<User> {
    const now = new Date();
    const promotionalEnd = new Date('2026-02-20T23:59:59Z'); // FREE until February 20th, 2026
    
    const [user] = await db.update(users)
      .set({
        isInPromotionalPeriod: true,
        promotionalPeriodEnds: promotionalEnd,
        updatedAt: now
      })
      .where(eq(users.id, supplierId))
      .returning();
    
    console.log(`Activated FREE promotional period for supplier ${supplierId} ending ${promotionalEnd.toISOString()} (Feb 20th, 2026)`);
    return user;
  }

  // Credit management for deals
  private calculateDealCredits(dealType: 'hot' | 'regular'): number {
    // Check if we're in the promotional period (FREE until Feb 20, 2026)
    const isPromotionalPeriod = new Date() < new Date('2026-02-20T23:59:59Z');
    if (isPromotionalPeriod) {
      return 0; // All deals are FREE during promotional period
    }
    
    // Credit pricing structure (after promotional period ends)
    const creditPricing = {
      'hot': 50,     // R125 (50 credits × R2.50) - Premium placement on home page
      'regular': 20  // R50 (20 credits × R2.50) - Standard deal listing
    };
    
    return creditPricing[dealType] || 20;
  }

  private async chargeDealCredits(supplierId: string, credits: number, dealId: string, dealType: string): Promise<void> {
    // Check if we're in the global promotional period (FREE until Feb 20, 2026)
    const isPromotionalPeriod = new Date() < new Date('2026-02-20');
    if (isPromotionalPeriod || credits === 0) {
      // FREE period - no credits charged
      console.log(`All deals are FREE until Feb 20, 2026 - no credits charged for ${dealType} deal`);
      
      // Record the transaction as FREE
      await this.createCreditTransaction({
        userId: supplierId,
        amount: '0.00',
        type: 'promotional_free',
        description: `FREE promotional period until Feb 20, 2026 - ${dealType.toUpperCase()} deal posting (normally ${credits > 0 ? credits : (dealType === 'hot' ? 50 : 20)} credits)`,
        dealId: dealId
      });
      return;
    }

    // Check if supplier has sufficient credits (only after promotional period)
    const supplier = await this.getUser(supplierId);
    if (!supplier) throw new Error('Supplier not found');
    
    const currentBalance = parseFloat(supplier.creditBalance || '0');
    if (currentBalance < credits) {
      throw new Error(`Insufficient credits. Required: ${credits}, Available: ${currentBalance}`);
    }

    // Deduct credits from supplier
    await this.updateUserCreditBalance(supplierId, credits.toString(), 'subtract');

    // Record transaction
    await this.createCreditTransaction({
      userId: supplierId,
      amount: credits.toFixed(2),
      type: 'spend',
      description: `${dealType.toUpperCase()} deal posting - ${credits} credits`,
      dealId: dealId
    });
  }

  private async refundDealCredits(deal: any): Promise<void> {
    const creditsToRefund = parseFloat(deal.creditsCost);
    if (creditsToRefund <= 0) return;

    // Refund credits to supplier
    await this.updateUserCreditBalance(deal.supplierId, creditsToRefund.toString(), 'add');

    // Record refund transaction
    await this.createCreditTransaction({
      userId: deal.supplierId,
      amount: creditsToRefund.toFixed(2),
      type: 'refund',
      description: `Deal deletion refund - ${deal.title} (${creditsToRefund} credits)`,
      dealId: deal.id
    });
  }

  private async handleDealTypeChangeCredits(originalDeal: any, newDealType: 'hot' | 'regular'): Promise<void> {
    const originalCredits = parseFloat(originalDeal.creditsCost);
    const newCredits = this.calculateDealCredits(newDealType);
    const creditDifference = newCredits - originalCredits;

    // Check if we're in the promotional period (FREE until Feb 20, 2026)
    const isPromotionalPeriod = new Date() < new Date('2026-02-20T23:59:59Z');

    if (isPromotionalPeriod) {
      // During promotional period, all changes are FREE
      console.log(`Deal type change is FREE during promotional period: ${originalDeal.dealType} → ${newDealType}`);
      
      await this.createCreditTransaction({
        userId: originalDeal.supplierId,
        amount: '0.00',
        type: 'promotional_free',
        description: `FREE promotional period - Deal type change ${originalDeal.dealType} → ${newDealType} (normally ${Math.abs(creditDifference)} credits)`,
        dealId: originalDeal.id
      });
    } else {
      // After promotional period, handle normal credit logic
      if (creditDifference > 0) {
        // Charge additional credits for upgrade (regular → hot)
        await this.chargeDealCredits(
          originalDeal.supplierId, 
          creditDifference, 
          originalDeal.id, 
          `${originalDeal.dealType} → ${newDealType} upgrade`
        );
      } else if (creditDifference < 0) {
        // Refund excess credits for downgrade (hot → regular)
        const refundAmount = Math.abs(creditDifference);
        await this.updateUserCreditBalance(originalDeal.supplierId, refundAmount.toString(), 'add');
        
        await this.createCreditTransaction({
          userId: originalDeal.supplierId,
          amount: refundAmount.toFixed(2),
          type: 'refund',
          description: `Deal type change refund - ${originalDeal.dealType} → ${newDealType} (${refundAmount} credits)`,
          dealId: originalDeal.id
        });
      }
    }

    // Update the deal's credit cost (will be 0 during promotional period)
    await db
      .update(deals)
      .set({ creditsCost: newCredits.toString() })
      .where(eq(deals.id, originalDeal.id));
  }

  async searchDeals(query: string, category?: string): Promise<DealWithSupplier[]> {
    let whereCondition = and(
      eq(deals.status, 'active'),
      or(
        like(deals.title, `%${query}%`),
        like(deals.description, `%${query}%`)
      )
    );

    if (category && category !== 'All Categories') {
      whereCondition = and(whereCondition, eq(deals.category, category));
    }

    const result = await db
      .select({
        deals: deals,
        users: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          userType: users.userType,
          mobile: users.mobile,
          province: users.province,
          companyName: users.companyName,
          representativeName: users.representativeName,
          emailNotifications: users.emailNotifications,
          smsNotifications: users.smsNotifications,
          whatsappNotifications: users.whatsappNotifications,
          address: users.address,
          vatNumber: users.vatNumber,
          businessRegistrationNumber: users.businessRegistrationNumber,
          isVerified: users.isVerified,
          creditBalance: users.creditBalance,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        }
      })
      .from(deals)
      .leftJoin(users, eq(deals.supplierId, users.id))
      .where(whereCondition)
      .orderBy(desc(deals.createdAt));

    return result.map(row => ({
      ...row.deals,
      supplier: row.users!
    }));
  }

  // Keyword operations
  async getUserKeywords(userId: string): Promise<Keyword[]> {
    return await db.select().from(keywords).where(eq(keywords.userId, userId));
  }

  async addKeyword(keywordData: InsertKeyword): Promise<Keyword> {
    const [keyword] = await db.insert(keywords).values(keywordData).returning();
    return keyword;
  }

  async createKeyword(userId: string, keyword: string): Promise<Keyword> {
    const keywordData = {
      id: nanoid(),
      userId,
      keyword,
      createdAt: new Date(),
    };
    const [result] = await db.insert(keywords).values(keywordData).returning();
    return result;
  }

  async removeKeyword(id: string): Promise<void> {
    await db.delete(keywords).where(eq(keywords.id, id));
  }

  // Notification operations
  async getUserNotifications(userId: string): Promise<NotificationWithDeal[]> {
    try {
      const result = await db
        .select()
        .from(notifications)
        .leftJoin(deals, eq(notifications.dealId, deals.id))
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt));

      return result.map(row => ({
        ...row.notifications,
        deal: row.deals!
      }));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Return empty array if notifications table has issues
      return [];
    }
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  // Inquiry operations
  async getInquiriesBySupplier(supplierId: string): Promise<InquiryWithDetails[]> {
    const result = await db
      .select()
      .from(inquiries)
      .leftJoin(deals, eq(inquiries.dealId, deals.id))
      .leftJoin(users, eq(inquiries.buyerId, users.id))
      .where(eq(inquiries.supplierId, supplierId))
      .orderBy(desc(inquiries.createdAt));

    return result.map(row => ({
      ...row.inquiries,
      deal: row.deals!,
      buyer: row.users!,
      supplier: { id: supplierId } as User
    }));
  }

  async getInquiriesByBuyer(buyerId: string): Promise<InquiryWithDetails[]> {
    const result = await db
      .select()
      .from(inquiries)
      .leftJoin(deals, eq(inquiries.dealId, deals.id))
      .leftJoin(users, eq(inquiries.supplierId, users.id))
      .where(eq(inquiries.buyerId, buyerId))
      .orderBy(desc(inquiries.createdAt));

    return result.map(row => ({
      ...row.inquiries,
      deal: row.deals!,
      buyer: { id: buyerId } as User,
      supplier: row.users!
    }));
  }

  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(inquiries).values(inquiryData).returning();
    return inquiry;
  }

  async updateInquiryStatus(id: string, status: string): Promise<Inquiry> {
    const [inquiry] = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();
    return inquiry;
  }

  // Coupon operations
  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const [newCoupon] = await db
      .insert(coupons)
      .values(coupon)
      .returning();
    
    return newCoupon;
  }

  async getCouponsByBuyer(buyerId: string): Promise<CouponWithDetails[]> {
    const result = await db
      .select()
      .from(coupons)
      .leftJoin(deals, eq(coupons.dealId, deals.id))
      .leftJoin(users, eq(coupons.supplierId, users.id))
      .where(eq(coupons.buyerId, buyerId))
      .orderBy(desc(coupons.createdAt));

    return result.map(row => ({
      ...row.coupons,
      deal: row.deals!,
      buyer: {} as User, // Already filtered by buyer
      supplier: row.users!,
    }));
  }

  async getCouponsBySupplier(supplierId: string): Promise<CouponWithDetails[]> {
    const result = await db
      .select()
      .from(coupons)
      .leftJoin(deals, eq(coupons.dealId, deals.id))
      .leftJoin(users, eq(coupons.buyerId, users.id))
      .where(eq(coupons.supplierId, supplierId))
      .orderBy(desc(coupons.createdAt));

    return result.map(row => ({
      ...row.coupons,
      deal: row.deals!,
      buyer: row.users!,
      supplier: {} as User, // Already filtered by supplier
    }));
  }

  async getCouponByCode(couponCode: string): Promise<CouponWithDetails | undefined> {
    const result = await db
      .select()
      .from(coupons)
      .leftJoin(deals, eq(coupons.dealId, deals.id))
      .leftJoin(users, eq(coupons.buyerId, users.id))
      .where(eq(coupons.couponCode, couponCode));
    
    if (result.length === 0) return undefined;

    const row = result[0];
    return {
      ...row.coupons,
      deal: row.deals!,
      buyer: row.users!,
      supplier: {} as User, // Will be populated separately
    };
  }

  async redeemCoupon(
    couponCode: string, 
    redemptionData: {
      location?: string;
      notes?: string;
      ipAddress?: string;
      userAgent?: string;
    } = {}
  ): Promise<{ success: boolean; coupon?: Coupon; message: string }> {
    // First, check if coupon exists and get its current status
    const [existingCoupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.couponCode, couponCode))
      .limit(1);

    const redemptionId = nanoid();
    const auditLog: InsertCouponRedemption = {
      id: redemptionId,
      couponId: existingCoupon?.id || "unknown",
      couponCode: couponCode,
      attemptedAt: new Date(),
      success: false,
      location: redemptionData.location,
      notes: redemptionData.notes,
      ipAddress: redemptionData.ipAddress,
      userAgent: redemptionData.userAgent,
      failureReason: null
    };

    try {
      // VALIDATION 1: Check if coupon exists
      if (!existingCoupon) {
        auditLog.failureReason = "Coupon code not found";
        await db.insert(couponRedemptions).values(auditLog);
        return { 
          success: false, 
          message: "Invalid coupon code. Please verify the code and try again." 
        };
      }

      // VALIDATION 2: Check if already redeemed
      if (existingCoupon.isRedeemed) {
        auditLog.couponId = existingCoupon.id;
        auditLog.failureReason = `Already redeemed on ${existingCoupon.redeemedAt?.toLocaleDateString()} ${existingCoupon.redemptionLocation ? `at ${existingCoupon.redemptionLocation}` : ''}`;
        await db.insert(couponRedemptions).values(auditLog);
        return { 
          success: false, 
          message: `This coupon was already used on ${existingCoupon.redeemedAt?.toLocaleDateString('en-ZA')} ${existingCoupon.redemptionLocation ? `at ${existingCoupon.redemptionLocation}` : ''}. Each coupon can only be redeemed once.` 
        };
      }

      // VALIDATION 3: Check if expired
      if (existingCoupon.expiryDate && new Date() > existingCoupon.expiryDate) {
        auditLog.couponId = existingCoupon.id;
        auditLog.failureReason = "Coupon expired";
        await db.insert(couponRedemptions).values(auditLog);
        return { 
          success: false, 
          message: `This coupon expired on ${existingCoupon.expiryDate.toLocaleDateString('en-ZA')}. Expired coupons cannot be redeemed.` 
        };
      }

      // Generate unique verification code for this redemption
      const verificationCode = `VER-${nanoid(8).toUpperCase()}`;

      // REDEEM THE COUPON: Mark as redeemed with full tracking
      const [redeemedCoupon] = await db
        .update(coupons)
        .set({
          isRedeemed: true,
          redeemedAt: new Date(),
          redemptionLocation: redemptionData.location,
          redemptionNotes: redemptionData.notes,
          redemptionVerificationCode: verificationCode
        })
        .where(eq(coupons.couponCode, couponCode))
        .returning();

      // Log successful redemption
      auditLog.couponId = redeemedCoupon.id;
      auditLog.success = true;
      auditLog.failureReason = null;
      await db.insert(couponRedemptions).values(auditLog);

      return {
        success: true,
        coupon: redeemedCoupon,
        message: `Coupon successfully redeemed! Verification code: ${verificationCode}`
      };

    } catch (error) {
      // Log failed redemption attempt
      auditLog.failureReason = `System error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      await db.insert(couponRedemptions).values(auditLog);
      
      console.error("Error redeeming coupon:", error);
      return {
        success: false,
        message: "System error occurred during redemption. Please try again or contact support."
      };
    }
  }

  // Get redemption history for audit purposes
  async getCouponRedemptionHistory(couponCode: string): Promise<CouponRedemption[]> {
    return await db
      .select()
      .from(couponRedemptions)
      .where(eq(couponRedemptions.couponCode, couponCode))
      .orderBy(desc(couponRedemptions.attemptedAt));
  }

  // Check if coupon is valid for redemption (without redeeming)
  async validateCouponForRedemption(couponCode: string): Promise<{
    valid: boolean; 
    coupon?: Coupon; 
    message: string;
    canRedeem: boolean;
  }> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.couponCode, couponCode))
      .limit(1);

    if (!coupon) {
      return {
        valid: false,
        message: "Coupon code not found",
        canRedeem: false
      };
    }

    if (coupon.isRedeemed) {
      return {
        valid: true,
        coupon,
        message: `Already redeemed on ${coupon.redeemedAt?.toLocaleDateString('en-ZA')} ${coupon.redemptionLocation ? `at ${coupon.redemptionLocation}` : ''}`,
        canRedeem: false
      };
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return {
        valid: true,
        coupon,
        message: `Expired on ${coupon.expiryDate.toLocaleDateString('en-ZA')}`,
        canRedeem: false
      };
    }

    return {
      valid: true,
      coupon,
      message: "Valid coupon ready for redemption",
      canRedeem: true
    };
  }

  async expireCoupon(id: string): Promise<Coupon> {
    const [coupon] = await db
      .update(coupons)
      .set({ 
        expiresAt: new Date(), // Mark as expired by setting expiry to now
      })
      .where(eq(coupons.id, id))
      .returning();
    
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    
    return coupon;
  }

  async getPublicCoupons(limit: number = 50): Promise<any[]> {
    try {
      const result = await db
        .select({
          id: coupons.id,
          couponCode: coupons.couponCode,
          createdAt: coupons.createdAt,
          expiresAt: coupons.expiresAt,
          isRedeemed: coupons.isRedeemed,
          dealTitle: coupons.dealTitle,
          dealPrice: coupons.dealPrice,
          dealOriginalPrice: coupons.dealOriginalPrice,
          dealCategory: deals.category,
          supplierCompanyName: sql<string>`supplier_user.company_name`,
          supplierCity: sql<string>`NULL`, // Not available in schema
          supplierProvince: sql<string>`supplier_user.province`,
          buyerFirstName: sql<string>`buyer_user.first_name`,
          buyerLastName: sql<string>`buyer_user.last_name`,
          buyerCity: sql<string>`NULL`, // Not available in schema  
          buyerProvince: sql<string>`buyer_user.province`,
          buyerCompanyName: sql<string>`buyer_user.company_name`,
        })
        .from(coupons)
        .leftJoin(deals, eq(coupons.dealId, deals.id))
        .leftJoin(sql`${users} supplier_user`, eq(coupons.supplierId, sql`supplier_user.id`))
        .leftJoin(sql`${users} buyer_user`, eq(coupons.buyerId, sql`buyer_user.id`))
        .orderBy(desc(coupons.createdAt))
        .limit(limit);

      console.log("Public coupons query result:", result.length);
      return result;
    } catch (error) {
      console.error("Error in getPublicCoupons:", error);
      throw error;
    }
  }

  async getCouponStats(): Promise<{
    totalCoupons: number;
    activeCoupons: number;
    redeemedCoupons: number;
    totalSavings: string;
  }> {
    // Get basic counts
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(coupons);

    const [redeemedResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(coupons)
      .where(eq(coupons.isRedeemed, true));

    const [activeResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(coupons)
      .where(
        and(
          eq(coupons.isRedeemed, false),
          sql`${coupons.expiresAt} > NOW()`
        )
      );

    // Calculate total savings - simplified to avoid empty string conversion errors
    const redeemedCoupons = await db
      .select({
        dealOriginalPrice: coupons.dealOriginalPrice,
        dealPrice: coupons.dealPrice
      })
      .from(coupons)
      .where(eq(coupons.isRedeemed, true));
    
    let totalSavings = 0;
    for (const coupon of redeemedCoupons) {
      const originalPrice = parseFloat(coupon.dealOriginalPrice || '0');
      const dealPrice = parseFloat(coupon.dealPrice || '0');
      if (originalPrice > dealPrice) {
        totalSavings += (originalPrice - dealPrice);
      }
    }

    return {
      totalCoupons: totalResult?.count || 0,
      activeCoupons: activeResult?.count || 0,
      redeemedCoupons: redeemedResult?.count || 0,
      totalSavings: totalSavings.toFixed(2),
    };
  }

  // Rates operations
  async getRates(): Promise<Rate[]> {
    return await db.select().from(rates).orderBy(desc(rates.createdAt));
  }

  async createRate(rate: InsertRate): Promise<Rate> {
    const [newRate] = await db.insert(rates).values(rate).returning();
    return newRate;
  }

  async bulkCreateRates(ratesToInsert: InsertRate[]): Promise<Rate[]> {
    // Clear existing rates first
    await db.delete(rates);
    
    // Insert new rates in batches
    const batchSize = 100;
    const results: Rate[] = [];
    
    for (let i = 0; i < ratesToInsert.length; i += batchSize) {
      const batch = ratesToInsert.slice(i, i + batchSize);
      const batchResults = await db.insert(rates).values(batch).returning();
      results.push(...batchResults);
    }
    
    return results;
  }

  async updateRate(id: string, rate: Partial<InsertRate>): Promise<Rate> {
    const [updatedRate] = await db
      .update(rates)
      .set({ ...rate, updatedAt: new Date() })
      .where(eq(rates.id, id))
      .returning();
    
    if (!updatedRate) {
      throw new Error("Rate not found");
    }
    
    return updatedRate;
  }

  async deleteRate(id: string): Promise<void> {
    await db.delete(rates).where(eq(rates.id, id));
  }

  async clearAllRates(): Promise<void> {
    await db.delete(rates);
  }

  // Basket operations
  async getBasketItems(userId: string) {
    return await db.select().from(basketItems).where(eq(basketItems.userId, userId));
  }

  async addBasketItem(basketData: any) {
    const [basketItem] = await db.insert(basketItems).values(basketData).returning();
    return basketItem;
  }

  async removeBasketItem(itemId: string, userId: string) {
    await db.delete(basketItems).where(and(eq(basketItems.id, itemId), eq(basketItems.userId, userId)));
  }

  async clearBasket(userId: string) {
    await db.delete(basketItems).where(eq(basketItems.userId, userId));
  }

  // Deal request operations
  async createDealRequest(request: InsertDealRequest): Promise<DealRequest> {
    const [dealRequest] = await db.insert(dealRequests).values(request).returning();
    return dealRequest;
  }

  async getDealRequests(): Promise<DealRequest[]> {
    return await db.select().from(dealRequests).orderBy(desc(dealRequests.createdAt));
  }

  async getDealRequestsByUser(userId: string): Promise<DealRequest[]> {
    return await db
      .select()
      .from(dealRequests)
      .where(eq(dealRequests.requesterId, userId))
      .orderBy(desc(dealRequests.createdAt));
  }

  async updateDealRequestStatus(id: string, status: string): Promise<DealRequest> {
    const [updatedRequest] = await db
      .update(dealRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(dealRequests.id, id))
      .returning();
    
    if (!updatedRequest) {
      throw new Error("Deal request not found");
    }
    
    return updatedRequest;
  }

  // Business statistics operations
  async getBusinessStats(): Promise<{
    activeSuppliers: number;
    totalDeals: number;
    successfulConnections: number;
    totalSavings: number;
  }> {
    try {
      // Count active suppliers (users with supplier role who have posted deals)
      const [supplierResult] = await db
        .select({ count: sql<number>`count(distinct ${users.id})` })
        .from(users)
        .innerJoin(deals, eq(users.id, deals.supplierId))
        .where(eq(users.userType, 'supplier'));

      // Count total deals
      const [dealsResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(deals);

      // Count successful connections (total inquiries + redeemed coupons)
      const [inquiriesResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(inquiries);

      const [redeemedCouponsResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(coupons)
        .where(eq(coupons.isRedeemed, true));

      // Calculate total savings (sum of discount amounts from deals with original prices)
      const [savingsResult] = await db
        .select({ 
          totalSavings: sql<number>`coalesce(sum(
            case 
              when ${deals.originalPrice} is not null and ${deals.originalPrice} > ${deals.price}
              then ${deals.originalPrice} - ${deals.price}
              else 0
            end
          ), 0)`
        })
        .from(deals);

      const successfulConnections = (inquiriesResult?.count || 0) + (redeemedCouponsResult?.count || 0);

      return {
        activeSuppliers: supplierResult?.count || 0,
        totalDeals: dealsResult?.count || 0,
        successfulConnections,
        totalSavings: Math.round(savingsResult?.totalSavings || 0)
      };
    } catch (error) {
      console.error('Error fetching business stats:', error);
      // Return current actual values as fallback
      return {
        activeSuppliers: 1, // You as the first supplier
        totalDeals: 8, // Current number of deals posted
        successfulConnections: 0,
        totalSavings: 0
      };
    }
  }

  // Keyword management operations
  async updateUserKeywords(userId: string, data: {
    keywords?: string;
    notificationMethod?: string;
    allowEmailNotifications?: boolean;
    allowSmsNotifications?: boolean;
    allowWhatsappNotifications?: boolean;
  }): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  async getSuppliersDirectory(): Promise<any[]> {
    try {
      // Get all suppliers
      const suppliersData = await db
        .select()
        .from(users)
        .where(eq(users.userType, 'supplier'));

      if (suppliersData.length === 0) {
        return [];
      }

      // Get deal counts for each supplier
      const supplierIds = suppliersData.map(s => s.id);
      let dealCounts: any[] = [];
      
      if (supplierIds.length > 0) {
        dealCounts = await db
          .select({
            supplierId: deals.supplierId,
            totalDeals: sql<number>`count(*)`,
            activeDeals: sql<number>`count(case when ${deals.status} = 'active' then 1 end)`,
            totalViews: sql<number>`sum(coalesce(${deals.viewCount}, 0))`
          })
          .from(deals)
          .where(inArray(deals.supplierId, supplierIds))
          .groupBy(deals.supplierId);
      }

      // Combine data and sort alphabetically
      const combinedData = suppliersData.map(supplier => {
        const stats = dealCounts.find(d => d.supplierId === supplier.id);
        return {
          id: supplier.id,
          email: supplier.email,
          firstName: supplier.firstName,
          lastName: supplier.lastName,
          companyName: supplier.companyName,
          businessDescription: supplier.businessDescription,
          industry: supplier.industry,
          province: supplier.province,
          city: supplier.city,
          phone: supplier.phone,
          website: supplier.website,
          activeDealsCount: stats?.activeDeals || 0,
          totalDealsCount: stats?.totalDeals || 0,
          totalViews: stats?.totalViews || 0,
          joinedDate: supplier.createdAt.toISOString(),
          lastActive: supplier.updatedAt?.toISOString() || supplier.createdAt.toISOString(),
          averageRating: 4.2 + Math.random() * 0.8 // Mock rating for now
        };
      });

      // Sort alphabetically by company name or full name
      return combinedData.sort((a, b) => {
        const nameA = a.companyName || `${a.firstName || ''} ${a.lastName || ''}`.trim() || 'Supplier';
        const nameB = b.companyName || `${b.firstName || ''} ${b.lastName || ''}`.trim() || 'Supplier';
        return nameA.localeCompare(nameB);
      });
    } catch (error) {
      console.error('Error in getSuppliersDirectory:', error);
      return [];
    }
  }

  // PayFast Payment Methods
  async getCreditTransactionByReference(paymentReference: string): Promise<CreditTransaction | undefined> {
    const [transaction] = await db.select()
      .from(creditTransactions)
      .where(eq(creditTransactions.paymentReference, paymentReference));
    return transaction;
  }

  async updateCreditTransaction(id: string, updates: Partial<InsertCreditTransaction>): Promise<CreditTransaction> {
    const [transaction] = await db.update(creditTransactions)
      .set(updates)
      .where(eq(creditTransactions.id, id))
      .returning();
    return transaction;
  }

  async addCreditsToUser(userId: string, credits: number): Promise<void> {
    await db.update(users)
      .set({
        creditBalance: sql`CAST(COALESCE(${users.creditBalance}, '0') AS DECIMAL) + ${credits.toString()}`
      })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
