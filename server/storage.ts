import {
  users,
  deals,
  keywords,
  notifications,
  inquiries,
  coupons,
  basketItems,
  rates,
  creditTransactions,
  orders,
  bannerAds,
  companies,
  siteAnalytics,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, inArray, sql } from "drizzle-orm";

// Extended types for joins
export type DealWithSupplier = Deal & { supplier: User };
export type NotificationWithDeal = Notification & { deal?: Deal };
export type InquiryWithDetails = Inquiry & { deal: Deal; buyer: User };
export type CouponWithDetails = Coupon & { deal: Deal; buyer: User };

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserType(id: string, userType: string): Promise<User>;
  
  // Deal operations
  getDeals(dealType?: 'hot' | 'regular'): Promise<DealWithSupplier[]>;
  getDeal(id: string): Promise<DealWithSupplier | undefined>;
  getDealsBySupplier(supplierId: string): Promise<DealWithSupplier[]>;
  getExpiredDealsBySupplier(supplierId: string): Promise<DealWithSupplier[]>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: string, deal: Partial<InsertDeal>): Promise<Deal>;
  reactivateDeal(id: string, newExpiresAt: Date): Promise<Deal>;
  deleteDeal(id: string): Promise<void>;
  searchDeals(query: string, category?: string): Promise<DealWithSupplier[]>;
  
  // Keyword operations
  getUserKeywords(userId: string): Promise<Keyword[]>;
  addKeyword(keyword: InsertKeyword): Promise<Keyword>;
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
  redeemCoupon(couponCode: string, redemptionNotes?: string): Promise<Coupon>;
  expireCoupon(id: string): Promise<Coupon>;
  
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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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
          totalDeals: Math.max(0, company.totalDeals + totalChange),
          hotDealsCount: Math.max(0, company.hotDealsCount + hotChange),
          regularDealsCount: Math.max(0, company.regularDealsCount + regularChange),
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
          updates.totalVisits = existing.totalVisits + 1;
          break;
        case 'unique_visitor':
          updates.uniqueVisitors = existing.uniqueVisitors + 1;
          break;
        case 'deal_view':
          updates.dealViews = existing.dealViews + 1;
          break;
        case 'search_query':
          updates.searchQueries = existing.searchQueries + 1;
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
    let whereCondition = eq(deals.status, 'active');
    
    if (dealType) {
      whereCondition = and(eq(deals.status, 'active'), eq(deals.dealType, dealType))!;
    }

    const result = await db
      .select()
      .from(deals)
      .leftJoin(users, eq(deals.supplierId, users.id))
      .where(whereCondition)
      .orderBy(desc(deals.createdAt));

    return result.map(row => ({
      ...row.deals,
      supplier: row.users!
    }));
  }

  async getDeal(id: string): Promise<DealWithSupplier | undefined> {
    const result = await db
      .select()
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

  async getDealsBySupplier(supplierId: string): Promise<DealWithSupplier[]> {
    const result = await db
      .select()
      .from(deals)
      .leftJoin(users, eq(deals.supplierId, users.id))
      .where(and(eq(deals.supplierId, supplierId), eq(deals.status, 'active')))
      .orderBy(desc(deals.createdAt));

    return result.map(row => ({
      ...row.deals,
      supplier: row.users!
    }));
  }

  async getExpiredDealsBySupplier(supplierId: string): Promise<DealWithSupplier[]> {
    const result = await db
      .select()
      .from(deals)
      .leftJoin(users, eq(deals.supplierId, users.id))
      .where(and(eq(deals.supplierId, supplierId), eq(deals.status, 'expired')))
      .orderBy(desc(deals.createdAt));

    return result.map(row => ({
      ...row.deals,
      supplier: row.users!
    }));
  }

  async createDeal(dealData: InsertDeal): Promise<Deal> {
    const [deal] = await db.insert(deals).values(dealData).returning();
    
    // Create notifications for users with matching keywords
    if (dealData.keywords && dealData.keywords.length > 0) {
      const matchingKeywords = await db
        .select()
        .from(keywords)
        .where(inArray(keywords.keyword, dealData.keywords));

      for (const keyword of matchingKeywords) {
        await this.createNotification({
          userId: keyword.userId,
          dealId: deal.id,
          message: `New deal matching your keyword "${keyword.keyword}": ${dealData.title}`,
        });
      }
    }

    return deal;
  }

  async updateDeal(id: string, dealData: Partial<InsertDeal>): Promise<Deal> {
    const [deal] = await db
      .update(deals)
      .set({ ...dealData, updatedAt: new Date() })
      .where(eq(deals.id, id))
      .returning();
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

  async deleteDeal(id: string): Promise<void> {
    await db.delete(deals).where(eq(deals.id, id));
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
      .select()
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

  async removeKeyword(id: string): Promise<void> {
    await db.delete(keywords).where(eq(keywords.id, id));
  }

  // Notification operations
  async getUserNotifications(userId: string): Promise<NotificationWithDeal[]> {
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
    const [result] = await db
      .select()
      .from(coupons)
      .leftJoin(deals, eq(coupons.dealId, deals.id))
      .leftJoin(users, eq(coupons.buyerId, users.id))
      .where(eq(coupons.couponCode, couponCode));
    
    if (!result) return undefined;

    return {
      ...result.coupons,
      deal: result.deals!,
      buyer: result.users!,
      supplier: {} as User,
    };
  }

  async redeemCoupon(couponCode: string, redemptionNotes?: string): Promise<Coupon> {
    const [coupon] = await db
      .update(coupons)
      .set({ 
        status: "redeemed",
        redeemedAt: new Date(),
        redemptionNotes,
        updatedAt: new Date(),
      })
      .where(eq(coupons.couponCode, couponCode))
      .returning();
    
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    
    return coupon;
  }

  async expireCoupon(id: string): Promise<Coupon> {
    const [coupon] = await db
      .update(coupons)
      .set({ 
        status: "expired",
        updatedAt: new Date(),
      })
      .where(eq(coupons.id, id))
      .returning();
    
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    
    return coupon;
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
}

export const storage = new DatabaseStorage();
