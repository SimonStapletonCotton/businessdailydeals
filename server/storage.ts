import {
  users,
  deals,
  keywords,
  notifications,
  inquiries,
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
}

export const storage = new DatabaseStorage();
