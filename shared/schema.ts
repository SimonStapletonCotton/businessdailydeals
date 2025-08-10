import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").notNull().default("buyer"), // "buyer" or "supplier"
  
  // Buyer-specific fields
  mobile: varchar("mobile"),
  province: varchar("province"),
  subscribeToNewsletter: boolean("subscribe_to_newsletter").default(false),
  acceptDataOffer: boolean("accept_data_offer").default(false),
  mobileProvider: varchar("mobile_provider"), // "vodacom", "mtn", "telkom"
  
  // Notification preferences for keyword matching
  notificationMethod: varchar("notification_method").default("email"), // "email", "sms", "whatsapp"
  allowEmailNotifications: boolean("allow_email_notifications").default(true),
  allowSmsNotifications: boolean("allow_sms_notifications").default(false),
  allowWhatsappNotifications: boolean("allow_whatsapp_notifications").default(false),
  
  // Supplier-specific fields
  companyName: varchar("company_name"),
  address: text("address"),
  representativeName: varchar("representative_name"),
  numberOfItems: varchar("number_of_items"),
  rrpPerItem: varchar("rrp_per_item"),
  discountPerItem: varchar("discount_per_item"),
  itemDescriptions: text("item_descriptions"),
  dealType: varchar("preferred_deal_type"), // "hot" or "regular"
  regularDealDuration: varchar("regular_deal_duration"), // "7" or "14" days
  
  // Optional verification fields for suppliers
  vatNumber: varchar("vat_number"),
  businessRegistrationNumber: varchar("business_registration_number"),
  isVerified: boolean("is_verified").default(false),
  verifiedAt: timestamp("verified_at"),
  
  // Credits system for advertising
  creditBalance: decimal("credit_balance", { precision: 10, scale: 2 }).default('0.00'),
  totalCreditsSpent: decimal("total_credits_spent", { precision: 10, scale: 2 }).default('0.00'),
  // Stripe payment integration
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  
  // FREE 4-month promotional period for suppliers
  promotionalPeriodEnds: timestamp("promotional_period_ends"),
  isInPromotionalPeriod: boolean("is_in_promotional_period").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dealTypeEnum = pgEnum('deal_type', ['hot', 'regular']);
export const dealStatusEnum = pgEnum('deal_status', ['active', 'expired', 'paused']);

export const deals = pgTable("deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discount: integer("discount"), // percentage
  minOrder: integer("min_order").default(1),
  dealType: dealTypeEnum("deal_type").notNull().default('regular'),
  status: dealStatusEnum("deal_status").notNull().default('active'),
  supplierId: varchar("supplier_id").notNull().references(() => users.id),
  imageUrl: varchar("image_url"),
  // Enhanced product details and images
  productImages: text("product_images").array(),
  size: varchar("size"),
  quantityAvailable: integer("quantity_available"),
  productSpecifications: text("product_specifications"),
  keywords: text("keywords").array(),
  // Analytics and engagement
  viewCount: integer("view_count").default(0),
  clickCount: integer("click_count").default(0),
  // Direct purchasing options
  allowDirectPurchase: boolean("allow_direct_purchase").default(false),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default('0.00'),
  // Credits cost for advertising
  creditsCost: decimal("credits_cost", { precision: 10, scale: 2 }).default('0.00'),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const keywords = pgTable("keywords", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  keyword: varchar("keyword").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  dealId: varchar("deal_id").references(() => deals.id),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id").notNull().references(() => deals.id),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  supplierId: varchar("supplier_id").notNull().references(() => users.id),
  message: text("message"),
  contactInfo: text("contact_info"),
  status: varchar("status").notNull().default("pending"), // pending, responded, closed
  supplierResponse: text("supplier_response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const coupons = pgTable("coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id").notNull().references(() => deals.id),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  supplierId: varchar("supplier_id").notNull().references(() => users.id),
  couponCode: varchar("coupon_code").notNull().unique(),
  dealTitle: varchar("deal_title").notNull(),
  dealPrice: decimal("deal_price", { precision: 10, scale: 2 }).notNull(),
  dealOriginalPrice: decimal("deal_original_price", { precision: 10, scale: 2 }),
  dealDescription: text("deal_description"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }),
  isRedeemed: boolean("is_redeemed").default(false),
  redeemedAt: timestamp("redeemed_at"),
  expiresAt: timestamp("expires_at"),
  validUntil: timestamp("valid_until").notNull(), // Max 30 days from issue
  createdAt: timestamp("created_at").defaultNow(),
});

// Shopping cart/basket system for rates
export const basketItems = pgTable("basket_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  rateType: varchar("rate_type").notNull(), // 'regular' or 'hot'
  duration: integer("duration").notNull(), // days
  quantity: integer("quantity").notNull(), // number of items
  ratePerDay: varchar("rate_per_day").notNull(), // Store as string to avoid precision issues
  totalCost: varchar("total_cost").notNull(), // Store as string to avoid precision issues
  creditsRequired: varchar("credits_required").notNull(), // Store as string to avoid precision issues
  createdAt: timestamp("created_at").defaultNow(),
});

export const rates = pgTable("rates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  product: varchar("product").notNull(),
  category: varchar("category").notNull(),
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }).notNull(),
  weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }).default('0.00'),
  monthlyRate: decimal("monthly_rate", { precision: 10, scale: 2 }).default('0.00'),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Credits and payment transactions
export const creditTransactions = pgTable("credit_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type").notNull(), // "purchase", "spend", "refund"
  description: text("description").notNull(),
  dealId: varchar("deal_id").references(() => deals.id),
  paymentReference: varchar("payment_reference"), // PayFast payment_id 
  merchantReference: varchar("merchant_reference"), // Custom reference for bank reconciliation
  createdAt: timestamp("created_at").defaultNow(),
});

// Direct purchases and orders
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  dealId: varchar("deal_id").notNull().references(() => deals.id),
  quantity: integer("quantity").notNull().default(1),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default('0.00'),
  shippingAddress: text("shipping_address"),
  status: varchar("status").notNull().default("pending"), // "pending", "confirmed", "shipped", "delivered", "cancelled"
  paymentReference: varchar("payment_reference"), // PayFast payment_id
  merchantReference: varchar("merchant_reference"), // Custom reference for bank reconciliation
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Banner advertisements
export const bannerAds = pgTable("banner_ads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  advertiserId: varchar("advertiser_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  imageUrl: varchar("image_url").notNull(),
  clickUrl: varchar("click_url").notNull(),
  position: varchar("position").notNull(), // "top", "sidebar", "bottom", "floating"
  priority: integer("priority").default(0),
  isActive: boolean("is_active").default(true),
  clickCount: integer("click_count").default(0),
  impressionCount: integer("impression_count").default(0),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Site analytics and hit counters
export const siteAnalytics = pgTable("site_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  totalVisits: integer("total_visits").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  dealViews: integer("deal_views").default(0),
  searchQueries: integer("search_queries").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Company directory for alphabetical listing
export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  userId: varchar("user_id").references(() => users.id),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  website: varchar("website"),
  phone: varchar("phone"),
  email: varchar("email"),
  category: varchar("category"),
  totalDeals: integer("total_deals").default(0),
  hotDealsCount: integer("hot_deals_count").default(0),
  regularDealsCount: integer("regular_deals_count").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations for all tables
export const usersRelations = relations(users, ({ many }) => ({
  deals: many(deals),
  keywords: many(keywords),
  notifications: many(notifications),
  inquiries: many(inquiries),
  coupons: many(coupons),
  basketItems: many(basketItems),
  creditTransactions: many(creditTransactions),
  orders: many(orders),
  bannerAds: many(bannerAds),
  companies: many(companies),
  dealRequests: many(dealRequests),
}));

export const basketItemsRelations = relations(basketItems, ({ one }) => ({
  user: one(users, { fields: [basketItems.userId], references: [users.id] }),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  supplier: one(users, { fields: [deals.supplierId], references: [users.id] }),
  notifications: many(notifications),
  inquiries: many(inquiries),
  coupons: many(coupons),
  orders: many(orders),
  creditTransactions: many(creditTransactions),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  deal: one(deals, { fields: [notifications.dealId], references: [deals.id] }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  deal: one(deals, { fields: [inquiries.dealId], references: [deals.id] }),
  buyer: one(users, { fields: [inquiries.buyerId], references: [users.id] }),
  supplier: one(users, { fields: [inquiries.supplierId], references: [users.id] }),
}));

export const couponsRelations = relations(coupons, ({ one }) => ({
  deal: one(deals, { fields: [coupons.dealId], references: [deals.id] }),
  buyer: one(users, { fields: [coupons.buyerId], references: [users.id] }),
  supplier: one(users, { fields: [coupons.supplierId], references: [users.id] }),
}));

export const keywordsRelations = relations(keywords, ({ one }) => ({
  user: one(users, { fields: [keywords.userId], references: [users.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  buyer: one(users, { fields: [orders.buyerId], references: [users.id] }),
  deal: one(deals, { fields: [orders.dealId], references: [deals.id] }),
}));

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, { fields: [creditTransactions.userId], references: [users.id] }),
  deal: one(deals, { fields: [creditTransactions.dealId], references: [deals.id] }),
}));

export const bannerAdsRelations = relations(bannerAds, ({ one }) => ({
  advertiser: one(users, { fields: [bannerAds.advertiserId], references: [users.id] }),
}));

export const companiesRelations = relations(companies, ({ one }) => ({
  user: one(users, { fields: [companies.userId], references: [users.id] }),
}));

// Deal requests table for "Find Me a Deal" functionality
export const dealRequests = pgTable("deal_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterId: varchar("requester_id").notNull().references(() => users.id),
  productName: varchar("product_name").notNull(),
  productSize: varchar("product_size"),
  quantityRequired: integer("quantity_required").notNull(),
  deliveryDestination: varchar("delivery_destination").notNull(),
  priceRangeMin: decimal("price_range_min", { precision: 10, scale: 2 }),
  priceRangeMax: decimal("price_range_max", { precision: 10, scale: 2 }),
  additionalRequirements: text("additional_requirements"),
  status: varchar("status").notNull().default("active"), // active, fulfilled, expired
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dealRequestsRelations = relations(dealRequests, ({ one }) => ({
  requester: one(users, { fields: [dealRequests.requesterId], references: [users.id] }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Deal = typeof deals.$inferSelect;
export type InsertDeal = typeof deals.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;
export type Keyword = typeof keywords.$inferSelect;
export type InsertKeyword = typeof keywords.$inferInsert;
export type Rate = typeof rates.$inferSelect;
export type InsertRate = typeof rates.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;
export type BannerAd = typeof bannerAds.$inferSelect;
export type InsertBannerAd = typeof bannerAds.$inferInsert;
export type BasketItem = typeof basketItems.$inferSelect;
export type InsertBasketItem = typeof basketItems.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;
export type SiteAnalytics = typeof siteAnalytics.$inferSelect;
export type InsertSiteAnalytics = typeof siteAnalytics.$inferInsert;
export type DealRequest = typeof dealRequests.$inferSelect;
export type InsertDealRequest = typeof dealRequests.$inferInsert;

// Extended types for joins
export type DealWithSupplier = Deal & { 
  supplier: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
    email: string | null;
    isVerified: boolean | null;
  }
};

// Insert schemas with Zod validation
export const insertUserSchema = createInsertSchema(users);
export const insertDealSchema = createInsertSchema(deals);
export const insertNotificationSchema = createInsertSchema(notifications);
export const insertInquirySchema = createInsertSchema(inquiries);
export const insertCouponSchema = createInsertSchema(coupons);
export const insertKeywordSchema = createInsertSchema(keywords);
export const insertRateSchema = createInsertSchema(rates);
export const insertOrderSchema = createInsertSchema(orders);
export const insertCreditTransactionSchema = createInsertSchema(creditTransactions);
export const insertBannerAdSchema = createInsertSchema(bannerAds);
export const insertBasketItemSchema = createInsertSchema(basketItems);
export const insertCompanySchema = createInsertSchema(companies);
export const insertDealRequestSchema = createInsertSchema(dealRequests);

// Zod inferred types for inserts
export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertDealType = z.infer<typeof insertDealSchema>;
export type InsertNotificationType = z.infer<typeof insertNotificationSchema>;
export type InsertInquiryType = z.infer<typeof insertInquirySchema>;
export type InsertCouponType = z.infer<typeof insertCouponSchema>;
export type InsertKeywordType = z.infer<typeof insertKeywordSchema>;
export type InsertRateType = z.infer<typeof insertRateSchema>;
export type InsertOrderType = z.infer<typeof insertOrderSchema>;
export type InsertCreditTransactionType = z.infer<typeof insertCreditTransactionSchema>;
export type InsertBannerAdType = z.infer<typeof insertBannerAdSchema>;
export type InsertBasketItemType = z.infer<typeof insertBasketItemSchema>;
export type InsertCompanyType = z.infer<typeof insertCompanySchema>;
export type InsertDealRequestType = z.infer<typeof insertDealRequestSchema>;