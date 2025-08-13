import { 
  users, 
  deals, 
  keywords, 
  notifications, 
  inquiries, 
  creditTransactions, 
  dealRequests, 
  siteAnalytics,
  type User, 
  type InsertUser, 
  type Deal, 
  type InsertDeal,
  type DealWithSupplier,
  type Keyword,
  type InsertKeyword,
  type Notification,
  type InsertNotification,
  type Inquiry,
  type InsertInquiry,
  type InquiryWithDetails,
  type CreditTransaction,
  type InsertCreditTransaction,
  type DealRequest,
  type InsertDealRequest,
  type SiteAnalytics
} from "../shared/schema.mysql";
import { db } from "./db.mysql";
import { eq, and, desc, asc, gte, lte, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export class MySQLDatabaseStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = nanoid();
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, id })
      .$returningId();
    
    return this.getUser(user.id)!;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    await db.update(users).set(updates).where(eq(users.id, id));
    return this.getUser(id)!;
  }

  async updateUserCreditBalance(userId: string, newBalance: number): Promise<User> {
    await db.update(users)
      .set({ creditBalance: newBalance.toFixed(2) })
      .where(eq(users.id, userId));
    return this.getUser(userId)!;
  }

  // Deal operations
  async getDeals(dealType?: 'hot' | 'regular'): Promise<DealWithSupplier[]> {
    let query = db
      .select()
      .from(deals)
      .leftJoin(users, eq(deals.supplierId, users.id))
      .where(eq(deals.status, 'active'));

    if (dealType) {
      query = query.where(and(eq(deals.status, 'active'), eq(deals.dealType, dealType))!);
    }

    const result = await query.orderBy(desc(deals.createdAt));

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

  async getDealById(id: string): Promise<Deal | undefined> {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    return deal || undefined;
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
    const id = nanoid();
    const creditsCost = this.calculateDealCredits(dealData.dealType || 'regular');
    const dealWithCredits = { 
      ...dealData, 
      id,
      creditsCost: creditsCost.toFixed(2) 
    };

    const [deal] = await db.insert(deals).values(dealWithCredits).$returningId();
    
    // Charge credits to supplier
    if (creditsCost > 0 && dealData.supplierId) {
      await this.chargeDealCredits(dealData.supplierId, creditsCost, id, dealData.dealType || 'regular');
    }
    
    // Create notifications for matching keywords
    if (dealData.keywords && dealData.keywords.length > 0) {
      const matchingKeywords = await db
        .select()
        .from(keywords)
        .where(inArray(keywords.keyword, dealData.keywords));

      for (const keyword of matchingKeywords) {
        await this.createNotification({
          userId: keyword.userId,
          dealId: id,
          title: 'New Deal Alert',
          message: `A new deal matching your keyword "${keyword.keyword}" has been posted: ${dealData.title}`
        });
      }
    }
    
    return this.getDealById(id)!;
  }

  async updateDeal(id: string, updates: Partial<InsertDeal>): Promise<Deal> {
    await db.update(deals).set(updates).where(eq(deals.id, id));
    return this.getDealById(id)!;
  }

  async incrementDealViewCount(dealId: string): Promise<Deal> {
    await db.update(deals)
      .set({ viewCount: sql`${deals.viewCount} + 1` })
      .where(eq(deals.id, dealId));
    return this.getDealById(dealId)!;
  }

  async incrementDealInquiryCount(dealId: string): Promise<Deal> {
    await db.update(deals)
      .set({ inquiryCount: sql`${deals.inquiryCount} + 1` })
      .where(eq(deals.id, dealId));
    return this.getDealById(dealId)!;
  }

  async reactivateDeal(dealId: string): Promise<Deal> {
    // Update deal status and extend expiry date
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 30); // 30 days from now

    await db.update(deals)
      .set({ 
        status: 'active',
        expiryDate: newExpiryDate
      })
      .where(eq(deals.id, dealId));
      
    return this.getDealById(dealId)!;
  }

  // Credit system operations
  calculateDealCredits(dealType: 'hot' | 'regular'): number {
    // During promotional period (until Jan 1, 2026), all deals are free
    const promotionalEndDate = new Date('2026-01-01');
    const currentDate = new Date();
    
    if (currentDate < promotionalEndDate) {
      return 0; // Free during promotional period
    }
    
    // After promotional period
    return dealType === 'hot' ? 10 : 2; // Hot deals: 10 credits, Regular: 2 credits
  }

  async chargeDealCredits(userId: string, credits: number, dealId: string, dealType: 'hot' | 'regular'): Promise<void> {
    // Get current user balance
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    const currentBalance = parseFloat(user.creditBalance || '0');
    const newBalance = currentBalance - credits;

    if (newBalance < 0) {
      throw new Error('Insufficient credits');
    }

    // Update user balance
    await this.updateUserCreditBalance(userId, newBalance);

    // Record transaction
    await this.createCreditTransaction({
      userId,
      amount: (-credits).toFixed(2),
      type: 'charge',
      description: `Deal posting: ${dealType} deal`,
      dealId,
      dealType
    });
  }

  async createCreditTransaction(transactionData: InsertCreditTransaction): Promise<CreditTransaction> {
    const id = nanoid();
    const [transaction] = await db
      .insert(creditTransactions)
      .values({ ...transactionData, id })
      .$returningId();
    
    const [result] = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.id, transaction.id));
    
    return result;
  }

  async getCreditTransactions(userId: string): Promise<CreditTransaction[]> {
    return await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt));
  }

  // Keyword operations
  async createKeyword(keywordData: InsertKeyword): Promise<Keyword> {
    const id = nanoid();
    const [keyword] = await db
      .insert(keywords)
      .values({ ...keywordData, id })
      .$returningId();
    
    const [result] = await db
      .select()
      .from(keywords)
      .where(eq(keywords.id, keyword.id));
    
    return result;
  }

  async getKeywordsByUser(userId: string): Promise<Keyword[]> {
    return await db
      .select()
      .from(keywords)
      .where(eq(keywords.userId, userId))
      .orderBy(asc(keywords.keyword));
  }

  async deleteKeyword(id: string): Promise<void> {
    await db.delete(keywords).where(eq(keywords.id, id));
  }

  // Notification operations
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const id = nanoid();
    const [notification] = await db
      .insert(notifications)
      .values({ ...notificationData, id })
      .$returningId();
    
    const [result] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, notification.id));
    
    return result;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Inquiry operations
  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const id = nanoid();
    const [inquiry] = await db
      .insert(inquiries)
      .values({ ...inquiryData, id })
      .$returningId();
    
    // Increment deal inquiry count
    await this.incrementDealInquiryCount(inquiryData.dealId);
    
    const [result] = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, inquiry.id));
    
    return result;
  }

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

  // Deal request operations
  async createDealRequest(requestData: InsertDealRequest): Promise<DealRequest> {
    const id = nanoid();
    const [request] = await db
      .insert(dealRequests)
      .values({ ...requestData, id })
      .$returningId();
    
    const [result] = await db
      .select()
      .from(dealRequests)
      .where(eq(dealRequests.id, request.id));
    
    return result;
  }

  async getDealRequests(): Promise<DealRequest[]> {
    return await db
      .select()
      .from(dealRequests)
      .orderBy(desc(dealRequests.createdAt));
  }

  // Analytics operations
  async recordSiteAnalytics(date: string, type: 'visit' | 'unique_visitor' | 'deal_view' | 'search_query'): Promise<void> {
    const [existing] = await db.select().from(siteAnalytics).where(eq(siteAnalytics.date, date));
    
    if (existing) {
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
      const id = nanoid();
      const newRecord: any = {
        id,
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
          gte(siteAnalytics.date, startDate),
          lte(siteAnalytics.date, endDate)
        )
      );
    } else if (startDate) {
      query = query.where(gte(siteAnalytics.date, startDate));
    } else if (endDate) {
      query = query.where(lte(siteAnalytics.date, endDate));
    }
    
    return await query.orderBy(desc(siteAnalytics.date));
  }

  // Search operations
  async searchDeals(query: string, category?: string, dealType?: 'hot' | 'regular'): Promise<DealWithSupplier[]> {
    let whereConditions = [eq(deals.status, 'active')];
    
    if (dealType) {
      whereConditions.push(eq(deals.dealType, dealType));
    }
    
    if (category && category !== 'All Categories') {
      whereConditions.push(eq(deals.category, category));
    }

    let sqlQuery = db
      .select()
      .from(deals)
      .leftJoin(users, eq(deals.supplierId, users.id))
      .where(and(...whereConditions));

    if (query.trim()) {
      sqlQuery = sqlQuery.where(
        sql`(${deals.title} LIKE ${'%' + query + '%'} 
             OR ${deals.description} LIKE ${'%' + query + '%'}
             OR ${deals.keywords} LIKE ${'%' + query + '%'})`
      );
    }

    const result = await sqlQuery.orderBy(desc(deals.createdAt));

    return result.map(row => ({
      ...row.deals,
      supplier: row.users!
    }));
  }
}

export const storage = new MySQLDatabaseStorage();