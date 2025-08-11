import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  decimal, 
  integer, 
  boolean, 
  jsonb, 
  varchar,
  serial
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - supports both buyers and suppliers
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  userType: text("user_type").notNull(), // 'buyer' or 'supplier'
  mobile: text("mobile"),
  province: text("province"),
  
  // Buyer specific fields
  companyName: text("company_name"),
  representativeName: text("representative_name"),
  keywordsForNotifications: jsonb("keywords_for_notifications").$type<string[]>(),
  emailNotifications: boolean("allow_email_notifications").default(true),
  smsNotifications: boolean("allow_sms_notifications").default(false),
  whatsappNotifications: boolean("allow_whatsapp_notifications").default(false),
  
  // Supplier specific fields  
  address: text("address"),
  vatNumber: text("vat_number"),
  businessRegistrationNumber: text("business_registration_number"),
  isVerified: boolean("is_verified").default(false),
  verifiedAt: timestamp("verified_at"),
  
  // Additional supplier fields from database
  numberOfItems: integer("number_of_items"),
  itemDescriptions: text("item_descriptions"),
  rrpPerItem: decimal("rrp_per_item", { precision: 10, scale: 2 }),
  discountPerItem: decimal("discount_per_item", { precision: 5, scale: 2 }),
  regularDealDuration: integer("regular_deal_duration"),
  preferredDealType: text("preferred_deal_type"),
  isInPromotionalPeriod: boolean("is_in_promotional_period").default(true),
  promotionalPeriodEnds: timestamp("promotional_period_ends"),
  subscribeToNewsletter: boolean("subscribe_to_newsletter").default(false),
  acceptDataOffer: boolean("accept_data_offer").default(false),
  mobileProvider: text("mobile_provider"),
  notificationMethod: text("notification_method"),
  totalCreditsSpent: decimal("total_credits_spent", { precision: 10, scale: 2 }).default("0.00"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  
  // Credits system
  creditBalance: decimal("credit_balance", { precision: 10, scale: 2 }).default("0.00"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Deals table
export const deals = pgTable("deals", {
  id: text("id").primaryKey(),
  supplierId: text("supplier_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  dealType: text("deal_type").notNull().default("regular"), // 'hot' or 'regular'
  category: text("category").notNull(),
  keywords: jsonb("keywords").$type<string[]>(),
  imageUrl: text("image_url"),
  expiryDate: timestamp("expires_at"),
  status: text("deal_status").notNull().default("active"), // 'active', 'expired', 'draft'
  viewCount: integer("view_count").default(0),
  inquiryCount: integer("click_count").default(0),
  creditsCost: decimal("credits_cost", { precision: 5, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Keywords table for buyer notifications
export const keywords = pgTable("keywords", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  keyword: text("keyword").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  dealId: text("deal_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  notificationType: text("notification_type").notNull(), // 'keyword_match', 'deal_inquiry', etc.
  createdAt: timestamp("created_at").defaultNow()
});

// Inquiries table for buyer-supplier communication
export const inquiries = pgTable("inquiries", {
  id: text("id").primaryKey(),
  dealId: text("deal_id").notNull(),
  buyerId: text("buyer_id").notNull(),
  supplierId: text("supplier_id").notNull(),
  message: text("message").notNull(),
  buyerContact: text("buyer_contact"),
  status: text("status").notNull().default("pending"), // 'pending', 'responded', 'closed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Coupons table for deal purchases
export const coupons = pgTable("coupons", {
  id: text("id").primaryKey(),
  dealId: text("deal_id").notNull(),
  buyerId: text("buyer_id").notNull(),
  couponCode: text("coupon_code").notNull().unique(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  isRedeemed: boolean("is_redeemed").default(false),
  redeemedAt: timestamp("redeemed_at"),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow()
});

// Shopping basket for rates/advertising
export const basketItems = pgTable("basket_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  rateId: text("rate_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow()
});

// Rates table for advertising options
export const rates = pgTable("rates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  credits: integer("credits").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Credit transactions for payment tracking
export const creditTransactions = pgTable("credit_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dealId: text("deal_id"),
  transactionType: text("type").notNull(), // 'purchase', 'spend', 'refund'
  description: text("description"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow()
});

// Orders table for purchases
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  buyerId: text("buyer_id").notNull(),
  sellerId: text("seller_id").notNull(),
  dealId: text("deal_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  deliveryCost: decimal("delivery_cost", { precision: 10, scale: 2 }),
  deliveryAddress: text("delivery_address"),
  orderStatus: text("order_status").notNull().default("pending"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  paymentReference: text("payment_reference"),
  orderItems: jsonb("order_items").$type<Array<{rateId: string, quantity: number, price: string, credits: number}>>(),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Banner advertisements
export const bannerAds = pgTable("banner_ads", {
  id: text("id").primaryKey(),
  advertiserId: text("advertiser_id").notNull(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  position: integer("position").default(1),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

// Companies table for directory
export const companies = pgTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  industry: text("industry"),
  province: text("province"),
  city: text("city"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  logoUrl: text("logo_url"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Site analytics table
export const siteAnalytics = pgTable("site_analytics", {
  id: text("id").primaryKey(),
  date: timestamp("date").notNull(),
  pageViews: integer("page_views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  dealViews: integer("deal_views").default(0),
  inquiries: integer("inquiries").default(0),
  registrations: integer("registrations").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

// Deal requests table for "Find Me a Deal"
export const dealRequests = pgTable("deal_requests", {
  id: text("id").primaryKey(),
  buyerId: text("buyer_id").notNull(),
  productName: text("product_name").notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity"),
  budgetRange: text("budget_range"),
  preferredBrands: text("preferred_brands"),
  deliveryProvince: text("delivery_province").notNull(),
  urgency: text("urgency").notNull(),
  contactMethod: text("contact_method").notNull(),
  additionalInfo: text("additional_info"),
  status: text("status").notNull().default("active"), // 'active', 'fulfilled', 'expired'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  deals: many(deals),
  keywords: many(keywords),
  notifications: many(notifications),
  inquiriesAsBuyer: many(inquiries, { relationName: "buyer" }),
  inquiriesAsSupplier: many(inquiries, { relationName: "supplier" }),
  coupons: many(coupons),
  basketItems: many(basketItems),
  creditTransactions: many(creditTransactions),
  orders: many(orders),
  dealRequests: many(dealRequests)
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  supplier: one(users, {
    fields: [deals.supplierId],
    references: [users.id]
  }),
  keywords: many(keywords),
  notifications: many(notifications),
  inquiries: many(inquiries),
  coupons: many(coupons)
}));

export const keywordsRelations = relations(keywords, ({ one }) => ({
  user: one(users, {
    fields: [keywords.userId],
    references: [users.id]
  })
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  }),
  deal: one(deals, {
    fields: [notifications.dealId],
    references: [deals.id]
  })
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  deal: one(deals, {
    fields: [inquiries.dealId],
    references: [deals.id]
  }),
  buyer: one(users, {
    fields: [inquiries.buyerId],
    references: [users.id],
    relationName: "buyer"
  }),
  supplier: one(users, {
    fields: [inquiries.supplierId],
    references: [users.id],
    relationName: "supplier"
  })
}));

export const couponsRelations = relations(coupons, ({ one }) => ({
  deal: one(deals, {
    fields: [coupons.dealId],
    references: [deals.id]
  }),
  buyer: one(users, {
    fields: [coupons.buyerId],
    references: [users.id]
  })
}));

export const basketItemsRelations = relations(basketItems, ({ one }) => ({
  user: one(users, {
    fields: [basketItems.userId],
    references: [users.id]
  }),
  rate: one(rates, {
    fields: [basketItems.rateId],
    references: [rates.id]
  })
}));

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, {
    fields: [creditTransactions.userId],
    references: [users.id]
  })
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  buyer: one(users, {
    fields: [orders.buyerId],
    references: [users.id],
    relationName: "buyer"
  }),
  seller: one(users, {
    fields: [orders.sellerId],
    references: [users.id],
    relationName: "seller"
  }),
  deal: one(deals, {
    fields: [orders.dealId],
    references: [deals.id]
  })
}));

export const dealRequestsRelations = relations(dealRequests, ({ one }) => ({
  buyer: one(users, {
    fields: [dealRequests.buyerId],
    references: [users.id]
  })
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertDealSchema = createInsertSchema(deals);
export const insertKeywordSchema = createInsertSchema(keywords);
export const insertNotificationSchema = createInsertSchema(notifications);
export const insertInquirySchema = createInsertSchema(inquiries);
export const insertCouponSchema = createInsertSchema(coupons);
export const insertBasketItemSchema = createInsertSchema(basketItems);
export const insertRateSchema = createInsertSchema(rates);
export const insertCreditTransactionSchema = createInsertSchema(creditTransactions);
export const insertOrderSchema = createInsertSchema(orders);
export const insertBannerAdSchema = createInsertSchema(bannerAds);
export const insertCompanySchema = createInsertSchema(companies);
export const insertSiteAnalyticsSchema = createInsertSchema(siteAnalytics);
export const insertDealRequestSchema = createInsertSchema(dealRequests);

// Update schemas
export const upsertUserSchema = insertUserSchema.partial().extend({
  id: z.string()
});

// Select schemas  
export const selectUserSchema = createSelectSchema(users);
export const selectDealSchema = createSelectSchema(deals);
export const selectKeywordSchema = createSelectSchema(keywords);
export const selectNotificationSchema = createSelectSchema(notifications);
export const selectInquirySchema = createSelectSchema(inquiries);
export const selectCouponSchema = createSelectSchema(coupons);
export const selectBasketItemSchema = createSelectSchema(basketItems);
export const selectRateSchema = createSelectSchema(rates);
export const selectCreditTransactionSchema = createSelectSchema(creditTransactions);
export const selectOrderSchema = createSelectSchema(orders);
export const selectBannerAdSchema = createSelectSchema(bannerAds);
export const selectCompanySchema = createSelectSchema(companies);
export const selectSiteAnalyticsSchema = createSelectSchema(siteAnalytics);
export const selectDealRequestSchema = createSelectSchema(dealRequests);

// Type exports
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Keyword = typeof keywords.$inferSelect;
export type InsertKeyword = z.infer<typeof insertKeywordSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type BasketItem = typeof basketItems.$inferSelect;
export type InsertBasketItem = z.infer<typeof insertBasketItemSchema>;
export type Rate = typeof rates.$inferSelect;
export type InsertRate = z.infer<typeof insertRateSchema>;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type BannerAd = typeof bannerAds.$inferSelect;
export type InsertBannerAd = z.infer<typeof insertBannerAdSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type SiteAnalytics = typeof siteAnalytics.$inferSelect;
export type InsertSiteAnalytics = z.infer<typeof insertSiteAnalyticsSchema>;
export type DealRequest = typeof dealRequests.$inferSelect;
export type InsertDealRequest = z.infer<typeof insertDealRequestSchema>;

// Complex types
export type DealWithSupplier = Deal & { supplier: User };
export type InquiryWithDetails = Inquiry & { 
  deal: Deal; 
  buyer: User; 
  supplier: User; 
};
export type NotificationWithDeal = Notification & { deal: Deal };