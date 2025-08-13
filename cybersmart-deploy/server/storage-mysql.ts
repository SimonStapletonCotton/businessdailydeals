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
} from "@shared/schema.mysql";
import { db } from "./db-mysql";
import { eq, desc, and, or, like, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserCreditBalance(userId: string, newBalance: string): Promise<User>;

  // Deal operations
  getDeals(): Promise<Deal[]>;
  getDealById(id: string): Promise<Deal | undefined>;
  getHotDeals(): Promise<Deal[]>;
  getRegularDeals(): Promise<Deal[]>;
  getDealsBySupplier(supplierId: string): Promise<Deal[]>;
  getDealsByCategory(category: string): Promise<Deal[]>;
  createDeal(deal: Omit<Deal, "id" | "createdAt" | "updatedAt">): Promise<Deal>;
  updateDeal(id: string, updates: Partial<Deal>): Promise<Deal>;
  deleteDeal(id: string): Promise<void>;
  searchDeals(query: string): Promise<Deal[]>;
  
  // Keyword operations
  getKeywordsByUser(userId: string): Promise<Keyword[]>;
  createKeyword(keyword: Omit<Keyword, "id" | "createdAt">): Promise<Keyword>;
  deleteKeyword(id: string): Promise<void>;
  
  // Notification operations
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: Omit<Notification, "id" | "createdAt">): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // Inquiry operations
  getInquiriesByDeal(dealId: string): Promise<Inquiry[]>;
  getInquiriesByBuyer(buyerId: string): Promise<Inquiry[]>;
  getInquiriesBySupplier(supplierId: string): Promise<Inquiry[]>;
  createInquiry(inquiry: Omit<Inquiry, "id" | "createdAt" | "updatedAt">): Promise<Inquiry>;
  updateInquiry(id: string, updates: Partial<Inquiry>): Promise<Inquiry>;
  
  // Coupon operations
  getCouponsByBuyer(buyerId: string): Promise<Coupon[]>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: Omit<Coupon, "id" | "createdAt">): Promise<Coupon>;
  redeemCoupon(id: string): Promise<Coupon>;
  
  // Rate operations
  getRates(): Promise<Rate[]>;
  getRateById(id: string): Promise<Rate | undefined>;
  createRate(rate: Omit<Rate, "id" | "createdAt">): Promise<Rate>;
  
  // Credit operations
  getCreditTransactionsByUser(userId: string): Promise<CreditTransaction[]>;
  createCreditTransaction(transaction: Omit<CreditTransaction, "id" | "createdAt">): Promise<CreditTransaction>;
  
  // Order operations
  getOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(order: Omit<Order, "id" | "createdAt">): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;
  
  // Banner ad operations
  getBannerAds(): Promise<BannerAd[]>;
  createBannerAd(ad: Omit<BannerAd, "id" | "createdAt" | "updatedAt">): Promise<BannerAd>;
  
  // Company operations
  getCompanies(): Promise<Company[]>;
  getCompaniesByProvince(province: string): Promise<Company[]>;
  createCompany(company: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company>;
  
  // Analytics operations
  getSiteAnalytics(): Promise<SiteAnalytics[]>;
  createSiteAnalytics(analytics: Omit<SiteAnalytics, "id" | "createdAt">): Promise<SiteAnalytics>;
  
  // Deal request operations
  getDealRequests(): Promise<DealRequest[]>;
  getDealRequestsByBuyer(buyerId: string): Promise<DealRequest[]>;
  createDealRequest(request: Omit<DealRequest, "id" | "createdAt" | "updatedAt">): Promise<DealRequest>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const id = nanoid();
    const [newUser] = await db
      .insert(users)
      .values({
        id,
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserCreditBalance(userId: string, newBalance: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ creditBalance: newBalance, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async getDeals(): Promise<Deal[]> {
    return await db.select().from(deals).orderBy(desc(deals.createdAt));
  }

  async getDealById(id: string): Promise<Deal | undefined> {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    return deal || undefined;
  }

  async getHotDeals(): Promise<Deal[]> {
    return await db.select().from(deals)
      .where(and(eq(deals.dealType, "hot"), eq(deals.status, "active")))
      .orderBy(desc(deals.createdAt));
  }

  async getRegularDeals(): Promise<Deal[]> {
    return await db.select().from(deals)
      .where(and(eq(deals.dealType, "regular"), eq(deals.status, "active")))
      .orderBy(desc(deals.createdAt));
  }

  async getDealsBySupplier(supplierId: string): Promise<Deal[]> {
    return await db.select().from(deals)
      .where(eq(deals.supplierId, supplierId))
      .orderBy(desc(deals.createdAt));
  }

  async getDealsByCategory(category: string): Promise<Deal[]> {
    return await db.select().from(deals)
      .where(and(eq(deals.category, category), eq(deals.status, "active")))
      .orderBy(desc(deals.createdAt));
  }

  async createDeal(deal: Omit<Deal, "id" | "createdAt" | "updatedAt">): Promise<Deal> {
    const id = nanoid();
    const [newDeal] = await db
      .insert(deals)
      .values({
        id,
        ...deal,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newDeal;
  }

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
    const [updatedDeal] = await db
      .update(deals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(deals.id, id))
      .returning();
    return updatedDeal;
  }

  async deleteDeal(id: string): Promise<void> {
    await db.delete(deals).where(eq(deals.id, id));
  }

  async searchDeals(query: string): Promise<Deal[]> {
    return await db.select().from(deals)
      .where(
        and(
          eq(deals.status, "active"),
          or(
            like(deals.title, `%${query}%`),
            like(deals.description, `%${query}%`),
            like(deals.category, `%${query}%`)
          )
        )
      )
      .orderBy(desc(deals.createdAt));
  }

  async getKeywordsByUser(userId: string): Promise<Keyword[]> {
    return await db.select().from(keywords).where(eq(keywords.userId, userId));
  }

  async createKeyword(keyword: Omit<Keyword, "id" | "createdAt">): Promise<Keyword> {
    const id = nanoid();
    const [newKeyword] = await db
      .insert(keywords)
      .values({
        id,
        ...keyword,
        createdAt: new Date(),
      })
      .returning();
    return newKeyword;
  }

  async deleteKeyword(id: string): Promise<void> {
    await db.delete(keywords).where(eq(keywords.id, id));
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
    const id = nanoid();
    const [newNotification] = await db
      .insert(notifications)
      .values({
        id,
        ...notification,
        createdAt: new Date(),
      })
      .returning();
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  async getInquiriesByDeal(dealId: string): Promise<Inquiry[]> {
    return await db.select().from(inquiries).where(eq(inquiries.dealId, dealId));
  }

  async getInquiriesByBuyer(buyerId: string): Promise<Inquiry[]> {
    return await db.select().from(inquiries).where(eq(inquiries.buyerId, buyerId));
  }

  async getInquiriesBySupplier(supplierId: string): Promise<Inquiry[]> {
    return await db.select().from(inquiries).where(eq(inquiries.supplierId, supplierId));
  }

  async createInquiry(inquiry: Omit<Inquiry, "id" | "createdAt" | "updatedAt">): Promise<Inquiry> {
    const id = nanoid();
    const [newInquiry] = await db
      .insert(inquiries)
      .values({
        id,
        ...inquiry,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newInquiry;
  }

  async updateInquiry(id: string, updates: Partial<Inquiry>): Promise<Inquiry> {
    const [updatedInquiry] = await db
      .update(inquiries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(inquiries.id, id))
      .returning();
    return updatedInquiry;
  }

  async getCouponsByBuyer(buyerId: string): Promise<Coupon[]> {
    return await db.select().from(coupons).where(eq(coupons.buyerId, buyerId));
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.couponCode, code));
    return coupon || undefined;
  }

  async createCoupon(coupon: Omit<Coupon, "id" | "createdAt">): Promise<Coupon> {
    const id = nanoid();
    const [newCoupon] = await db
      .insert(coupons)
      .values({
        id,
        ...coupon,
        createdAt: new Date(),
      })
      .returning();
    return newCoupon;
  }

  async redeemCoupon(id: string): Promise<Coupon> {
    const [redeemedCoupon] = await db
      .update(coupons)
      .set({ isRedeemed: true, redeemedAt: new Date() })
      .where(eq(coupons.id, id))
      .returning();
    return redeemedCoupon;
  }

  async getRates(): Promise<Rate[]> {
    return await db.select().from(rates).where(eq(rates.isActive, true));
  }

  async getRateById(id: string): Promise<Rate | undefined> {
    const [rate] = await db.select().from(rates).where(eq(rates.id, id));
    return rate || undefined;
  }

  async createRate(rate: Omit<Rate, "id" | "createdAt">): Promise<Rate> {
    const id = nanoid();
    const [newRate] = await db
      .insert(rates)
      .values({
        id,
        ...rate,
        createdAt: new Date(),
      })
      .returning();
    return newRate;
  }

  async getCreditTransactionsByUser(userId: string): Promise<CreditTransaction[]> {
    return await db.select().from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt));
  }

  async createCreditTransaction(transaction: Omit<CreditTransaction, "id" | "createdAt">): Promise<CreditTransaction> {
    const id = nanoid();
    const [newTransaction] = await db
      .insert(creditTransactions)
      .values({
        id,
        ...transaction,
        createdAt: new Date(),
      })
      .returning();
    return newTransaction;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async createOrder(order: Omit<Order, "id" | "createdAt">): Promise<Order> {
    const id = nanoid();
    const [newOrder] = await db
      .insert(orders)
      .values({
        id,
        ...order,
        createdAt: new Date(),
      })
      .returning();
    return newOrder;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ ...updates })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getBannerAds(): Promise<BannerAd[]> {
    return await db.select().from(bannerAds)
      .where(eq(bannerAds.isActive, true))
      .orderBy(bannerAds.position);
  }

  async createBannerAd(ad: Omit<BannerAd, "id" | "createdAt" | "updatedAt">): Promise<BannerAd> {
    const id = nanoid();
    const [newAd] = await db
      .insert(bannerAds)
      .values({
        id,
        ...ad,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newAd;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies).orderBy(companies.name);
  }

  async getCompaniesByProvince(province: string): Promise<Company[]> {
    return await db.select().from(companies)
      .where(eq(companies.province, province))
      .orderBy(companies.name);
  }

  async createCompany(company: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company> {
    const id = nanoid();
    const [newCompany] = await db
      .insert(companies)
      .values({
        id,
        ...company,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newCompany;
  }

  async getSiteAnalytics(): Promise<SiteAnalytics[]> {
    return await db.select().from(siteAnalytics).orderBy(desc(siteAnalytics.date));
  }

  async createSiteAnalytics(analytics: Omit<SiteAnalytics, "id" | "createdAt">): Promise<SiteAnalytics> {
    const id = nanoid();
    const [newAnalytics] = await db
      .insert(siteAnalytics)
      .values({
        id,
        ...analytics,
        createdAt: new Date(),
      })
      .returning();
    return newAnalytics;
  }

  async getDealRequests(): Promise<DealRequest[]> {
    return await db.select().from(dealRequests).orderBy(desc(dealRequests.createdAt));
  }

  async getDealRequestsByBuyer(buyerId: string): Promise<DealRequest[]> {
    return await db.select().from(dealRequests)
      .where(eq(dealRequests.buyerId, buyerId))
      .orderBy(desc(dealRequests.createdAt));
  }

  async createDealRequest(request: Omit<DealRequest, "id" | "createdAt" | "updatedAt">): Promise<DealRequest> {
    const id = nanoid();
    const [newRequest] = await db
      .insert(dealRequests)
      .values({
        id,
        ...request,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newRequest;
  }
}

export const storage = new DatabaseStorage();