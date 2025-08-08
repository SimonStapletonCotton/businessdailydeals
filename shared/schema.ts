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
  companyName: varchar("company_name"),
  // Credits system for advertising
  creditBalance: decimal("credit_balance", { precision: 10, scale: 2 }).default('0.00'),
  totalCreditsSpent: decimal("total_credits_spent", { precision: 10, scale 2 }).default('0.00'),
  // Stripe payment integration
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
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

// Credits and payment transactions
export const creditTransactions = pgTable("credit_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type").notNull(), // "purchase", "spend", "refund"
  description: text("description").notNull(),
  dealId: varchar("deal_id").references(() => deals.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
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
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
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

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  dealId: varchar("deal_id").notNull().references(() => deals.id),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id").notNull().references(() => deals.id),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  supplierId: varchar("supplier_id").notNull().references(() => users.id),
  message: text("message"),
  status: varchar("status").notNull().default("pending"), // "pending", "responded", "closed"
  createdAt: timestamp("created_at").defaultNow(),
});

export const coupons = pgTable("coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id").notNull().references(() => deals.id),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  supplierId: varchar("supplier_id").notNull().references(() => users.id),
  couponCode: varchar("coupon_code").notNull().unique(),
  status: varchar("status").notNull().default("active"), // "active", "redeemed", "expired"
  downloadedAt: timestamp("downloaded_at").defaultNow(),
  redeemedAt: timestamp("redeemed_at"),
  expiresAt: timestamp("expires_at").notNull(),
  redemptionNotes: text("redemption_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  deals: many(deals),
  keywords: many(keywords),
  notifications: many(notifications),
  inquiriesAsBuyer: many(inquiries, { relationName: "buyer" }),
  inquiriesAsSupplier: many(inquiries, { relationName: "supplier" }),
  couponsAsBuyer: many(coupons, { relationName: "buyer" }),
  couponsAsSupplier: many(coupons, { relationName: "supplier" }),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  supplier: one(users, {
    fields: [deals.supplierId],
    references: [users.id],
  }),
  notifications: many(notifications),
  inquiries: many(inquiries),
  coupons: many(coupons),
}));

export const keywordsRelations = relations(keywords, ({ one }) => ({
  user: one(users, {
    fields: [keywords.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  deal: one(deals, {
    fields: [notifications.dealId],
    references: [deals.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  deal: one(deals, {
    fields: [inquiries.dealId],
    references: [deals.id],
  }),
  buyer: one(users, {
    fields: [inquiries.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
  supplier: one(users, {
    fields: [inquiries.supplierId],
    references: [users.id],
    relationName: "supplier",
  }),
}));

export const couponsRelations = relations(coupons, ({ one }) => ({
  deal: one(deals, {
    fields: [coupons.dealId],
    references: [deals.id],
  }),
  buyer: one(users, {
    fields: [coupons.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
  supplier: one(users, {
    fields: [coupons.supplierId],
    references: [users.id],
    relationName: "supplier",
  }),
}));

// Advertising rates table for product advertising pricing
export const rates = pgTable("rates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  product: varchar("product").notNull(),
  category: varchar("category").notNull(),
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }).notNull(),
  weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }).notNull(),
  monthlyRate: decimal("monthly_rate", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertDealSchema = createInsertSchema(deals)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    price: z.string().min(1, "Price is required"),
    originalPrice: z.string().optional().nullable(),
    keywords: z.array(z.string()).optional().default([]),
    expiresAt: z.date().optional().nullable(),
    productImages: z.array(z.string()).optional().default([]),
    size: z.string().optional(),
    quantityAvailable: z.number().positive().optional(),
    productSpecifications: z.string().optional(),
  });
export const insertKeywordSchema = createInsertSchema(keywords).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true });
export const insertCouponSchema = createInsertSchema(coupons).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRateSchema = createInsertSchema(rates).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;
export type DealWithSupplier = Deal & { supplier: User };
export type InsertKeyword = z.infer<typeof insertKeywordSchema>;
export type Keyword = typeof keywords.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type NotificationWithDeal = Notification & { deal: Deal };
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InquiryWithDetails = Inquiry & { deal: Deal; buyer: User; supplier: User };
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;
export type CouponWithDetails = Coupon & { deal: Deal; buyer: User; supplier: User };
export type InsertRate = z.infer<typeof insertRateSchema>;
export type Rate = typeof rates.$inferSelect;
