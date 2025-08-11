import { sql } from "drizzle-orm";
import { 
  mysqlTable, 
  text, 
  timestamp, 
  decimal, 
  int, 
  boolean, 
  json, 
  varchar,
  char
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - MySQL version
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: text("profile_image_url"),
  userType: varchar("user_type", { length: 20 }).notNull(), // 'buyer' or 'supplier'
  mobile: varchar("mobile", { length: 20 }),
  province: varchar("province", { length: 50 }),
  
  // Buyer specific fields
  companyName: varchar("company_name", { length: 255 }),
  representativeName: varchar("representative_name", { length: 100 }),
  emailNotifications: boolean("allow_email_notifications").default(true),
  smsNotifications: boolean("allow_sms_notifications").default(false),
  whatsappNotifications: boolean("allow_whatsapp_notifications").default(false),
  
  // Supplier specific fields  
  address: text("address"),
  vatNumber: varchar("vat_number", { length: 50 }),
  businessRegistrationNumber: varchar("business_registration_number", { length: 50 }),
  isVerified: boolean("is_verified").default(false),
  verifiedAt: timestamp("verified_at"),
  
  // Additional supplier fields
  numberOfItems: int("number_of_items"),
  itemDescriptions: text("item_descriptions"),
  rrpPerItem: decimal("rrp_per_item", { precision: 10, scale: 2 }),
  discountPerItem: decimal("discount_per_item", { precision: 5, scale: 2 }),
  regularDealDuration: int("regular_deal_duration"),
  preferredDealType: varchar("preferred_deal_type", { length: 20 }),
  isInPromotionalPeriod: boolean("is_in_promotional_period").default(true),
  promotionalPeriodEnds: timestamp("promotional_period_ends"),
  subscribeToNewsletter: boolean("subscribe_to_newsletter").default(false),
  acceptDataOffer: boolean("accept_data_offer").default(false),
  mobileProvider: varchar("mobile_provider", { length: 50 }),
  notificationMethod: varchar("notification_method", { length: 20 }),
  totalCreditsSpent: decimal("total_credits_spent", { precision: 10, scale: 2 }).default("0.00"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  
  // Credits system
  creditBalance: decimal("credit_balance", { precision: 10, scale: 2 }).default("0.00"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow()
});

// Deals table - MySQL version
export const deals = mysqlTable("deals", {
  id: varchar("id", { length: 255 }).primaryKey(),
  supplierId: varchar("supplier_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  dealType: varchar("deal_type", { length: 20 }).notNull().default("regular"), // 'hot' or 'regular'
  category: varchar("category", { length: 100 }).notNull(),
  keywords: json("keywords"),
  imageUrl: varchar("image_url", { length: 500 }),
  expiryDate: timestamp("expiry_date"),
  dealStatus: varchar("deal_status", { length: 20 }).notNull().default("active"), // 'active', 'expired', 'paused'
  viewCount: int("view_count").default(0),
  inquiryCount: int("inquiry_count").default(0),
  creditsCost: int("credits_cost").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow()
});

// Keywords table - MySQL version
export const keywords = mysqlTable("keywords", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  keyword: varchar("keyword", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Notifications table - MySQL version
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  dealId: varchar("deal_id", { length: 255 }).notNull(),
  keyword: varchar("keyword", { length: 100 }),
  message: text("message"),
  notificationStatus: varchar("notification_status", { length: 20 }).default("unread"), // 'unread', 'read'
  notificationType: varchar("notification_type", { length: 20 }).default("keyword_match"), // 'keyword_match', 'deal_update', 'system'
  createdAt: timestamp("created_at").defaultNow()
});

// Inquiries table - MySQL version
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  dealId: varchar("deal_id", { length: 255 }).notNull(),
  buyerId: varchar("buyer_id", { length: 255 }).notNull(),
  supplierId: varchar("supplier_id", { length: 255 }).notNull(),
  message: text("message"),
  buyerContact: varchar("buyer_contact", { length: 255 }),
  inquiryStatus: varchar("inquiry_status", { length: 20 }).default("new"), // 'new', 'responded', 'closed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow()
});

// Coupons table - MySQL version
export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  dealId: varchar("deal_id", { length: 255 }).notNull(),
  buyerId: varchar("buyer_id", { length: 255 }).notNull(),
  couponCode: varchar("coupon_code", { length: 50 }).notNull(),
  buyerFirstName: varchar("buyer_first_name", { length: 100 }),
  buyerLastName: varchar("buyer_last_name", { length: 100 }),
  buyerCompany: varchar("buyer_company", { length: 255 }),
  buyerEmail: varchar("buyer_email", { length: 255 }),
  buyerMobile: varchar("buyer_mobile", { length: 20 }),
  buyerAddress: text("buyer_address"),
  couponStatus: varchar("coupon_status", { length: 20 }).default("active"), // 'active', 'used', 'expired'
  createdAt: timestamp("created_at").defaultNow(),
  usedAt: timestamp("used_at")
});

// Relations remain the same as PostgreSQL version
export const usersRelations = relations(users, ({ many }) => ({
  deals: many(deals),
  keywords: many(keywords),
  notifications: many(notifications),
  inquiries: many(inquiries),
  coupons: many(coupons)
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  supplier: one(users, {
    fields: [deals.supplierId],
    references: [users.id]
  }),
  inquiries: many(inquiries),
  notifications: many(notifications),
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
    references: [users.id]
  }),
  supplier: one(users, {
    fields: [inquiries.supplierId],
    references: [users.id]
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

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertDealSchema = createInsertSchema(deals);
export const selectDealSchema = createSelectSchema(deals);
export const insertKeywordSchema = createInsertSchema(keywords);
export const selectKeywordSchema = createSelectSchema(keywords);
export const insertNotificationSchema = createInsertSchema(notifications);
export const selectNotificationSchema = createSelectSchema(notifications);
export const insertInquirySchema = createInsertSchema(inquiries);
export const selectInquirySchema = createSelectSchema(inquiries);
export const insertCouponSchema = createInsertSchema(coupons);
export const selectCouponSchema = createSelectSchema(coupons);

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Deal = typeof deals.$inferSelect;
export type InsertDeal = typeof deals.$inferInsert;
export type Keyword = typeof keywords.$inferSelect;
export type InsertKeyword = typeof keywords.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;