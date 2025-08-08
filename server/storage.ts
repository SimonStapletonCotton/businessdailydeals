import {
  users,
  deals,
  keywords,
  notifications,
  inquiries,
  coupons,
  rates,
  type User,
  type UpsertUser,
  type Deal,
  type DealWithSupplier,
  type InsertDeal,
  type Keyword,
  type InsertKeyword,
  type Notification,
  type NotificationWithDeal,
  type InsertNotification,
  type Inquiry,
  type InquiryWithDetails,
  type InsertInquiry,
  type Coupon,
  type InsertCoupon,
  type CouponWithDetails,
  type Rate,
  type InsertRate,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, inArray } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();
