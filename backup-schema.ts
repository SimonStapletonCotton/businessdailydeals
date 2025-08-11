import { 
  mysqlTable, 
  varchar, 
  text, 
  decimal, 
  boolean, 
  timestamp, 
  int,
  json,
  index,
  primaryKey
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - supports both buyers and suppliers
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  userType: varchar("user_type", { length: 50 }).notNull(), // 'buyer' or 'supplier'
  mobile: varchar("mobile", { length: 20 }),
  province: varchar("province", { length: 100 }),
  
  // Buyer specific fields
  companyName: varchar("company_name", { length: 255 }),
  jobTitle: varchar("job_title", { length: 255 }),
  industry: varchar("industry", { length: 255 }),
  keywordsForNotifications: json("keywords_for_notifications").$type<string[]>(),
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  whatsappNotifications: boolean("whatsapp_notifications").default(false),
  
  // Supplier specific fields
  businessDescription: text("business_description"),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 255 }),
  city: varchar("city", { length: 100 }),
  streetAddress: varchar("street_address", { length: 255 }),
  postalCode: varchar("postal_code", { length: 10 }),
  vatNumber: varchar("vat_number", { length: 50 }),
  businessRegistrationNumber: varchar("business_registration_number", { length: 50 }),
  isVerified: boolean("is_verified").default(false),
  
  // Credits system
  creditBalance: decimal("credit_balance", { precision: 10, scale: 2 }).default("0.00"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  userTypeIdx: index("user_type_idx").on(table.userType),
}));

// Deals table
export const deals = mysqlTable("deals", {
  id: varchar("id", { length: 255 }).primaryKey(),
  supplierId: varchar("supplier_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  dealType: varchar("deal_type", { length: 20 }).notNull().default("regular"), // 'hot' or 'regular'
  category: varchar("category", { length: 100 }).notNull(),
  keywords: json("keywords").$type<string[]>(),
  imageUrl: varchar("image_url", { length: 500 }),
  expiryDate: timestamp("expiry_date"),
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'active', 'expired', 'draft'
  viewCount: int("view_count").default(0),
  inquiryCount: int("inquiry_count").default(0),
  creditsCost: decimal("credits_cost", { precision: 5, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => ({
  supplierIdx: index("supplier_idx").on(table.supplierId),
  categoryIdx: index("category_idx").on(table.category),
  dealTypeIdx: index("deal_type_idx").on(table.dealType),
  statusIdx: index("status_idx").on(table.status),
}));

// Keywords table for buyer notifications
export const keywords = mysqlTable("keywords", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  keyword: varchar("keyword", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  keywordIdx: index("keyword_idx").on(table.keyword),
}));

// Notifications table
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  dealId: varchar("deal_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  dealIdx: index("deal_idx").on(table.dealId),
}));

// Inquiries table
export const inquiries = mysqlTable("inquiries", {
  id: varchar("id", { length: 255 }).primaryKey(),
  dealId: varchar("deal_id", { length: 255 }).notNull(),
  buyerId: varchar("buyer_id", { length: 255 }).notNull(),
  supplierId: varchar("supplier_id", { length: 255 }).notNull(),
  message: text("message"),
  contactMethod: varchar("contact_method", { length: 50 }).default("email"),
  status: varchar("status", { length: 20 }).default("pending"), // 'pending', 'responded', 'closed'
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  dealIdx: index("deal_idx").on(table.dealId),
  buyerIdx: index("buyer_idx").on(table.buyerId),
  supplierIdx: index("supplier_idx").on(table.supplierId),
}));

// Sessions table
export const sessions = mysqlTable("session", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull()
}, (table) => ({
  expireIdx: index("expire_idx").on(table.expire),
}));

// Credit transactions table
export const creditTransactions = mysqlTable("credit_transactions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'purchase', 'charge', 'refund'
  description: varchar("description", { length: 255 }),
  dealId: varchar("deal_id", { length: 255 }),
  dealType: varchar("deal_type", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  dealIdx: index("deal_idx").on(table.dealId),
}));

// Deal requests table
export const dealRequests = mysqlTable("deal_requests", {
  id: varchar("id", { length: 255 }).primaryKey(),
  buyerId: varchar("buyer_id", { length: 255 }).notNull(),
  productDescription: text("product_description").notNull(),
  category: varchar("category", { length: 100 }),
  priceRangeMin: decimal("price_range_min", { precision: 10, scale: 2 }),
  priceRangeMax: decimal("price_range_max", { precision: 10, scale: 2 }),
  quantity: varchar("quantity", { length: 100 }),
  urgency: varchar("urgency", { length: 20 }).default("normal"), // 'urgent', 'normal', 'flexible'
  additionalRequirements: text("additional_requirements"),
  contactMethod: varchar("contact_method", { length: 50 }).default("email"),
  status: varchar("status", { length: 20 }).default("open"), // 'open', 'fulfilled', 'closed'
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  buyerIdx: index("buyer_idx").on(table.buyerId),
  statusIdx: index("status_idx").on(table.status),
}));

// Site analytics table
export const siteAnalytics = mysqlTable("site_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  totalVisits: int("total_visits").default(0),
  uniqueVisitors: int("unique_visitors").default(0),
  dealViews: int("deal_views").default(0),
  searchQueries: int("search_queries").default(0),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  dateIdx: index("date_idx").on(table.date),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  deals: many(deals),
  keywords: many(keywords),
  notifications: many(notifications),
  inquiriesAsBuyer: many(inquiries, { relationName: "buyer" }),
  inquiriesAsSupplier: many(inquiries, { relationName: "supplier" }),
  creditTransactions: many(creditTransactions),
  dealRequests: many(dealRequests)
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  supplier: one(users, {
    fields: [deals.supplierId],
    references: [users.id]
  }),
  notifications: many(notifications),
  inquiries: many(inquiries),
  creditTransactions: many(creditTransactions)
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

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, {
    fields: [creditTransactions.userId],
    references: [users.id]
  }),
  deal: one(deals, {
    fields: [creditTransactions.dealId],
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
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertDealSchema = createInsertSchema(deals).omit({ id: true });
export const insertKeywordSchema = createInsertSchema(keywords).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true });
export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({ id: true });
export const insertDealRequestSchema = createInsertSchema(dealRequests).omit({ id: true });

// Select schemas and types
export const selectUserSchema = createSelectSchema(users);
export const selectDealSchema = createSelectSchema(deals);
export const selectKeywordSchema = createSelectSchema(keywords);
export const selectNotificationSchema = createSelectSchema(notifications);
export const selectInquirySchema = createSelectSchema(inquiries);
export const selectCreditTransactionSchema = createSelectSchema(creditTransactions);
export const selectDealRequestSchema = createSelectSchema(dealRequests);

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Keyword = typeof keywords.$inferSelect;
export type InsertKeyword = z.infer<typeof insertKeywordSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
export type DealRequest = typeof dealRequests.$inferSelect;
export type InsertDealRequest = z.infer<typeof insertDealRequestSchema>;
export type SiteAnalytics = typeof siteAnalytics.$inferSelect;

// Complex types
export type DealWithSupplier = Deal & { supplier: User };
export type InquiryWithDetails = Inquiry & { 
  deal: Deal; 
  buyer: User; 
  supplier: User; 
};
export type NotificationWithDeal = Notification & { deal: Deal };