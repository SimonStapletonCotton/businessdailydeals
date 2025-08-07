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
  keywords: text("keywords").array(),
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

// Insert schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertDealSchema = createInsertSchema(deals)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    price: z.string().min(1, "Price is required"),
    originalPrice: z.string().optional().nullable(),
    keywords: z.array(z.string()).optional().default([]),
    expiresAt: z.date().optional().nullable(),
  });
export const insertKeywordSchema = createInsertSchema(keywords).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true });
export const insertCouponSchema = createInsertSchema(coupons).omit({ id: true, createdAt: true, updatedAt: true });

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
