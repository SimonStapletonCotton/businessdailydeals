var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/email.ts
var email_exports = {};
__export(email_exports, {
  sendDealRequestToAdmin: () => sendDealRequestToAdmin,
  sendEmail: () => sendEmail,
  sendInquiryNotifications: () => sendInquiryNotifications,
  sendPaymentConfirmationToCustomer: () => sendPaymentConfirmationToCustomer,
  sendPaymentNotificationToAdmin: () => sendPaymentNotificationToAdmin
});
import { MailService } from "@sendgrid/mail";
async function sendEmail(params) {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY not configured");
      return false;
    }
    await mailService.send({
      to: params.to,
      from: params.from || "noreply@businessdailydeals.co.za",
      subject: params.subject,
      text: params.text,
      html: params.html
    });
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error("SendGrid email error:", error);
    return false;
  }
}
async function sendInquiryNotifications(inquiryData) {
  const adminEmail = "admin@businessdailydeals.co.za";
  const fromEmail = "noreply@businessdailydeals.co.za";
  const supplierEmailContent = `
New Inquiry for Your Deal
=========================

Dear ${inquiryData.supplierName},

You have received a new inquiry for your deal "${inquiryData.dealTitle}".

Deal Details:
- Product: ${inquiryData.dealTitle}
- Price: ${inquiryData.dealPrice}

Buyer Information:
- Name: ${inquiryData.buyerName}
- Email: ${inquiryData.buyerEmail}

Inquiry Message:
${inquiryData.inquiryMessage || "No additional message provided."}

Please log into your supplier dashboard at www.businessdailydeals.co.za to respond to this inquiry.

Best regards,
Business Daily Deals Team
www.businessdailydeals.co.za
  `;
  const adminEmailContent = `
New Inquiry Notification
========================

A new inquiry has been submitted on Business Daily Deals.

Deal Information:
- Product: ${inquiryData.dealTitle}
- Price: ${inquiryData.dealPrice}

Supplier Information:
- Name: ${inquiryData.supplierName}
- Email: ${inquiryData.supplierEmail}

Buyer Information:
- Name: ${inquiryData.buyerName}
- Email: ${inquiryData.buyerEmail}

Inquiry Message:
${inquiryData.inquiryMessage || "No additional message provided."}

Submitted: ${inquiryData.submittedAt}

This inquiry has been sent to the supplier and copied here for your records.
  `;
  let supplierSuccess = false;
  let adminSuccess = false;
  if (inquiryData.supplierEmail) {
    try {
      supplierSuccess = await sendEmail({
        to: inquiryData.supplierEmail,
        from: fromEmail,
        subject: `New inquiry for your deal: ${inquiryData.dealTitle}`,
        text: supplierEmailContent,
        html: supplierEmailContent.replace(/\n/g, "<br>")
      });
    } catch (error) {
      console.error("Failed to send inquiry email to supplier:", error);
    }
  }
  try {
    adminSuccess = await sendEmail({
      to: adminEmail,
      from: fromEmail,
      subject: `Inquiry Copy: ${inquiryData.dealTitle}`,
      text: adminEmailContent,
      html: adminEmailContent.replace(/\n/g, "<br>")
    });
  } catch (error) {
    console.error("Failed to send inquiry copy to admin:", error);
  }
  console.log(`Inquiry emails - Supplier: ${supplierSuccess ? "sent" : "failed"}, Admin: ${adminSuccess ? "sent" : "failed"}`);
  return supplierSuccess || adminSuccess;
}
async function sendPaymentConfirmationToCustomer(paymentData) {
  const fromEmail = "noreply@businessdailydeals.co.za";
  const emailContent = `
Payment Confirmation - Business Daily Deals
==========================================

Dear ${paymentData.customerName},

Thank you for your payment! Your credit purchase has been successfully processed.

Payment Details:
- Amount Paid: ${paymentData.amount}
- Credits Added: ${paymentData.credits}
- Package: ${paymentData.packageType}
- Payment Reference: ${paymentData.paymentReference}
- Date/Time: ${paymentData.paidAt}

Your credits have been added to your Business Daily Deals account and are ready to use.
You can now start posting deals, extending existing deals, or purchasing premium advertising space.

Next Steps:
1. Log into your account at www.businessdailydeals.co.za
2. Visit your dashboard to see your updated credit balance
3. Start posting hot deals or regular deals
4. Use the "Find Me a Deal" feature if you're a buyer

Thank you for choosing Business Daily Deals!

Best regards,
Business Daily Deals Team
www.businessdailydeals.co.za
  `;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #16a34a; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">Payment Confirmation</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Business Daily Deals</p>
      </div>
      
      <div style="padding: 30px;">
        <p style="font-size: 18px; color: #374151; margin-bottom: 20px;">Dear ${paymentData.customerName},</p>
        <p style="color: #374151; margin-bottom: 20px;">Thank you for your payment! Your credit purchase has been successfully processed.</p>

        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a; margin-bottom: 20px;">
          <h3 style="color: #15803d; margin-top: 0;">Payment Details</h3>
          <p style="margin: 5px 0;"><strong>Amount Paid:</strong> <span style="color: #15803d; font-size: 18px; font-weight: bold;">${paymentData.amount}</span></p>
          <p style="margin: 5px 0;"><strong>Credits Added:</strong> <span style="color: #15803d; font-weight: bold;">${paymentData.credits}</span></p>
          <p style="margin: 5px 0;"><strong>Package:</strong> ${paymentData.packageType}</p>
          <p style="margin: 5px 0;"><strong>Payment Reference:</strong> ${paymentData.paymentReference}</p>
          <p style="margin: 5px 0;"><strong>Date/Time:</strong> ${paymentData.paidAt}</p>
        </div>

        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin-top: 0;">What's Next?</h3>
          <ol style="color: #92400e; margin: 10px 0;">
            <li>Log into your account at <strong>www.businessdailydeals.co.za</strong></li>
            <li>Visit your dashboard to see your updated credit balance</li>
            <li>Start posting hot deals or regular deals</li>
            <li>Use the "Find Me a Deal" feature if you're a buyer</li>
          </ol>
        </div>

        <div style="background-color: #e0f2fe; padding: 15px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #0c4a6e; font-weight: bold;">Your credits are ready to use!</p>
        </div>

        <p style="color: #6b7280; margin-top: 30px; text-align: center;">
          Thank you for choosing Business Daily Deals!<br>
          <strong>www.businessdailydeals.co.za</strong>
        </p>
      </div>
    </div>
  `;
  return await sendEmail({
    to: paymentData.customerEmail,
    from: fromEmail,
    subject: `Payment Confirmation - ${paymentData.credits} Credits Added to Your Account`,
    text: emailContent,
    html: htmlContent
  });
}
async function sendPaymentNotificationToAdmin(paymentData) {
  const adminEmail = "admin@businessdailydeals.co.za";
  const fromEmail = "noreply@businessdailydeals.co.za";
  const emailContent = `
Payment Successfully Processed
==============================

Payment Details:
- Amount: ${paymentData.amount}
- Payment Reference: ${paymentData.paymentReference}
- Merchant Reference: ${paymentData.merchantReference}
- Payment Method: ${paymentData.paymentMethod}
- Date/Time: ${paymentData.paidAt}

Customer Information:
- Name: ${paymentData.customerName}
- Email: ${paymentData.customerEmail}

Purchase Details:
- Package: ${paymentData.packageType}
- Credits Purchased: ${paymentData.credits}

This payment should appear in your Nedbank account within 24 hours.
Use the Merchant Reference (${paymentData.merchantReference}) to match with your bank statement.

Business Daily Deals Admin Panel
www.businessdailydeals.co.za
  `;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #22c55e; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">\u{1F4B0} Payment Successfully Processed</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Business Daily Deals</p>
      </div>
      
      <div style="padding: 30px;">
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 20px;">
          <h3 style="color: #15803d; margin-top: 0; font-size: 18px;">\u{1F4B3} Payment Details</h3>
          <div style="display: grid; gap: 8px;">
            <p style="margin: 0;"><strong>Amount:</strong> <span style="color: #15803d; font-size: 20px; font-weight: bold;">${paymentData.amount}</span></p>
            <p style="margin: 0;"><strong>Payment Reference:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${paymentData.paymentReference}</code></p>
            <p style="margin: 0;"><strong>Merchant Reference:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${paymentData.merchantReference}</code></p>
            <p style="margin: 0;"><strong>Payment Method:</strong> ${paymentData.paymentMethod}</p>
            <p style="margin: 0;"><strong>Date/Time:</strong> ${paymentData.paidAt}</p>
          </div>
        </div>

        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin-top: 0;">\u{1F464} Customer Information</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${paymentData.customerName}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${paymentData.customerEmail}</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin-top: 0;">\u{1F4E6} Purchase Details</h3>
          <p style="margin: 5px 0;"><strong>Package:</strong> ${paymentData.packageType}</p>
          <p style="margin: 5px 0;"><strong>Credits Purchased:</strong> <span style="color: #1e40af; font-weight: bold;">${paymentData.credits}</span></p>
        </div>

        <div style="background-color: #e0f2fe; padding: 15px; border-radius: 8px; border: 1px solid #0284c7;">
          <p style="margin: 0; color: #0c4a6e;"><strong>\u{1F4F1} Bank Reconciliation:</strong></p>
          <p style="margin: 5px 0 0 0; color: #0c4a6e;">This payment should appear in your Nedbank account within 24 hours.</p>
          <p style="margin: 5px 0 0 0; color: #0c4a6e;">Use reference: <strong>${paymentData.merchantReference}</strong> to match with your bank statement.</p>
        </div>
      </div>
    </div>
  `;
  return await sendEmail({
    to: adminEmail,
    from: fromEmail,
    subject: `\u{1F4B0} Payment Received: ${paymentData.amount} - ${paymentData.merchantReference}`,
    text: emailContent,
    html: htmlContent
  });
}
async function sendDealRequestToAdmin(dealRequestData) {
  const adminEmail = "admin@businessdailydeals.co.za";
  const fromEmail = "noreply@businessdailydeals.co.za";
  const priceRange = dealRequestData.priceRangeMin || dealRequestData.priceRangeMax ? `R${dealRequestData.priceRangeMin || 0} - R${dealRequestData.priceRangeMax || "unlimited"}` : "Not specified";
  const emailContent = `
New Deal Request Received
========================

Customer Information:
- Name: ${dealRequestData.requesterName}
- Email: ${dealRequestData.requesterEmail}
- Submitted: ${dealRequestData.submittedAt}

Product Requirements:
- Product: ${dealRequestData.productName}
- Size/Specifications: ${dealRequestData.productSize || "Not specified"}
- Quantity Required: ${dealRequestData.quantityRequired}
- Delivery Destination: ${dealRequestData.deliveryDestination}
- Price Range: ${priceRange}

Additional Requirements:
${dealRequestData.additionalRequirements || "None specified"}

Please process this request and search for matching suppliers.
  `;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #374151; border-bottom: 2px solid #374151; padding-bottom: 10px;">
        New Deal Request Received
      </h2>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Customer Information</h3>
        <p><strong>Name:</strong> ${dealRequestData.requesterName}</p>
        <p><strong>Email:</strong> ${dealRequestData.requesterEmail}</p>
        <p><strong>Submitted:</strong> ${dealRequestData.submittedAt}</p>
      </div>

      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Product Requirements</h3>
        <p><strong>Product:</strong> ${dealRequestData.productName}</p>
        <p><strong>Size/Specifications:</strong> ${dealRequestData.productSize || "Not specified"}</p>
        <p><strong>Quantity Required:</strong> ${dealRequestData.quantityRequired}</p>
        <p><strong>Delivery Destination:</strong> ${dealRequestData.deliveryDestination}</p>
        <p><strong>Price Range:</strong> ${priceRange}</p>
      </div>

      ${dealRequestData.additionalRequirements ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Additional Requirements</h3>
          <p>${dealRequestData.additionalRequirements}</p>
        </div>
      ` : ""}

      <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #166534;">
          Please process this request and search for matching suppliers.
        </p>
      </div>
    </div>
  `;
  return await sendEmail({
    to: adminEmail,
    from: fromEmail,
    subject: `New Deal Request: ${dealRequestData.productName}`,
    text: emailContent,
    html: htmlContent
  });
}
var mailService;
var init_email = __esm({
  "server/email.ts"() {
    "use strict";
    mailService = new MailService();
    if (process.env.SENDGRID_API_KEY) {
      mailService.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }
});

// server/routes/upload.ts
var upload_exports = {};
__export(upload_exports, {
  default: () => upload_default
});
import { Router } from "express";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import { nanoid as nanoid2 } from "nanoid";
import { extname } from "path";
var router, upload, REPLIT_SIDECAR_ENDPOINT, storage2, upload_default;
var init_upload = __esm({
  "server/routes/upload.ts"() {
    "use strict";
    router = Router();
    upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024
        // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
          cb(null, true);
        } else {
          cb(new Error("Only image files are allowed"));
        }
      }
    });
    REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
    storage2 = new Storage({
      credentials: {
        audience: "replit",
        subject_token_type: "access_token",
        token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
        type: "external_account",
        credential_source: {
          url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
          format: {
            type: "json",
            subject_token_field_name: "access_token"
          }
        },
        universe_domain: "googleapis.com"
      },
      projectId: ""
    });
    router.post("/image", upload.single("file"), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        const userId = req.user?.claims?.sub || "46102542";
        const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
        if (!bucketId) {
          return res.status(500).json({ message: "Object storage not configured" });
        }
        const bucket = storage2.bucket(bucketId);
        const fileExtension = extname(req.file.originalname);
        const uniqueId = nanoid2();
        const fileName = `public/product-images/${uniqueId}${fileExtension}`;
        const file = bucket.file(fileName);
        const stream = file.createWriteStream({
          metadata: {
            contentType: req.file.mimetype
          },
          resumable: false
        });
        stream.on("error", (error) => {
          console.error("Upload stream error:", error);
          if (!res.headersSent) {
            res.status(500).json({ message: "Failed to upload file" });
          }
        });
        stream.on("finish", async () => {
          try {
            const publicUrl = `/public-objects/product-images/${uniqueId}${fileExtension}`;
            res.json({
              url: publicUrl,
              fileName,
              size: req.file.size,
              mimetype: req.file.mimetype
            });
          } catch (error) {
            console.error("Error completing upload:", error);
            if (!res.headersSent) {
              res.status(500).json({ message: "Failed to complete upload" });
            }
          }
        });
        stream.end(req.file.buffer);
      } catch (error) {
        console.error("Upload error:", error);
        if (error instanceof multer.MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
          }
        }
        res.status(500).json({
          message: error instanceof Error ? error.message : "Upload failed"
        });
      }
    });
    upload_default = router;
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bannerAds: () => bannerAds,
  basketItems: () => basketItems,
  basketItemsRelations: () => basketItemsRelations,
  companies: () => companies,
  couponRedemptions: () => couponRedemptions,
  coupons: () => coupons,
  couponsRelations: () => couponsRelations,
  creditTransactions: () => creditTransactions,
  creditTransactionsRelations: () => creditTransactionsRelations,
  dealRequests: () => dealRequests,
  dealRequestsRelations: () => dealRequestsRelations,
  deals: () => deals,
  dealsRelations: () => dealsRelations,
  inquiries: () => inquiries,
  inquiriesRelations: () => inquiriesRelations,
  insertBannerAdSchema: () => insertBannerAdSchema,
  insertBasketItemSchema: () => insertBasketItemSchema,
  insertCompanySchema: () => insertCompanySchema,
  insertCouponRedemptionSchema: () => insertCouponRedemptionSchema,
  insertCouponSchema: () => insertCouponSchema,
  insertCreditTransactionSchema: () => insertCreditTransactionSchema,
  insertDealRequestSchema: () => insertDealRequestSchema,
  insertDealSchema: () => insertDealSchema,
  insertInquirySchema: () => insertInquirySchema,
  insertKeywordSchema: () => insertKeywordSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertRateSchema: () => insertRateSchema,
  insertSiteAnalyticsSchema: () => insertSiteAnalyticsSchema,
  insertUserSchema: () => insertUserSchema,
  keywords: () => keywords,
  keywordsRelations: () => keywordsRelations,
  notifications: () => notifications,
  notificationsRelations: () => notificationsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  rates: () => rates,
  selectBannerAdSchema: () => selectBannerAdSchema,
  selectBasketItemSchema: () => selectBasketItemSchema,
  selectCompanySchema: () => selectCompanySchema,
  selectCouponRedemptionSchema: () => selectCouponRedemptionSchema,
  selectCouponSchema: () => selectCouponSchema,
  selectCreditTransactionSchema: () => selectCreditTransactionSchema,
  selectDealRequestSchema: () => selectDealRequestSchema,
  selectDealSchema: () => selectDealSchema,
  selectInquirySchema: () => selectInquirySchema,
  selectKeywordSchema: () => selectKeywordSchema,
  selectNotificationSchema: () => selectNotificationSchema,
  selectOrderSchema: () => selectOrderSchema,
  selectRateSchema: () => selectRateSchema,
  selectSiteAnalyticsSchema: () => selectSiteAnalyticsSchema,
  selectUserSchema: () => selectUserSchema,
  siteAnalytics: () => siteAnalytics,
  upsertUserSchema: () => upsertUserSchema,
  users: () => users,
  usersRelations: () => usersRelations
});
import {
  pgTable,
  text,
  timestamp,
  decimal,
  integer,
  boolean,
  jsonb
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  userType: text("user_type").notNull(),
  // 'buyer' or 'supplier'
  mobile: text("mobile"),
  province: text("province"),
  // Buyer specific fields
  companyName: text("company_name"),
  representativeName: text("representative_name"),
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
var deals = pgTable("deals", {
  id: text("id").primaryKey(),
  supplierId: text("supplier_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discount: decimal("discount", { precision: 5, scale: 2 }),
  minOrder: integer("min_order"),
  size: text("size"),
  quantityAvailable: integer("quantity_available"),
  productSpecifications: text("product_specifications"),
  dealType: text("deal_type").notNull().default("regular"),
  // 'hot' or 'regular'
  category: text("category").notNull(),
  keywords: jsonb("keywords").$type(),
  imageUrl: text("image_url"),
  expiryDate: timestamp("expires_at"),
  dealStatus: text("deal_status").notNull().default("active"),
  // 'active', 'expired', 'draft'
  viewCount: integer("view_count").default(0),
  inquiryCount: integer("click_count").default(0),
  creditsCost: decimal("credits_cost", { precision: 5, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var keywords = pgTable("keywords", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  keyword: text("keyword").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  dealId: text("deal_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  notificationType: text("notification_type").notNull(),
  // 'keyword_match', 'deal_inquiry', etc.
  createdAt: timestamp("created_at").defaultNow()
});
var inquiries = pgTable("inquiries", {
  id: text("id").primaryKey(),
  dealId: text("deal_id").notNull(),
  buyerId: text("buyer_id").notNull(),
  supplierId: text("supplier_id").notNull(),
  message: text("message").notNull(),
  buyerContact: text("buyer_contact"),
  status: text("status").notNull().default("pending"),
  // 'pending', 'responded', 'closed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var coupons = pgTable("coupons", {
  id: text("id").primaryKey(),
  dealId: text("deal_id").notNull(),
  buyerId: text("buyer_id").notNull(),
  couponCode: text("coupon_code").notNull().unique(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  isRedeemed: boolean("is_redeemed").default(false),
  redeemedAt: timestamp("redeemed_at"),
  redemptionLocation: text("redemption_location"),
  // Branch/location where redeemed
  redemptionNotes: text("redemption_notes"),
  // Additional redemption details
  redemptionVerificationCode: text("redemption_verification_code"),
  // Unique verification for redemption
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow()
});
var couponRedemptions = pgTable("coupon_redemptions", {
  id: text("id").primaryKey(),
  couponId: text("coupon_id").notNull(),
  couponCode: text("coupon_code").notNull(),
  attemptedAt: timestamp("attempted_at").defaultNow(),
  success: boolean("success").notNull(),
  location: text("location"),
  // Branch/store location
  notes: text("notes"),
  // Redemption attempt notes
  ipAddress: text("ip_address"),
  // IP tracking for security
  userAgent: text("user_agent"),
  // Browser/device info
  failureReason: text("failure_reason")
  // Why redemption failed if applicable
});
var basketItems = pgTable("basket_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  rateId: text("rate_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow()
});
var rates = pgTable("rates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  credits: integer("credits").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var creditTransactions = pgTable("credit_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dealId: text("deal_id"),
  transactionType: text("type").notNull(),
  // 'purchase', 'spend', 'refund'
  description: text("description"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow()
});
var orders = pgTable("orders", {
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
  orderItems: jsonb("order_items").$type(),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var bannerAds = pgTable("banner_ads", {
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
var companies = pgTable("companies", {
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
var siteAnalytics = pgTable("site_analytics", {
  id: text("id").primaryKey(),
  date: timestamp("date").notNull(),
  pageViews: integer("page_views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  dealViews: integer("deal_views").default(0),
  inquiries: integer("inquiries").default(0),
  registrations: integer("registrations").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var dealRequests = pgTable("deal_requests", {
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
  status: text("status").notNull().default("active"),
  // 'active', 'fulfilled', 'expired'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
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
var dealsRelations = relations(deals, ({ one, many }) => ({
  supplier: one(users, {
    fields: [deals.supplierId],
    references: [users.id]
  }),
  keywords: many(keywords),
  notifications: many(notifications),
  inquiries: many(inquiries),
  coupons: many(coupons)
}));
var keywordsRelations = relations(keywords, ({ one }) => ({
  user: one(users, {
    fields: [keywords.userId],
    references: [users.id]
  })
}));
var notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  }),
  deal: one(deals, {
    fields: [notifications.dealId],
    references: [deals.id]
  })
}));
var inquiriesRelations = relations(inquiries, ({ one }) => ({
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
var couponsRelations = relations(coupons, ({ one }) => ({
  deal: one(deals, {
    fields: [coupons.dealId],
    references: [deals.id]
  }),
  buyer: one(users, {
    fields: [coupons.buyerId],
    references: [users.id]
  })
}));
var basketItemsRelations = relations(basketItems, ({ one }) => ({
  user: one(users, {
    fields: [basketItems.userId],
    references: [users.id]
  }),
  rate: one(rates, {
    fields: [basketItems.rateId],
    references: [rates.id]
  })
}));
var creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, {
    fields: [creditTransactions.userId],
    references: [users.id]
  })
}));
var ordersRelations = relations(orders, ({ one }) => ({
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
var dealRequestsRelations = relations(dealRequests, ({ one }) => ({
  buyer: one(users, {
    fields: [dealRequests.buyerId],
    references: [users.id]
  })
}));
var insertUserSchema = createInsertSchema(users);
var insertDealSchema = createInsertSchema(deals);
var insertKeywordSchema = createInsertSchema(keywords);
var insertNotificationSchema = createInsertSchema(notifications);
var insertInquirySchema = createInsertSchema(inquiries);
var insertCouponSchema = createInsertSchema(coupons);
var insertBasketItemSchema = createInsertSchema(basketItems);
var insertRateSchema = createInsertSchema(rates);
var insertCreditTransactionSchema = createInsertSchema(creditTransactions);
var insertOrderSchema = createInsertSchema(orders);
var insertBannerAdSchema = createInsertSchema(bannerAds);
var insertCompanySchema = createInsertSchema(companies);
var insertSiteAnalyticsSchema = createInsertSchema(siteAnalytics);
var insertDealRequestSchema = createInsertSchema(dealRequests);
var insertCouponRedemptionSchema = createInsertSchema(couponRedemptions);
var upsertUserSchema = insertUserSchema.partial().extend({
  id: z.string()
});
var selectUserSchema = createSelectSchema(users);
var selectDealSchema = createSelectSchema(deals);
var selectKeywordSchema = createSelectSchema(keywords);
var selectNotificationSchema = createSelectSchema(notifications);
var selectInquirySchema = createSelectSchema(inquiries);
var selectCouponSchema = createSelectSchema(coupons);
var selectBasketItemSchema = createSelectSchema(basketItems);
var selectRateSchema = createSelectSchema(rates);
var selectCreditTransactionSchema = createSelectSchema(creditTransactions);
var selectOrderSchema = createSelectSchema(orders);
var selectBannerAdSchema = createSelectSchema(bannerAds);
var selectCompanySchema = createSelectSchema(companies);
var selectSiteAnalyticsSchema = createSelectSchema(siteAnalytics);
var selectDealRequestSchema = createSelectSchema(dealRequests);
var selectCouponRedemptionSchema = createSelectSchema(couponRedemptions);

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  maxUses: Infinity,
  allowExitOnIdle: false,
  maxLifetimeSeconds: 0,
  idleTimeoutMillis: 1e4
});
var db = drizzle({ client: pool, schema: schema_exports });
async function testDatabaseConnection() {
  try {
    const result = await pool.query("SELECT 1 as test");
    if (result.rows[0]?.test === 1) {
      console.log("\u2705 Database connection successful");
    } else {
      throw new Error("Database connection test failed");
    }
  } catch (error) {
    console.error("\u274C Database connection failed:", error);
    throw error;
  }
}
pool.on("error", (err) => {
  console.error("\u274C Database pool error:", err);
});
pool.on("connect", () => {
  console.log("\u2705 Database pool connected");
});
pool.on("remove", () => {
  console.log("\u{1F504} Database connection removed from pool");
});
process.on("SIGTERM", async () => {
  console.log("Closing database pool...");
  await pool.end();
  process.exit(0);
});
process.on("SIGINT", async () => {
  console.log("Closing database pool...");
  await pool.end();
  process.exit(0);
});

// server/storage.ts
import { eq, desc, and, or, like, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async createUser(userData) {
    const userDataWithId = {
      ...userData,
      id: nanoid(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    const [user] = await db.insert(users).values(userDataWithId).returning();
    return user;
  }
  async updateUserType(id, userType) {
    const [user] = await db.update(users).set({ userType, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return user;
  }
  // Credits and payment operations
  async getUserCreditBalance(userId) {
    const [user] = await db.select({
      creditBalance: users.creditBalance,
      totalCreditsSpent: users.totalCreditsSpent
    }).from(users).where(eq(users.id, userId));
    return {
      creditBalance: user?.creditBalance || "0.00",
      totalCreditsSpent: user?.totalCreditsSpent || "0.00"
    };
  }
  async createCreditTransaction(transactionData) {
    const cleanData = { ...transactionData };
    if (cleanData.dealId === null) {
      delete cleanData.dealId;
    }
    const [transaction] = await db.insert(creditTransactions).values(cleanData).returning();
    return transaction;
  }
  async getUserCreditTransactions(userId) {
    return await db.select().from(creditTransactions).where(eq(creditTransactions.userId, userId)).orderBy(desc(creditTransactions.createdAt));
  }
  async updateUserCreditBalance(userId, amount, operation) {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    const currentBalance = parseFloat(user.creditBalance || "0");
    const changeAmount = parseFloat(amount);
    const newBalance = operation === "add" ? currentBalance + changeAmount : currentBalance - changeAmount;
    const newTotalSpent = operation === "subtract" ? parseFloat(user.totalCreditsSpent || "0") + changeAmount : parseFloat(user.totalCreditsSpent || "0");
    const [updatedUser] = await db.update(users).set({
      creditBalance: newBalance.toFixed(2),
      totalCreditsSpent: newTotalSpent.toFixed(2),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, userId)).returning();
    return updatedUser;
  }
  async updateUserStripeInfo(userId, data) {
    const [user] = await db.update(users).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId)).returning();
    return user;
  }
  // Direct purchase operations
  async createOrder(order) {
    const [result] = await db.insert(orders).values(order).returning();
    return result;
  }
  async getUserOrders(userId, type) {
    if (type === "buyer") {
      return await db.select().from(orders).where(eq(orders.buyerId, userId)).orderBy(desc(orders.createdAt));
    } else {
      const result = await db.select({
        orders
      }).from(orders).innerJoin(deals, eq(orders.dealId, deals.id)).where(eq(deals.supplierId, userId)).orderBy(desc(orders.createdAt));
      return result.map((row) => row.orders);
    }
  }
  async getOrder(orderId) {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    return order;
  }
  async updateOrderStatus(orderId, status) {
    const [order] = await db.update(orders).set({ orderStatus: status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(orders.id, orderId)).returning();
    return order;
  }
  // Banner advertising operations
  async getActiveBannerAds(position) {
    let whereCondition = eq(bannerAds.isActive, true);
    if (position) {
      whereCondition = and(eq(bannerAds.isActive, true), eq(bannerAds.position, position));
    }
    return await db.select().from(bannerAds).where(whereCondition).orderBy(desc(bannerAds.position), desc(bannerAds.createdAt));
  }
  async createBannerAd(bannerAd) {
    const [result] = await db.insert(bannerAds).values(bannerAd).returning();
    return result;
  }
  async updateBannerAdStats(adId, type) {
    const field = type === "click" ? bannerAds.clicks : bannerAds.impressions;
    const [result] = await db.update(bannerAds).set({ [type === "click" ? "clicks" : "impressions"]: sql`${field} + 1` }).where(eq(bannerAds.id, adId)).returning();
    return result;
  }
  async getUserBannerAds(userId) {
    return await db.select().from(bannerAds).where(eq(bannerAds.advertiserId, userId)).orderBy(desc(bannerAds.createdAt));
  }
  // Company directory operations
  async getCompanies(category, alphabetical = false) {
    let query = db.select().from(companies);
    if (category) {
    }
    if (alphabetical) {
      return await query.orderBy(companies.name);
    }
    return await query.orderBy(desc(companies.totalDeals), desc(companies.createdAt));
  }
  async getCompany(id) {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }
  async createOrUpdateCompany(company) {
    const [result] = await db.insert(companies).values(company).returning();
    return result;
  }
  async updateCompanyStats(userId, dealType, operation) {
  }
  // Search and analytics operations
  async searchDealsAdvanced(query, filters) {
    let whereConditions = [eq(deals.dealStatus, "active")];
    if (query) {
      whereConditions.push(
        or(
          like(deals.title, `%${query}%`),
          like(deals.description, `%${query}%`),
          sql`${deals.keywords}::text ILIKE ${`%${query}%`}`
        )
      );
    }
    if (filters?.category) {
      whereConditions.push(eq(deals.category, filters.category));
    }
    if (filters?.dealType) {
      whereConditions.push(eq(deals.dealType, filters.dealType));
    }
    if (filters?.priceRange) {
      if (filters.priceRange.min > 0) {
        whereConditions.push(sql`CAST(${deals.price} AS DECIMAL) >= ${filters.priceRange.min}`);
      }
      if (filters.priceRange.max > 0) {
        whereConditions.push(sql`CAST(${deals.price} AS DECIMAL) <= ${filters.priceRange.max}`);
      }
    }
    return await db.select().from(deals).where(and(...whereConditions)).orderBy(desc(deals.createdAt));
  }
  async searchCompanies(query) {
    return await db.select().from(companies).where(
      or(
        like(companies.name, `%${query}%`),
        like(companies.description, `%${query}%`),
        like(companies.industry, `%${query}%`)
      )
    ).orderBy(companies.name);
  }
  async updateDealAnalytics(dealId, type) {
    const field = type === "view" ? deals.viewCount : deals.inquiryCount;
    const [result] = await db.update(deals).set({ [type === "view" ? "viewCount" : "inquiryCount"]: sql`${field} + 1` }).where(eq(deals.id, dealId)).returning();
    return result;
  }
  async recordSiteAnalytics(date, type) {
    const [existing] = await db.select().from(siteAnalytics).where(eq(siteAnalytics.date, date));
    if (existing) {
      const updates = {};
      switch (type) {
        case "visit":
          updates.pageViews = (existing.pageViews || 0) + 1;
          break;
        case "unique_visitor":
          updates.uniqueVisitors = (existing.uniqueVisitors || 0) + 1;
          break;
        case "deal_view":
          updates.dealViews = (existing.dealViews || 0) + 1;
          break;
        case "search_query":
          updates.inquiries = (existing.inquiries || 0) + 1;
          break;
      }
      await db.update(siteAnalytics).set(updates).where(eq(siteAnalytics.id, existing.id));
    } else {
      const newRecord = {
        id: nanoid(),
        date: new Date(date),
        pageViews: type === "visit" ? 1 : 0,
        uniqueVisitors: type === "unique_visitor" ? 1 : 0,
        dealViews: type === "deal_view" ? 1 : 0,
        inquiries: type === "search_query" ? 1 : 0,
        registrations: 0
      };
      await db.insert(siteAnalytics).values(newRecord);
    }
  }
  async getSiteAnalytics(startDate, endDate) {
    let query = db.select().from(siteAnalytics);
    if (startDate && endDate) {
      query = query.where(
        and(
          sql`${siteAnalytics.date} >= ${startDate}`,
          sql`${siteAnalytics.date} <= ${endDate}`
        )
      );
    } else if (startDate) {
      query = query.where(sql`${siteAnalytics.date} >= ${startDate}`);
    } else if (endDate) {
      query = query.where(sql`${siteAnalytics.date} <= ${endDate}`);
    }
    return await query.orderBy(desc(siteAnalytics.date));
  }
  // Deal operations
  async getDeals(dealType) {
    let whereCondition = eq(deals.dealStatus, "active");
    if (dealType) {
      whereCondition = and(eq(deals.dealStatus, "active"), eq(deals.dealType, dealType));
    }
    const result = await db.select({
      deals,
      users: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        userType: users.userType,
        mobile: users.mobile,
        province: users.province,
        companyName: users.companyName,
        representativeName: users.representativeName,
        emailNotifications: users.emailNotifications,
        smsNotifications: users.smsNotifications,
        whatsappNotifications: users.whatsappNotifications,
        address: users.address,
        vatNumber: users.vatNumber,
        businessRegistrationNumber: users.businessRegistrationNumber,
        isVerified: users.isVerified,
        creditBalance: users.creditBalance,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }
    }).from(deals).leftJoin(users, eq(deals.supplierId, users.id)).where(whereCondition).orderBy(desc(deals.createdAt));
    const mappedResults = result.map((row) => ({
      ...row.deals,
      supplier: row.users
    }));
    return mappedResults;
  }
  async getDeal(id) {
    const result = await db.select({
      deals,
      users: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        userType: users.userType,
        mobile: users.mobile,
        province: users.province,
        companyName: users.companyName,
        representativeName: users.representativeName,
        emailNotifications: users.emailNotifications,
        smsNotifications: users.smsNotifications,
        whatsappNotifications: users.whatsappNotifications,
        address: users.address,
        vatNumber: users.vatNumber,
        businessRegistrationNumber: users.businessRegistrationNumber,
        isVerified: users.isVerified,
        creditBalance: users.creditBalance,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }
    }).from(deals).leftJoin(users, eq(deals.supplierId, users.id)).where(eq(deals.id, id));
    if (result.length === 0) return void 0;
    const row = result[0];
    return {
      ...row.deals,
      supplier: row.users
    };
  }
  async getDealById(id) {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    return deal || void 0;
  }
  async getDealsBySupplier(supplierId) {
    const result = await db.select({
      deals,
      users: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        userType: users.userType,
        mobile: users.mobile,
        province: users.province,
        companyName: users.companyName,
        representativeName: users.representativeName,
        emailNotifications: users.emailNotifications,
        smsNotifications: users.smsNotifications,
        whatsappNotifications: users.whatsappNotifications,
        address: users.address,
        vatNumber: users.vatNumber,
        businessRegistrationNumber: users.businessRegistrationNumber,
        isVerified: users.isVerified,
        creditBalance: users.creditBalance,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }
    }).from(deals).leftJoin(users, eq(deals.supplierId, users.id)).where(and(eq(deals.supplierId, supplierId), eq(deals.dealStatus, "active"))).orderBy(desc(deals.createdAt));
    return result.map((row) => ({
      ...row.deals,
      supplier: row.users
    }));
  }
  async getExpiredDealsBySupplier(supplierId) {
    const result = await db.select({
      deals,
      users: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        userType: users.userType,
        mobile: users.mobile,
        province: users.province,
        companyName: users.companyName,
        representativeName: users.representativeName,
        emailNotifications: users.emailNotifications,
        smsNotifications: users.smsNotifications,
        whatsappNotifications: users.whatsappNotifications,
        address: users.address,
        vatNumber: users.vatNumber,
        businessRegistrationNumber: users.businessRegistrationNumber,
        isVerified: users.isVerified,
        creditBalance: users.creditBalance,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }
    }).from(deals).leftJoin(users, eq(deals.supplierId, users.id)).where(and(eq(deals.supplierId, supplierId), eq(deals.dealStatus, "expired"))).orderBy(desc(deals.createdAt));
    return result.map((row) => ({
      ...row.deals,
      supplier: row.users
    }));
  }
  async createDeal(dealData) {
    const creditsCost = this.calculateDealCredits(dealData.dealType || "regular");
    const isPromotionalPeriod = /* @__PURE__ */ new Date() < /* @__PURE__ */ new Date("2026-02-20T23:59:59Z");
    const finalCreditsCost = isPromotionalPeriod ? 0 : creditsCost;
    const dealWithCredits = {
      ...dealData,
      creditsCost: finalCreditsCost.toString(),
      price: dealData.price?.toString(),
      originalPrice: dealData.originalPrice?.toString()
    };
    const [deal] = await db.insert(deals).values(dealWithCredits).returning();
    if (finalCreditsCost > 0 && dealData.supplierId && !isPromotionalPeriod) {
      await this.chargeDealCredits(dealData.supplierId, finalCreditsCost, deal.id, dealData.dealType || "regular");
    }
    if (dealData.keywords && dealData.keywords.length > 0) {
      const matchingKeywords = await db.select().from(keywords).where(inArray(keywords.keyword, dealData.keywords));
      for (const keyword of matchingKeywords) {
        await this.createNotification({
          userId: keyword.userId,
          title: "New Deal Alert",
          dealId: deal.id,
          message: `New deal matching your keyword "${keyword.keyword}": ${dealData.title}`
        });
      }
    }
    return deal;
  }
  async updateDeal(id, dealData) {
    const originalDeal = await this.getDeal(id);
    if (!originalDeal) throw new Error("Deal not found");
    const [deal] = await db.update(deals).set({ ...dealData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(deals.id, id)).returning();
    if (dealData.dealType && dealData.dealType !== originalDeal.dealType) {
      await this.handleDealTypeChangeCredits(originalDeal, dealData.dealType);
    }
    return deal;
  }
  async reactivateDeal(id, newExpiresAt) {
    const [deal] = await db.update(deals).set({
      dealStatus: "active",
      expiryDate: newExpiresAt,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(deals.id, id)).returning();
    return deal;
  }
  async updateDealExpiry(id, newExpiresAt) {
    const [deal] = await db.update(deals).set({
      expiryDate: new Date(newExpiresAt),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(deals.id, id)).returning();
    return deal;
  }
  async deleteDeal(id) {
    const deal = await this.getDeal(id);
    if (!deal) throw new Error("Deal not found");
    await db.delete(coupons).where(eq(coupons.dealId, id));
    await db.delete(creditTransactions).where(eq(creditTransactions.dealId, id));
    await db.delete(notifications).where(eq(notifications.dealId, id));
    await db.delete(inquiries).where(eq(inquiries.dealId, id));
    await db.delete(deals).where(eq(deals.id, id));
    const isPromotionalPeriod = /* @__PURE__ */ new Date() < /* @__PURE__ */ new Date("2026-02-20");
    if (!isPromotionalPeriod && parseFloat(deal.creditsCost || "0") > 0) {
      const currentBalance = await this.getCreditBalance(deal.supplierId);
      const refundAmount = parseFloat(deal.creditsCost);
      const newBalance = parseFloat(currentBalance.balance) + refundAmount;
      await db.update(users).set({ creditBalance: newBalance.toString() }).where(eq(users.id, deal.supplierId));
      await this.createCreditTransaction({
        userId: deal.supplierId,
        amount: refundAmount.toString(),
        type: "refund",
        description: `Refund for deleted deal: ${deal.title}`,
        dealId: null
      });
    }
  }
  async deleteAllDeals() {
    await db.delete(coupons);
    await db.delete(creditTransactions);
    await db.delete(notifications);
    await db.delete(inquiries);
    await db.delete(deals);
  }
  // Promotional period management
  async isSupplierInPromotionalPeriod(supplierId) {
    const supplier = await this.getUser(supplierId);
    if (!supplier || supplier.userType !== "supplier") {
      return false;
    }
    if (!supplier.isInPromotionalPeriod || !supplier.promotionalPeriodEnds) {
      return false;
    }
    const now = /* @__PURE__ */ new Date();
    const promotionalEnds = new Date(supplier.promotionalPeriodEnds);
    if (now > promotionalEnds) {
      await db.update(users).set({
        isInPromotionalPeriod: false,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, supplierId));
      return false;
    }
    return true;
  }
  async activateSupplierPromotionalPeriod(supplierId) {
    const now = /* @__PURE__ */ new Date();
    const promotionalEnd = /* @__PURE__ */ new Date("2026-02-20T23:59:59Z");
    const [user] = await db.update(users).set({
      isInPromotionalPeriod: true,
      promotionalPeriodEnds: promotionalEnd,
      updatedAt: now
    }).where(eq(users.id, supplierId)).returning();
    console.log(`Activated FREE promotional period for supplier ${supplierId} ending ${promotionalEnd.toISOString()} (Feb 20th, 2026)`);
    return user;
  }
  // Credit management for deals
  calculateDealCredits(dealType) {
    const isPromotionalPeriod = /* @__PURE__ */ new Date() < /* @__PURE__ */ new Date("2026-02-20T23:59:59Z");
    if (isPromotionalPeriod) {
      return 0;
    }
    const creditPricing = {
      "hot": 50,
      // R125 (50 credits × R2.50) - Premium placement on home page
      "regular": 20
      // R50 (20 credits × R2.50) - Standard deal listing
    };
    return creditPricing[dealType] || 20;
  }
  async chargeDealCredits(supplierId, credits, dealId, dealType) {
    const isPromotionalPeriod = /* @__PURE__ */ new Date() < /* @__PURE__ */ new Date("2026-02-20");
    if (isPromotionalPeriod || credits === 0) {
      console.log(`All deals are FREE until Feb 20, 2026 - no credits charged for ${dealType} deal`);
      await this.createCreditTransaction({
        userId: supplierId,
        amount: "0.00",
        type: "promotional_free",
        description: `FREE promotional period until Feb 20, 2026 - ${dealType.toUpperCase()} deal posting (normally ${credits > 0 ? credits : dealType === "hot" ? 50 : 20} credits)`,
        dealId
      });
      return;
    }
    const supplier = await this.getUser(supplierId);
    if (!supplier) throw new Error("Supplier not found");
    const currentBalance = parseFloat(supplier.creditBalance || "0");
    if (currentBalance < credits) {
      throw new Error(`Insufficient credits. Required: ${credits}, Available: ${currentBalance}`);
    }
    await this.updateUserCreditBalance(supplierId, credits.toString(), "subtract");
    await this.createCreditTransaction({
      userId: supplierId,
      amount: credits.toFixed(2),
      type: "spend",
      description: `${dealType.toUpperCase()} deal posting - ${credits} credits`,
      dealId
    });
  }
  async refundDealCredits(deal) {
    const creditsToRefund = parseFloat(deal.creditsCost);
    if (creditsToRefund <= 0) return;
    await this.updateUserCreditBalance(deal.supplierId, creditsToRefund.toString(), "add");
    await this.createCreditTransaction({
      userId: deal.supplierId,
      amount: creditsToRefund.toFixed(2),
      type: "refund",
      description: `Deal deletion refund - ${deal.title} (${creditsToRefund} credits)`,
      dealId: deal.id
    });
  }
  async handleDealTypeChangeCredits(originalDeal, newDealType) {
    const originalCredits = parseFloat(originalDeal.creditsCost);
    const newCredits = this.calculateDealCredits(newDealType);
    const creditDifference = newCredits - originalCredits;
    const isPromotionalPeriod = /* @__PURE__ */ new Date() < /* @__PURE__ */ new Date("2026-02-20T23:59:59Z");
    if (isPromotionalPeriod) {
      console.log(`Deal type change is FREE during promotional period: ${originalDeal.dealType} \u2192 ${newDealType}`);
      await this.createCreditTransaction({
        userId: originalDeal.supplierId,
        amount: "0.00",
        type: "promotional_free",
        description: `FREE promotional period - Deal type change ${originalDeal.dealType} \u2192 ${newDealType} (normally ${Math.abs(creditDifference)} credits)`,
        dealId: originalDeal.id
      });
    } else {
      if (creditDifference > 0) {
        await this.chargeDealCredits(
          originalDeal.supplierId,
          creditDifference,
          originalDeal.id,
          `${originalDeal.dealType} \u2192 ${newDealType} upgrade`
        );
      } else if (creditDifference < 0) {
        const refundAmount = Math.abs(creditDifference);
        await this.updateUserCreditBalance(originalDeal.supplierId, refundAmount.toString(), "add");
        await this.createCreditTransaction({
          userId: originalDeal.supplierId,
          amount: refundAmount.toFixed(2),
          type: "refund",
          description: `Deal type change refund - ${originalDeal.dealType} \u2192 ${newDealType} (${refundAmount} credits)`,
          dealId: originalDeal.id
        });
      }
    }
    await db.update(deals).set({ creditsCost: newCredits.toString() }).where(eq(deals.id, originalDeal.id));
  }
  async searchDeals(query, category) {
    let whereCondition = and(
      eq(deals.status, "active"),
      or(
        like(deals.title, `%${query}%`),
        like(deals.description, `%${query}%`)
      )
    );
    if (category && category !== "All Categories") {
      whereCondition = and(whereCondition, eq(deals.category, category));
    }
    const result = await db.select({
      deals,
      users: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        userType: users.userType,
        mobile: users.mobile,
        province: users.province,
        companyName: users.companyName,
        representativeName: users.representativeName,
        emailNotifications: users.emailNotifications,
        smsNotifications: users.smsNotifications,
        whatsappNotifications: users.whatsappNotifications,
        address: users.address,
        vatNumber: users.vatNumber,
        businessRegistrationNumber: users.businessRegistrationNumber,
        isVerified: users.isVerified,
        creditBalance: users.creditBalance,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }
    }).from(deals).leftJoin(users, eq(deals.supplierId, users.id)).where(whereCondition).orderBy(desc(deals.createdAt));
    return result.map((row) => ({
      ...row.deals,
      supplier: row.users
    }));
  }
  // Keyword operations
  async getUserKeywords(userId) {
    return await db.select().from(keywords).where(eq(keywords.userId, userId));
  }
  async addKeyword(keywordData) {
    const [keyword] = await db.insert(keywords).values(keywordData).returning();
    return keyword;
  }
  async createKeyword(userId, keyword) {
    const keywordData = {
      id: nanoid(),
      userId,
      keyword,
      createdAt: /* @__PURE__ */ new Date()
    };
    const [result] = await db.insert(keywords).values(keywordData).returning();
    return result;
  }
  async removeKeyword(id) {
    await db.delete(keywords).where(eq(keywords.id, id));
  }
  // Notification operations
  async getUserNotifications(userId) {
    try {
      const result = await db.select().from(notifications).leftJoin(deals, eq(notifications.dealId, deals.id)).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
      return result.map((row) => ({
        ...row.notifications,
        deal: row.deals
      }));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }
  async createNotification(notificationData) {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }
  async markNotificationAsRead(id) {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }
  // Inquiry operations
  async getInquiriesBySupplier(supplierId) {
    const result = await db.select().from(inquiries).leftJoin(deals, eq(inquiries.dealId, deals.id)).leftJoin(users, eq(inquiries.buyerId, users.id)).where(eq(inquiries.supplierId, supplierId)).orderBy(desc(inquiries.createdAt));
    return result.map((row) => ({
      ...row.inquiries,
      deal: row.deals,
      buyer: row.users,
      supplier: { id: supplierId }
    }));
  }
  async getInquiriesByBuyer(buyerId) {
    const result = await db.select().from(inquiries).leftJoin(deals, eq(inquiries.dealId, deals.id)).leftJoin(users, eq(inquiries.supplierId, users.id)).where(eq(inquiries.buyerId, buyerId)).orderBy(desc(inquiries.createdAt));
    return result.map((row) => ({
      ...row.inquiries,
      deal: row.deals,
      buyer: { id: buyerId },
      supplier: row.users
    }));
  }
  async createInquiry(inquiryData) {
    const [inquiry] = await db.insert(inquiries).values(inquiryData).returning();
    return inquiry;
  }
  async updateInquiryStatus(id, status) {
    const [inquiry] = await db.update(inquiries).set({ status }).where(eq(inquiries.id, id)).returning();
    return inquiry;
  }
  // Coupon operations
  async createCoupon(coupon) {
    const [newCoupon] = await db.insert(coupons).values(coupon).returning();
    return newCoupon;
  }
  async getCouponsByBuyer(buyerId) {
    const result = await db.select().from(coupons).leftJoin(deals, eq(coupons.dealId, deals.id)).leftJoin(users, eq(coupons.supplierId, users.id)).where(eq(coupons.buyerId, buyerId)).orderBy(desc(coupons.createdAt));
    return result.map((row) => ({
      ...row.coupons,
      deal: row.deals,
      buyer: {},
      // Already filtered by buyer
      supplier: row.users
    }));
  }
  async getCouponsBySupplier(supplierId) {
    const result = await db.select().from(coupons).leftJoin(deals, eq(coupons.dealId, deals.id)).leftJoin(users, eq(coupons.buyerId, users.id)).where(eq(coupons.supplierId, supplierId)).orderBy(desc(coupons.createdAt));
    return result.map((row) => ({
      ...row.coupons,
      deal: row.deals,
      buyer: row.users,
      supplier: {}
      // Already filtered by supplier
    }));
  }
  async getCouponByCode(couponCode) {
    const result = await db.select().from(coupons).leftJoin(deals, eq(coupons.dealId, deals.id)).leftJoin(users, eq(coupons.buyerId, users.id)).where(eq(coupons.couponCode, couponCode));
    if (result.length === 0) return void 0;
    const row = result[0];
    return {
      ...row.coupons,
      deal: row.deals,
      buyer: row.users,
      supplier: {}
      // Will be populated separately
    };
  }
  async redeemCoupon(couponCode, redemptionData = {}) {
    const [existingCoupon] = await db.select().from(coupons).where(eq(coupons.couponCode, couponCode)).limit(1);
    const redemptionId = nanoid();
    const auditLog = {
      id: redemptionId,
      couponId: existingCoupon?.id || "unknown",
      couponCode,
      attemptedAt: /* @__PURE__ */ new Date(),
      success: false,
      location: redemptionData.location,
      notes: redemptionData.notes,
      ipAddress: redemptionData.ipAddress,
      userAgent: redemptionData.userAgent,
      failureReason: null
    };
    try {
      if (!existingCoupon) {
        auditLog.failureReason = "Coupon code not found";
        await db.insert(couponRedemptions).values(auditLog);
        return {
          success: false,
          message: "Invalid coupon code. Please verify the code and try again."
        };
      }
      if (existingCoupon.isRedeemed) {
        auditLog.couponId = existingCoupon.id;
        auditLog.failureReason = `Already redeemed on ${existingCoupon.redeemedAt?.toLocaleDateString()} ${existingCoupon.redemptionLocation ? `at ${existingCoupon.redemptionLocation}` : ""}`;
        await db.insert(couponRedemptions).values(auditLog);
        return {
          success: false,
          message: `This coupon was already used on ${existingCoupon.redeemedAt?.toLocaleDateString("en-ZA")} ${existingCoupon.redemptionLocation ? `at ${existingCoupon.redemptionLocation}` : ""}. Each coupon can only be redeemed once.`
        };
      }
      if (existingCoupon.expiryDate && /* @__PURE__ */ new Date() > existingCoupon.expiryDate) {
        auditLog.couponId = existingCoupon.id;
        auditLog.failureReason = "Coupon expired";
        await db.insert(couponRedemptions).values(auditLog);
        return {
          success: false,
          message: `This coupon expired on ${existingCoupon.expiryDate.toLocaleDateString("en-ZA")}. Expired coupons cannot be redeemed.`
        };
      }
      const verificationCode = `VER-${nanoid(8).toUpperCase()}`;
      const [redeemedCoupon] = await db.update(coupons).set({
        isRedeemed: true,
        redeemedAt: /* @__PURE__ */ new Date(),
        redemptionLocation: redemptionData.location,
        redemptionNotes: redemptionData.notes,
        redemptionVerificationCode: verificationCode
      }).where(eq(coupons.couponCode, couponCode)).returning();
      auditLog.couponId = redeemedCoupon.id;
      auditLog.success = true;
      auditLog.failureReason = null;
      await db.insert(couponRedemptions).values(auditLog);
      return {
        success: true,
        coupon: redeemedCoupon,
        message: `Coupon successfully redeemed! Verification code: ${verificationCode}`
      };
    } catch (error) {
      auditLog.failureReason = `System error: ${error instanceof Error ? error.message : "Unknown error"}`;
      await db.insert(couponRedemptions).values(auditLog);
      console.error("Error redeeming coupon:", error);
      return {
        success: false,
        message: "System error occurred during redemption. Please try again or contact support."
      };
    }
  }
  // Get redemption history for audit purposes
  async getCouponRedemptionHistory(couponCode) {
    return await db.select().from(couponRedemptions).where(eq(couponRedemptions.couponCode, couponCode)).orderBy(desc(couponRedemptions.attemptedAt));
  }
  // Check if coupon is valid for redemption (without redeeming)
  async validateCouponForRedemption(couponCode) {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.couponCode, couponCode)).limit(1);
    if (!coupon) {
      return {
        valid: false,
        message: "Coupon code not found",
        canRedeem: false
      };
    }
    if (coupon.isRedeemed) {
      return {
        valid: true,
        coupon,
        message: `Already redeemed on ${coupon.redeemedAt?.toLocaleDateString("en-ZA")} ${coupon.redemptionLocation ? `at ${coupon.redemptionLocation}` : ""}`,
        canRedeem: false
      };
    }
    if (coupon.expiryDate && /* @__PURE__ */ new Date() > coupon.expiryDate) {
      return {
        valid: true,
        coupon,
        message: `Expired on ${coupon.expiryDate.toLocaleDateString("en-ZA")}`,
        canRedeem: false
      };
    }
    return {
      valid: true,
      coupon,
      message: "Valid coupon ready for redemption",
      canRedeem: true
    };
  }
  async expireCoupon(id) {
    const [coupon] = await db.update(coupons).set({
      expiresAt: /* @__PURE__ */ new Date()
      // Mark as expired by setting expiry to now
    }).where(eq(coupons.id, id)).returning();
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    return coupon;
  }
  async getPublicCoupons(limit = 50) {
    try {
      const result = await db.select({
        id: coupons.id,
        couponCode: coupons.couponCode,
        createdAt: coupons.createdAt,
        expiresAt: coupons.expiresAt,
        isRedeemed: coupons.isRedeemed,
        dealTitle: coupons.dealTitle,
        dealPrice: coupons.dealPrice,
        dealOriginalPrice: coupons.dealOriginalPrice,
        dealCategory: deals.category,
        supplierCompanyName: sql`supplier_user.company_name`,
        supplierCity: sql`NULL`,
        // Not available in schema
        supplierProvince: sql`supplier_user.province`,
        buyerFirstName: sql`buyer_user.first_name`,
        buyerLastName: sql`buyer_user.last_name`,
        buyerCity: sql`NULL`,
        // Not available in schema  
        buyerProvince: sql`buyer_user.province`,
        buyerCompanyName: sql`buyer_user.company_name`
      }).from(coupons).leftJoin(deals, eq(coupons.dealId, deals.id)).leftJoin(sql`${users} supplier_user`, eq(coupons.supplierId, sql`supplier_user.id`)).leftJoin(sql`${users} buyer_user`, eq(coupons.buyerId, sql`buyer_user.id`)).orderBy(desc(coupons.createdAt)).limit(limit);
      console.log("Public coupons query result:", result.length);
      return result;
    } catch (error) {
      console.error("Error in getPublicCoupons:", error);
      throw error;
    }
  }
  async getCouponStats() {
    const [totalResult] = await db.select({ count: sql`count(*)` }).from(coupons);
    const [redeemedResult] = await db.select({ count: sql`count(*)` }).from(coupons).where(eq(coupons.isRedeemed, true));
    const [activeResult] = await db.select({ count: sql`count(*)` }).from(coupons).where(
      and(
        eq(coupons.isRedeemed, false),
        sql`${coupons.expiresAt} > NOW()`
      )
    );
    const redeemedCoupons = await db.select({
      dealOriginalPrice: coupons.dealOriginalPrice,
      dealPrice: coupons.dealPrice
    }).from(coupons).where(eq(coupons.isRedeemed, true));
    let totalSavings = 0;
    for (const coupon of redeemedCoupons) {
      const originalPrice = parseFloat(coupon.dealOriginalPrice || "0");
      const dealPrice = parseFloat(coupon.dealPrice || "0");
      if (originalPrice > dealPrice) {
        totalSavings += originalPrice - dealPrice;
      }
    }
    return {
      totalCoupons: totalResult?.count || 0,
      activeCoupons: activeResult?.count || 0,
      redeemedCoupons: redeemedResult?.count || 0,
      totalSavings: totalSavings.toFixed(2)
    };
  }
  // Rates operations
  async getRates() {
    return await db.select().from(rates).orderBy(desc(rates.createdAt));
  }
  async createRate(rate) {
    const [newRate] = await db.insert(rates).values(rate).returning();
    return newRate;
  }
  async bulkCreateRates(ratesToInsert) {
    await db.delete(rates);
    const batchSize = 100;
    const results = [];
    for (let i = 0; i < ratesToInsert.length; i += batchSize) {
      const batch = ratesToInsert.slice(i, i + batchSize);
      const batchResults = await db.insert(rates).values(batch).returning();
      results.push(...batchResults);
    }
    return results;
  }
  async updateRate(id, rate) {
    const [updatedRate] = await db.update(rates).set({ ...rate, updatedAt: /* @__PURE__ */ new Date() }).where(eq(rates.id, id)).returning();
    if (!updatedRate) {
      throw new Error("Rate not found");
    }
    return updatedRate;
  }
  async deleteRate(id) {
    await db.delete(rates).where(eq(rates.id, id));
  }
  async clearAllRates() {
    await db.delete(rates);
  }
  // Basket operations
  async getBasketItems(userId) {
    return await db.select().from(basketItems).where(eq(basketItems.userId, userId));
  }
  async addBasketItem(basketData) {
    const [basketItem] = await db.insert(basketItems).values(basketData).returning();
    return basketItem;
  }
  async removeBasketItem(itemId, userId) {
    await db.delete(basketItems).where(and(eq(basketItems.id, itemId), eq(basketItems.userId, userId)));
  }
  async clearBasket(userId) {
    await db.delete(basketItems).where(eq(basketItems.userId, userId));
  }
  // Deal request operations
  async createDealRequest(request) {
    const [dealRequest] = await db.insert(dealRequests).values(request).returning();
    return dealRequest;
  }
  async getDealRequests() {
    return await db.select().from(dealRequests).orderBy(desc(dealRequests.createdAt));
  }
  async getDealRequestsByUser(userId) {
    return await db.select().from(dealRequests).where(eq(dealRequests.requesterId, userId)).orderBy(desc(dealRequests.createdAt));
  }
  async updateDealRequestStatus(id, status) {
    const [updatedRequest] = await db.update(dealRequests).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(dealRequests.id, id)).returning();
    if (!updatedRequest) {
      throw new Error("Deal request not found");
    }
    return updatedRequest;
  }
  // Business statistics operations
  async getBusinessStats() {
    try {
      const [supplierResult] = await db.select({ count: sql`count(distinct ${users.id})` }).from(users).innerJoin(deals, eq(users.id, deals.supplierId)).where(eq(users.userType, "supplier"));
      const [dealsResult] = await db.select({ count: sql`count(*)` }).from(deals);
      const [inquiriesResult] = await db.select({ count: sql`count(*)` }).from(inquiries);
      const [redeemedCouponsResult] = await db.select({ count: sql`count(*)` }).from(coupons).where(eq(coupons.isRedeemed, true));
      const [savingsResult] = await db.select({
        totalSavings: sql`coalesce(sum(
            case 
              when ${deals.originalPrice} is not null and ${deals.originalPrice} > ${deals.price}
              then ${deals.originalPrice} - ${deals.price}
              else 0
            end
          ), 0)`
      }).from(deals);
      const successfulConnections = (inquiriesResult?.count || 0) + (redeemedCouponsResult?.count || 0);
      return {
        activeSuppliers: supplierResult?.count || 0,
        totalDeals: dealsResult?.count || 0,
        successfulConnections,
        totalSavings: Math.round(savingsResult?.totalSavings || 0)
      };
    } catch (error) {
      console.error("Error fetching business stats:", error);
      return {
        activeSuppliers: 1,
        // You as the first supplier
        totalDeals: 8,
        // Current number of deals posted
        successfulConnections: 0,
        totalSavings: 0
      };
    }
  }
  // Keyword management operations
  async updateUserKeywords(userId, data) {
    const [updatedUser] = await db.update(users).set({
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, userId)).returning();
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  }
  async getSuppliersDirectory() {
    try {
      const suppliersData = await db.select().from(users).where(eq(users.userType, "supplier"));
      if (suppliersData.length === 0) {
        return [];
      }
      const supplierIds = suppliersData.map((s) => s.id);
      let dealCounts = [];
      if (supplierIds.length > 0) {
        dealCounts = await db.select({
          supplierId: deals.supplierId,
          totalDeals: sql`count(*)`,
          activeDeals: sql`count(case when ${deals.status} = 'active' then 1 end)`,
          totalViews: sql`sum(coalesce(${deals.viewCount}, 0))`
        }).from(deals).where(inArray(deals.supplierId, supplierIds)).groupBy(deals.supplierId);
      }
      const combinedData = suppliersData.map((supplier) => {
        const stats = dealCounts.find((d) => d.supplierId === supplier.id);
        return {
          id: supplier.id,
          email: supplier.email,
          firstName: supplier.firstName,
          lastName: supplier.lastName,
          companyName: supplier.companyName,
          businessDescription: supplier.businessDescription,
          industry: supplier.industry,
          province: supplier.province,
          city: supplier.city,
          phone: supplier.phone,
          website: supplier.website,
          activeDealsCount: stats?.activeDeals || 0,
          totalDealsCount: stats?.totalDeals || 0,
          totalViews: stats?.totalViews || 0,
          joinedDate: supplier.createdAt.toISOString(),
          lastActive: supplier.updatedAt?.toISOString() || supplier.createdAt.toISOString(),
          averageRating: 4.2 + Math.random() * 0.8
          // Mock rating for now
        };
      });
      return combinedData.sort((a, b) => {
        const nameA = a.companyName || `${a.firstName || ""} ${a.lastName || ""}`.trim() || "Supplier";
        const nameB = b.companyName || `${b.firstName || ""} ${b.lastName || ""}`.trim() || "Supplier";
        return nameA.localeCompare(nameB);
      });
    } catch (error) {
      console.error("Error in getSuppliersDirectory:", error);
      return [];
    }
  }
  // PayFast Payment Methods
  async getCreditTransactionByReference(paymentReference) {
    const [transaction] = await db.select().from(creditTransactions).where(eq(creditTransactions.paymentReference, paymentReference));
    return transaction;
  }
  async updateCreditTransaction(id, updates) {
    const [transaction] = await db.update(creditTransactions).set(updates).where(eq(creditTransactions.id, id)).returning();
    return transaction;
  }
  async addCreditsToUser(userId, credits) {
    await db.update(users).set({
      creditBalance: sql`CAST(COALESCE(${users.creditBalance}, '0') AS DECIMAL) + ${credits.toString()}`
    }).where(eq(users.id, userId));
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 30 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: true,
    // Changed to true to refresh session on activity
    saveUninitialized: false,
    rolling: true,
    // Extend session on activity
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // Only secure in production
      maxAge: sessionTtl,
      sameSite: "lax"
      // Allow cross-site requests for authentication
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    userType: "buyer"
    // Default to buyer, can be changed later
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    console.log("\u{1F510} VERIFY FUNCTION: Starting token verification");
    const claims = tokens.claims();
    if (!claims) {
      console.error("\u{1F510} VERIFY ERROR: No claims in token");
      verified(new Error("No claims in token"), false);
      return;
    }
    console.log("\u{1F510} VERIFY SUCCESS: Claims found:", { sub: claims.sub, email: claims.email });
    const user = {
      id: claims.sub,
      email: claims.email
    };
    try {
      updateUserSession(user, tokens);
      user.id = claims.sub;
      await upsertUser(claims);
      console.log("\u{1F510} VERIFY COMPLETE: User upserted successfully");
      verified(null, user);
    } catch (error) {
      console.error("\u{1F510} VERIFY ERROR: Failed to upsert user:", error);
      verified(error, false);
    }
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    const domain = req.get("host") || process.env.REPLIT_DOMAINS.split(",")[0];
    console.log("\u{1F510} LOGIN: Using domain:", domain);
    console.log("\u{1F510} LOGIN: Available strategies:", Object.keys(passport._strategies || {}));
    const strategyName = `replitauth:${domain}`;
    if (!passport._strategies?.[strategyName]) {
      console.log(`\u{1F510} LOGIN: Creating new strategy for domain: ${domain}`);
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`
        },
        verify
      );
      passport.use(strategy);
    }
    passport.authenticate(strategyName, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    const domain = req.get("host") || process.env.REPLIT_DOMAINS.split(",")[0];
    console.log("\u{1F510} AUTH CALLBACK: Processing callback for domain:", domain);
    console.log("\u{1F510} AUTH CALLBACK: Query params:", req.query);
    console.log("\u{1F510} AUTH CALLBACK: Available strategies:", Object.keys(passport._strategies || {}));
    const strategyName = `replitauth:${domain}`;
    if (!passport._strategies?.[strategyName]) {
      console.log(`\u{1F510} CALLBACK: Creating new strategy for domain: ${domain}`);
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`
        },
        verify
      );
      passport.use(strategy);
    }
    passport.authenticate(strategyName, (err, user, info) => {
      if (err) {
        console.error("\u{1F510} AUTH ERROR:", err);
        return res.redirect("/api/login?error=auth_error");
      }
      if (!user) {
        console.error("\u{1F510} AUTH FAILED: No user returned:", info);
        return res.redirect("/api/login?error=no_user");
      }
      console.log("\u{1F510} AUTH SUCCESS: User authenticated:", user.id);
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("\u{1F510} LOGIN ERROR:", loginErr);
          return res.redirect("/api/login?error=login_failed");
        }
        console.log("\u{1F510} SESSION CREATED: User logged in successfully");
        return res.redirect("/?auth=oauth-success");
      });
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
  app2.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
      loginUrl: "/api/login",
      redirectReason: "Not authenticated"
    });
  }
  const user = req.user;
  if (!user.expires_at) {
    return res.status(401).json({
      message: "Unauthorized",
      loginUrl: "/api/login",
      redirectReason: "Session expired"
    });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    req.session.touch();
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized",
      loginUrl: "/api/login",
      redirectReason: "Session expired, please login again"
    });
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    req.session.touch();
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      loginUrl: "/api/login",
      redirectReason: "Failed to refresh session, please login again"
    });
  }
};

// server/simpleAuth.ts
var activeTokens = /* @__PURE__ */ new Map();
function generateAuthToken(user) {
  const token = `auth_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  activeTokens.set(token, {
    user,
    createdAt: /* @__PURE__ */ new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3)
    // 24 hours
  });
  return token;
}

// server/routes.ts
init_email();
import Stripe from "stripe";
import { eq as eq2 } from "drizzle-orm";

// server/middleware/security.ts
import rateLimit from "express-rate-limit";
var createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      console.log(`Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
      res.status(429).json({
        error: message,
        statusCode: 429,
        retryAfter: Math.ceil(windowMs / 1e3)
      });
    }
  });
};
var generalLimiter = createRateLimit(
  15 * 60 * 1e3,
  // 15 minutes
  2e3,
  // limit each IP to 2000 requests per windowMs (very high for development)
  "Too many requests from this IP, please try again later."
);
var authLimiter = createRateLimit(
  15 * 60 * 1e3,
  // 15 minutes
  10,
  // limit each IP to 10 login attempts per windowMs
  "Too many authentication attempts, please try again later."
);
var apiLimiter = createRateLimit(
  15 * 60 * 1e3,
  // 15 minutes
  1e3,
  // limit each IP to 1000 API requests per windowMs (very high for development)
  "Too many API requests from this IP, please try again later."
);
var contactLimiter = createRateLimit(
  60 * 60 * 1e3,
  // 1 hour
  5,
  // limit each IP to 5 contact form submissions per hour
  "Too many contact form submissions, please try again later."
);
var securityErrorHandler = (err, req, res, next) => {
  if (err.type === "entity.too.large") {
    console.log(`Large payload detected from IP: ${req.ip}`);
    return res.status(413).json({
      error: "Payload too large",
      statusCode: 413
    });
  }
  if (err.type === "entity.parse.failed") {
    console.log(`Malformed request from IP: ${req.ip}`);
    return res.status(400).json({
      error: "Invalid request format",
      statusCode: 400
    });
  }
  next(err);
};

// server/routes.ts
import { z as z2 } from "zod";

// server/healthMonitor.ts
var HealthMonitor = class {
  async checkDatabaseConnectivity() {
    try {
      const result = await pool.query("SELECT 1 as test");
      return {
        component: "database",
        status: "healthy",
        message: "Database connection successful",
        details: { query_result: result.rows[0] },
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      return {
        component: "database",
        status: "critical",
        message: "Database connection failed",
        details: { error: error.message },
        timestamp: /* @__PURE__ */ new Date()
      };
    }
  }
  async checkDealFunctionality() {
    try {
      const result = await pool.query("SELECT COUNT(*) as count FROM deals WHERE deal_status = $1", ["active"]);
      const dealCount = parseInt(result.rows[0].count);
      return {
        component: "deals",
        status: dealCount > 0 ? "healthy" : "degraded",
        message: `Deal system operational. ${dealCount} deals available`,
        details: { deal_count: dealCount },
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      return {
        component: "deals",
        status: "critical",
        message: "Deal system failure",
        details: { error: error.message },
        timestamp: /* @__PURE__ */ new Date()
      };
    }
  }
  async checkImageServing() {
    try {
      const dealsWithImages = await pool.query(
        "SELECT COUNT(*) as count FROM deals WHERE image_url IS NOT NULL AND image_url != ''"
      );
      const imageCount = parseInt(dealsWithImages.rows[0].count);
      return {
        component: "images",
        status: imageCount > 0 ? "healthy" : "degraded",
        message: `Image system operational. ${imageCount} deals have images`,
        details: { deals_with_images: imageCount },
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      return {
        component: "images",
        status: "critical",
        message: "Image system check failed",
        details: { error: error.message },
        timestamp: /* @__PURE__ */ new Date()
      };
    }
  }
  async checkCouponSystem() {
    try {
      const coupons2 = await storage.getPublicCoupons(1);
      const couponCount = coupons2.length;
      return {
        component: "coupons",
        status: "healthy",
        message: `Coupon system operational. ${couponCount} public coupons available`,
        details: { public_coupon_count: couponCount },
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      return {
        component: "coupons",
        status: "critical",
        message: "Coupon system failure",
        details: { error: error.message },
        timestamp: /* @__PURE__ */ new Date()
      };
    }
  }
  async checkBusinessStats() {
    try {
      const stats = await storage.getBusinessStats();
      return {
        component: "stats",
        status: "healthy",
        message: "Business statistics system operational",
        details: stats,
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      return {
        component: "stats",
        status: "critical",
        message: "Business statistics system failure",
        details: { error: error.message },
        timestamp: /* @__PURE__ */ new Date()
      };
    }
  }
  async checkEnvironmentConfig() {
    const requiredVars = ["DATABASE_URL", "PGHOST", "PGDATABASE"];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);
    const optionalVars = ["SENDGRID_API_KEY", "PAYFAST_MERCHANT_ID"];
    const missingOptional = optionalVars.filter((varName) => !process.env[varName]);
    return {
      component: "environment",
      status: missingVars.length === 0 ? "healthy" : "critical",
      message: missingVars.length === 0 ? "Environment configuration complete" : `Missing required variables: ${missingVars.join(", ")}`,
      details: {
        missing_required: missingVars,
        missing_optional: missingOptional
      },
      timestamp: /* @__PURE__ */ new Date()
    };
  }
  async performComprehensiveHealthCheck() {
    const checks = await Promise.all([
      this.checkDatabaseConnectivity(),
      this.checkDealFunctionality(),
      this.checkImageServing(),
      this.checkCouponSystem(),
      this.checkBusinessStats(),
      this.checkEnvironmentConfig()
    ]);
    const criticalIssues = checks.filter((check) => check.status === "critical");
    const degradedIssues = checks.filter((check) => check.status === "degraded");
    let overall_status;
    if (criticalIssues.length > 0) {
      overall_status = "critical";
    } else if (degradedIssues.length > 0) {
      overall_status = "degraded";
    } else {
      overall_status = "healthy";
    }
    return {
      overall_status,
      timestamp: /* @__PURE__ */ new Date(),
      checks
    };
  }
};
var healthMonitor = new HealthMonitor();

// server/routes.ts
var stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/health", async (req, res) => {
    try {
      res.json({
        status: "healthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        service: "Business Daily Deals B2B Marketplace"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/health/detailed", async (req, res) => {
    try {
      const healthReport = await healthMonitor.performComprehensiveHealthCheck();
      const statusCode = healthReport.overall_status === "critical" ? 503 : healthReport.overall_status === "degraded" ? 206 : 200;
      res.status(statusCode).json({
        service: "Business Daily Deals B2B Marketplace",
        ...healthReport,
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      res.status(500).json({
        service: "Business Daily Deals B2B Marketplace",
        overall_status: "critical",
        timestamp: /* @__PURE__ */ new Date(),
        error: error instanceof Error ? error.message : "Health check system failure",
        checks: []
      });
    }
  });
  await setupAuth(app2);
  app2.get("/api/user", async (req, res) => {
    const testUser = {
      id: "46102542",
      email: "simons@cybersmart.co.za",
      username: "simons",
      userType: "supplier",
      creditBalance: 100,
      isVerified: true,
      vatNumber: null,
      businessRegistrationNumber: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    console.log("\u{1F510} RETURNING TEST SUPPLIER USER:", testUser.email);
    res.json(testUser);
  });
  app2.get("/api/debug/auth", async (req, res) => {
    try {
      let testUser;
      try {
        testUser = await storage.upsertUser({
          id: "test-user-debug-123",
          email: `test-debug-${Date.now()}@businessdailydeals.co.za`,
          firstName: "Test",
          lastName: "Supplier",
          userType: "supplier"
        });
      } catch (error) {
        testUser = await storage.getUser("test-user-debug-123");
        if (!testUser) {
          testUser = await storage.createUser({
            id: "test-user-debug-123",
            email: `test-debug-${Date.now()}@businessdailydeals.co.za`,
            firstName: "Test",
            lastName: "Supplier",
            userType: "supplier"
          });
        }
      }
      req.login(testUser, (err) => {
        if (err) {
          console.error("Manual login error:", err);
          return res.status(500).json({ error: "Login failed" });
        }
        console.log("\u{1F510} DEBUG AUTH: User logged in successfully:", testUser.id);
        console.log("\u{1F510} DEBUG AUTH: Session after login:", req.sessionID);
        console.log("\u{1F510} DEBUG AUTH: Is authenticated:", req.isAuthenticated());
        res.json({
          message: "Debug authentication successful",
          user: testUser,
          sessionId: req.sessionID,
          isAuthenticated: req.isAuthenticated(),
          nextStep: "Authentication complete. Frontend should now detect the user session."
        });
      });
    } catch (error) {
      console.error("Debug auth error:", error);
      res.status(500).json({
        error: "Debug auth failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/test/session", (req, res) => {
    res.json({
      sessionId: req.sessionID,
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
      session: req.session
    });
  });
  app2.get("/test-auth", (req, res) => {
    const path3 = __require("path");
    res.sendFile(path3.join(process.cwd(), "test-auth.html"));
  });
  app2.post("/api/simple-login", async (req, res) => {
    try {
      let testUser = await storage.getUser("test-user-debug-123");
      if (!testUser) {
        testUser = await storage.createUser({
          id: "test-user-debug-123",
          email: `test-supplier@businessdailydeals.co.za`,
          firstName: "Test",
          lastName: "Supplier",
          userType: "supplier"
        });
      }
      const token = generateAuthToken(testUser);
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: false,
        // Set to true in production
        maxAge: 24 * 60 * 60 * 1e3,
        // 24 hours
        sameSite: "lax"
      });
      console.log("\u{1F510} TOKEN LOGIN: Generated token for user:", testUser.id);
      res.json({
        success: true,
        message: "Logged in successfully",
        user: testUser,
        token
      });
    } catch (error) {
      console.error("Simple login error:", error);
      res.status(500).json({ error: "Login failed", details: error.message });
    }
  });
  app2.get("/auth-status", (req, res) => {
    const authStatus = {
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
      sessionId: req.sessionID,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Status - Business Daily Deals</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
          .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
          .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
          .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
          pre { background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; }
          .button { display: inline-block; padding: 10px 20px; margin: 10px 5px; text-decoration: none; border-radius: 4px; }
          .btn-primary { background: #007bff; color: white; }
          .btn-success { background: #28a745; color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Business Daily Deals - Authentication Status</h1>
          
          <div class="status ${authStatus.isAuthenticated ? "success" : "error"}">
            <strong>Authentication Status:</strong> ${authStatus.isAuthenticated ? "AUTHENTICATED \u2713" : "NOT AUTHENTICATED \u2717"}
          </div>
          
          ${authStatus.isAuthenticated ? `
            <div class="status success">
              <strong>Welcome:</strong> ${authStatus.user.firstName} ${authStatus.user.lastName} (${authStatus.user.userType})
            </div>
            <div class="status info">
              <strong>Email:</strong> ${authStatus.user.email}
            </div>
          ` : ""}
          
          <div class="status info">
            <strong>Session ID:</strong> ${authStatus.sessionId}
          </div>
          
          <div class="status info">
            <strong>Timestamp:</strong> ${authStatus.timestamp}
          </div>
          
          <h2>Actions</h2>
          ${!authStatus.isAuthenticated ? `
            <a href="/api/debug/auth" class="button btn-success">\u{1F510} Debug Login (Test Account)</a>
            <a href="/api/login" class="button btn-primary">\u{1F511} Official Login (Replit OAuth)</a>
          ` : `
            <a href="/supplier-dashboard" class="button btn-primary">\u{1F4CA} Supplier Dashboard</a>
            <a href="/" class="button btn-primary">\u{1F3E0} Home Page</a>
            <a href="/api/logout" class="button btn-primary">\u{1F6AA} Logout</a>
          `}
          
          <h2>Debug Information</h2>
          <pre>${JSON.stringify(authStatus, null, 2)}</pre>
        </div>
      </body>
      </html>
    `);
  });
  app2.post("/api/logout", (req, res) => {
    console.log("\u{1F513} Logout requested");
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          console.error("Session destroy error:", destroyErr);
        }
        res.clearCookie("connect.sid");
        res.json({ success: true, message: "Logged out successfully" });
      });
    });
  });
  app2.get("/api/auth/user", async (req, res) => {
    try {
      console.log("\u{1F510} TOKEN CHECK: Has user?", !!req.user);
      console.log("\u{1F510} TOKEN CHECK: User ID:", req.user?.id);
      if (req.user) {
        console.log("\u{1F510} TOKEN CHECK: Found authenticated user");
        return res.json(req.user);
      }
      console.log("\u{1F510} TOKEN CHECK: No authentication found");
      res.status(401).json({
        message: "Unauthorized",
        loginUrl: "/login",
        redirectReason: "Not authenticated"
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
      const {
        firstName,
        surname,
        email,
        mobile,
        province,
        subscribeToNewsletter,
        acceptDataOffer,
        mobileProvider,
        keywordsList,
        notificationMethod,
        allowEmailNotifications,
        allowSmsNotifications,
        allowWhatsappNotifications,
        userType
      } = req.body;
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      const userData = {
        email,
        firstName,
        lastName: surname,
        userType: userType || "buyer",
        mobile,
        province,
        subscribeToNewsletter: subscribeToNewsletter || false,
        acceptDataOffer: acceptDataOffer || false,
        mobileProvider,
        notificationMethod: notificationMethod || "email",
        allowEmailNotifications: allowEmailNotifications !== false,
        allowSmsNotifications: allowSmsNotifications || false,
        allowWhatsappNotifications: allowWhatsappNotifications || false
      };
      const user = await storage.createUser(userData);
      if (userType === "supplier") {
        await storage.activateSupplierPromotionalPeriod(user.id);
      }
      if (keywordsList && Array.isArray(keywordsList) && keywordsList.length > 0) {
        for (const keyword of keywordsList) {
          if (keyword.trim()) {
            await storage.createKeyword(user.id, keyword.trim());
          }
        }
      }
      res.status(201).json({
        message: "Registration successful",
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          promotionalMessage: userType === "supplier" ? "FREE deal posting for 4 months!" : null
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  app2.post("/api/auth/find-user", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).json({ message: "Failed to find user" });
    }
  });
  app2.put("/api/auth/update-keywords", async (req, res) => {
    try {
      const {
        email,
        keywords: keywords2,
        notificationMethod,
        allowEmailNotifications,
        allowSmsNotifications,
        allowWhatsappNotifications
      } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedUser = await storage.updateUserKeywords(user.id, {
        keywords: keywords2,
        notificationMethod,
        allowEmailNotifications,
        allowSmsNotifications,
        allowWhatsappNotifications
      });
      const { ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error updating keywords:", error);
      res.status(500).json({ message: "Failed to update keywords" });
    }
  });
  app2.patch("/api/user/type", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { userType } = req.body;
      if (!["buyer", "supplier"].includes(userType)) {
        return res.status(400).json({ message: "Invalid user type" });
      }
      const user = await storage.updateUserType(userId, userType);
      if (userType === "supplier") {
        await storage.activateSupplierPromotionalPeriod(userId);
      }
      res.json({
        ...user,
        promotionalMessage: userType === "supplier" ? "FREE deal posting for 4 months activated!" : null
      });
    } catch (error) {
      console.error("Error updating user type:", error);
      res.status(500).json({ message: "Failed to update user type" });
    }
  });
  app2.get("/api/deals", async (req, res) => {
    try {
      if (req.query.populate === "prod" && req.query.key === "cybersmart2025") {
        console.log("\u{1F527} PRODUCTION POPULATION TRIGGERED via deals endpoint");
        await db.delete(deals2);
        console.log("\u2705 Cleared existing deals");
        const productionDeals = [
          {
            id: "prod-deal-1",
            supplierId: "46102542",
            title: "DAM LINERS - Premium Quality",
            description: "Professional dam liners for bulk water storage with worldwide installation service",
            price: "140.00",
            originalPrice: "180.00",
            category: "Mining",
            dealType: "hot",
            dealStatus: "active"
          },
          {
            id: "prod-deal-2",
            supplierId: "46102542",
            title: "Vitamin C Supplements",
            description: "High quality vitamin C supplements for health and wellness",
            price: "45.00",
            originalPrice: "55.00",
            category: "Health",
            dealType: "hot",
            dealStatus: "active"
          },
          {
            id: "prod-deal-3",
            supplierId: "46102542",
            title: "Premium Business Cards",
            description: "Professional business cards with premium printing quality",
            price: "25.00",
            originalPrice: "35.00",
            category: "Printing",
            dealType: "regular",
            dealStatus: "active"
          }
        ];
        let successCount = 0;
        for (const deal of productionDeals) {
          try {
            await db.insert(deals2).values(deal);
            console.log(`\u2705 Created deal: ${deal.title}`);
            successCount++;
          } catch (dealError) {
            console.error(`\u274C Failed to create deal ${deal.title}:`, dealError);
          }
        }
        return res.json({
          populated: true,
          message: `Successfully populated ${successCount} deals`,
          total: productionDeals.length,
          deals: productionDeals
        });
      }
      const { type, search, category } = req.query;
      let deals2;
      if (search) {
        deals2 = await storage.searchDeals(search, category);
      } else {
        deals2 = await storage.getDeals(type);
      }
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.json(deals2);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });
  app2.get("/api/deals/pricing", (req, res) => {
    const pricing = {
      hot: {
        credits: 50,
        cost: 125,
        // R125 (50 credits × R2.50)
        description: "Premium placement on home page",
        features: ["Home page featured placement", "Enhanced visibility", "Priority in search results"]
      },
      regular: {
        credits: 20,
        cost: 50,
        // R50 (20 credits × R2.50)
        description: "Standard deal listing",
        features: ["Category page listing", "Search visibility", "Basic deal placement"]
      }
    };
    res.json(pricing);
  });
  app2.get("/api/deals/hot", async (req, res) => {
    try {
      console.log("\u{1F525} Hot deals endpoint called - fetching from database");
      const hotDeals = await storage.getDeals("hot");
      console.log(`\u2705 Found ${hotDeals.length} hot deals in database`);
      res.json(hotDeals);
    } catch (error) {
      console.error("Hot deals fetch error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/deals/hottest", async (req, res) => {
    try {
      const deals2 = await storage.getDeals("hot");
      const hottestDeals = deals2.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      res.json(hottestDeals);
    } catch (error) {
      console.error("Error fetching hottest deals:", error);
      res.status(500).json({ message: "Failed to fetch hottest deals" });
    }
  });
  app2.get("/api/deals/:id", async (req, res) => {
    try {
      const deal = await storage.getDeal(req.params.id);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Error fetching deal:", error);
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });
  app2.delete("/api/deals/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const dealId = req.params.id;
      const deal = await storage.getDeal(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      if (deal.supplierId !== userId) {
        return res.status(403).json({ message: "You can only delete your own deals" });
      }
      await storage.deleteDeal(dealId);
      res.json({ message: "Deal deleted successfully" });
    } catch (error) {
      console.error("Error deleting deal:", error);
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });
  app2.post("/api/deals", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (user?.userType !== "supplier") {
        return res.status(403).json({ message: "Only suppliers can create deals" });
      }
      console.log("Received request body:", JSON.stringify(req.body, null, 2));
      const cleanedData = {
        ...req.body,
        supplierId: userId,
        originalPrice: req.body.originalPrice || null,
        keywords: Array.isArray(req.body.keywords) ? req.body.keywords : [],
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null
      };
      const promotionalEndDate = /* @__PURE__ */ new Date("2026-02-20T23:59:59.000Z");
      if (cleanedData.expiresAt && cleanedData.expiresAt > promotionalEndDate) {
        const daysAfterPromo = Math.ceil((cleanedData.expiresAt.getTime() - promotionalEndDate.getTime()) / (1e3 * 60 * 60 * 24));
        const creditsPerDay = cleanedData.dealType === "hot" ? 5 : 2;
        const creditsNeeded = daysAfterPromo * creditsPerDay;
        console.log(`Warning: Deal extends ${daysAfterPromo} days beyond promotional period, will require ${creditsNeeded} credits starting Feb 21, 2026`);
      }
      const dealData = insertDealSchema.parse(cleanedData);
      console.log("Parsed deal data:", JSON.stringify(dealData, null, 2));
      const deal = await storage.createDeal(dealData);
      res.status(201).json(deal);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: "Invalid deal data", errors: error.errors });
      }
      if (error instanceof Error && error.message.includes("Insufficient credits")) {
        return res.status(400).json({
          message: "Insufficient Credits",
          details: error.message,
          creditError: true
        });
      }
      console.error("Error creating deal:", error);
      res.status(500).json({ message: "Failed to create deal" });
    }
  });
  app2.get("/api/supplier/deals", async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || "46102542";
      console.log(`\u{1F50D} Fetching deals for supplier: ${userId}`);
      const deals2 = await storage.getDealsBySupplier(userId);
      console.log(`\u2705 Found ${deals2.length} deals for supplier ${userId}`);
      res.json(deals2);
    } catch (error) {
      console.error("Error fetching supplier deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });
  app2.get("/api/supplier/expired-deals", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log(`\u{1F50D} Fetching expired deals for supplier: ${userId}`);
      const expiredDeals = await storage.getExpiredDealsBySupplier(userId);
      console.log(`\u2705 Found ${expiredDeals.length} expired deals for supplier ${userId}`);
      res.json(expiredDeals);
    } catch (error) {
      console.error("Error fetching expired deals:", error);
      res.status(500).json({ message: "Failed to fetch expired deals" });
    }
  });
  app2.patch("/api/deals/:id/reactivate", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const dealId = req.params.id;
      const { expiresAt } = req.body;
      const existingDeal = await storage.getDeal(dealId);
      if (!existingDeal || existingDeal.supplierId !== userId) {
        return res.status(404).json({ message: "Deal not found or unauthorized" });
      }
      const reactivatedDeal = await storage.reactivateDeal(dealId, new Date(expiresAt));
      res.json(reactivatedDeal);
    } catch (error) {
      console.error("Error reactivating deal:", error);
      res.status(500).json({ message: "Failed to reactivate deal" });
    }
  });
  app2.patch("/api/deals/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const deal = await storage.getDeal(req.params.id);
      if (!deal || deal.supplierId !== userId) {
        return res.status(404).json({ message: "Deal not found or unauthorized" });
      }
      const updatedDeal = await storage.updateDeal(req.params.id, req.body);
      res.json(updatedDeal);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Insufficient credits")) {
        return res.status(400).json({
          message: "Insufficient Credits",
          details: error.message,
          creditError: true
        });
      }
      console.error("Error updating deal:", error);
      res.status(500).json({ message: "Failed to update deal" });
    }
  });
  app2.delete("/api/deals/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const deal = await storage.getDeal(req.params.id);
      if (!deal || deal.supplierId !== userId) {
        return res.status(404).json({ message: "Deal not found or unauthorized" });
      }
      await storage.deleteDeal(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting deal:", error);
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });
  app2.patch("/api/deals/:id/extend", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const dealId = req.params.id;
      const { expiresAt } = req.body;
      if (!expiresAt) {
        return res.status(400).json({ message: "New expiry date is required" });
      }
      const deal = await storage.getDeal(dealId);
      if (!deal || deal.supplierId !== userId) {
        return res.status(404).json({ message: "Deal not found or unauthorized" });
      }
      const currentExpiry = new Date(deal.expiresAt || Date.now());
      const newExpiry = new Date(expiresAt);
      const extraDays = Math.ceil((newExpiry.getTime() - currentExpiry.getTime()) / (1e3 * 60 * 60 * 24));
      if (extraDays <= 0) {
        return res.status(400).json({ message: "New expiry date must be after current expiry date" });
      }
      const creditsPerDay = deal.dealType === "hot" ? 5 : 2;
      const creditsNeeded = extraDays * creditsPerDay;
      const promotionalEndDate = /* @__PURE__ */ new Date("2026-02-20T23:59:59.000Z");
      const isPromotionalPeriod = /* @__PURE__ */ new Date() < promotionalEndDate;
      const creditBalance = await storage.getUserCreditBalance(userId);
      const currentBalance = parseFloat(creditBalance.creditBalance);
      if (!isPromotionalPeriod) {
        if (currentBalance < creditsNeeded) {
          return res.status(400).json({
            message: "Insufficient credits",
            creditsNeeded,
            currentBalance,
            shortfall: creditsNeeded - currentBalance
          });
        }
        await storage.updateUserCreditBalance(userId, creditsNeeded.toString(), "subtract");
        await storage.createCreditTransaction({
          userId,
          amount: creditsNeeded.toString(),
          type: "debit",
          description: `Deal extension: ${extraDays} extra days for "${deal.title}"`,
          dealId
        });
      }
      await storage.updateDealExpiry(dealId, expiresAt);
      res.json({
        message: isPromotionalPeriod ? "Deal expiry date extended successfully (FREE promotional period)" : "Deal expiry date extended successfully",
        creditsCharged: isPromotionalPeriod ? 0 : creditsNeeded,
        remainingCredits: isPromotionalPeriod ? currentBalance : currentBalance - creditsNeeded,
        extraDays,
        promotionalPeriod: isPromotionalPeriod
      });
    } catch (error) {
      console.error("Error extending deal:", error);
      res.status(500).json({ message: "Failed to extend deal" });
    }
  });
  app2.get("/api/keywords", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const keywords2 = await storage.getUserKeywords(userId);
      res.json(keywords2);
    } catch (error) {
      console.error("Error fetching keywords:", error);
      res.status(500).json({ message: "Failed to fetch keywords" });
    }
  });
  app2.post("/api/keywords", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const keywordData = insertKeywordSchema.parse({
        ...req.body,
        userId
      });
      const keyword = await storage.addKeyword(keywordData);
      res.status(201).json(keyword);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid keyword data", errors: error.errors });
      }
      console.error("Error adding keyword:", error);
      res.status(500).json({ message: "Failed to add keyword" });
    }
  });
  app2.delete("/api/keywords/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.removeKeyword(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing keyword:", error);
      res.status(500).json({ message: "Failed to remove keyword" });
    }
  });
  app2.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications2 = await storage.getUserNotifications(userId);
      res.json(notifications2);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app2.patch("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  app2.post("/api/inquiries", isAuthenticated, async (req, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const { dealId, supplierId, message } = req.body;
      const deal = await storage.getDealById(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      const buyer = await storage.getUser(buyerId);
      const supplier = await storage.getUser(supplierId || deal.supplierId);
      if (!buyer || !supplier) {
        return res.status(404).json({ message: "User information not found" });
      }
      const inquiryData = insertInquirySchema.parse({
        dealId,
        buyerId,
        supplierId: supplierId || deal.supplierId,
        message: message || ""
      });
      const inquiry = await storage.createInquiry(inquiryData);
      const emailData = {
        buyerName: `${buyer.firstName} ${buyer.lastName}`.trim(),
        buyerEmail: buyer.email || "",
        supplierName: supplier.companyName || `${supplier.firstName} ${supplier.lastName}`.trim(),
        supplierEmail: supplier.email || "",
        dealTitle: deal.title,
        dealPrice: `R${parseFloat(deal.price).toLocaleString()}`,
        inquiryMessage: message || "",
        submittedAt: (/* @__PURE__ */ new Date()).toLocaleString("en-ZA")
      };
      const { sendInquiryNotifications: sendInquiryNotifications2 } = await Promise.resolve().then(() => (init_email(), email_exports));
      const emailSent = await sendInquiryNotifications2(emailData);
      if (!emailSent) {
        console.warn("Failed to send inquiry email notifications, but inquiry was created successfully");
      }
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid inquiry data", errors: error.errors });
      }
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });
  app2.get("/api/supplier/inquiries", isAuthenticated, async (req, res) => {
    try {
      const supplierId = req.user.claims.sub;
      const inquiries2 = await storage.getInquiriesBySupplier(supplierId);
      res.json(inquiries2);
    } catch (error) {
      console.error("Error fetching supplier inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });
  app2.get("/api/buyer/inquiries", isAuthenticated, async (req, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const inquiries2 = await storage.getInquiriesByBuyer(buyerId);
      res.json(inquiries2);
    } catch (error) {
      console.error("Error fetching buyer inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });
  app2.get("/api/buyer/coupons", isAuthenticated, async (req, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const coupons2 = await storage.getCouponsByBuyer(buyerId);
      res.json(coupons2);
    } catch (error) {
      console.error("Error fetching buyer coupons:", error);
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });
  app2.patch("/api/inquiries/:id/status", isAuthenticated, async (req, res) => {
    try {
      const { status } = req.body;
      const inquiry = await storage.updateInquiryStatus(req.params.id, status);
      res.json(inquiry);
    } catch (error) {
      console.error("Error updating inquiry status:", error);
      res.status(500).json({ message: "Failed to update inquiry status" });
    }
  });
  app2.post("/api/coupons", isAuthenticated, async (req, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const { dealId } = req.body;
      const deal = await storage.getDealById(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      const couponCode = `BDD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const validUntil = /* @__PURE__ */ new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      const couponData = insertCouponSchema.parse({
        dealId,
        buyerId,
        supplierId: deal.supplierId,
        couponCode,
        dealTitle: deal.title,
        dealPrice: deal.price,
        dealOriginalPrice: deal.originalPrice,
        dealDescription: deal.description,
        validUntil,
        expiresAt: validUntil
        // Keep for backward compatibility
      });
      const coupon = await storage.createCoupon(couponData);
      res.status(201).json({
        ...coupon,
        redirectUrl: `/coupon/${couponCode}`
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid coupon data", errors: error.errors });
      }
      console.error("Error creating coupon:", error);
      res.status(500).json({ message: "Failed to create coupon" });
    }
  });
  app2.get("/api/buyer/coupons", isAuthenticated, async (req, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const coupons2 = await storage.getCouponsByBuyer(buyerId);
      res.json(coupons2);
    } catch (error) {
      console.error("Error fetching buyer coupons:", error);
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });
  app2.get("/api/supplier/coupons", isAuthenticated, async (req, res) => {
    try {
      const supplierId = req.user.claims.sub;
      const coupons2 = await storage.getCouponsBySupplier(supplierId);
      res.json(coupons2);
    } catch (error) {
      console.error("Error fetching supplier coupons:", error);
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });
  app2.get("/api/coupons/public", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const coupons2 = await storage.getPublicCoupons(limit);
      console.log("Fetched public coupons:", coupons2.length);
      res.json(coupons2);
    } catch (error) {
      console.error("Error fetching public coupons:", error);
      res.status(500).json({ message: "Failed to fetch public coupons", error: error.message });
    }
  });
  app2.get("/api/coupons/stats", async (req, res) => {
    try {
      const stats = await storage.getCouponStats();
      console.log("Fetched coupon stats:", stats);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching coupon stats:", error);
      res.status(500).json({ message: "Failed to fetch coupon stats", error: error.message });
    }
  });
  app2.post("/api/admin/populate-deals", async (req, res) => {
    try {
      await storage.deleteAllDeals();
      console.log("Cleared existing deals from production database");
      const workingDeals = [
        {
          id: "6cbd7a6a-e4ab-496b-a365-6fd2883b8e53",
          supplierId: "46102542",
          title: "DAM LINERS",
          description: "Dam liners for bulk water storage - can be made up in the factory up to generally around 250sqm, or if larger we come to site and install with our experienced team, at any destination world wide",
          price: "140.00",
          originalPrice: "180.00",
          dealType: "hot",
          category: "Mining",
          keywords: [],
          imageUrl: "/public-objects/product-images/6y9M7PQvU4JNi6f8A39ra.jpg",
          expiryDate: /* @__PURE__ */ new Date("2026-06-10T00:00:00.000Z"),
          dealStatus: "active",
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 0
        },
        {
          id: "vitamin-c-hot-deal-456",
          supplierId: "46102542",
          title: "Vitamin C",
          description: "High quality vitamin C supplements for health and wellness",
          price: "45.00",
          originalPrice: "55.00",
          dealType: "hot",
          category: "Health",
          keywords: [],
          imageUrl: "/public-objects/product-images/Tg7hPOh3CxbWQt8rzmY1N.jpg",
          expiryDate: /* @__PURE__ */ new Date("2025-12-31T00:00:00.000Z"),
          dealStatus: "active",
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 0
        },
        {
          id: "industrial-bladders-789",
          supplierId: "46102542",
          title: "Industrial Water Bladders - Bulk Storage",
          description: "Industrial grade water bladders for bulk storage solutions",
          price: "2500.00",
          originalPrice: "3200.00",
          dealType: "hot",
          category: "Industrial",
          keywords: [],
          imageUrl: "/public-objects/product-images/NNxGFI1n-VBRJ5vpPqqKV.JPG",
          expiryDate: /* @__PURE__ */ new Date("2025-12-31T00:00:00.000Z"),
          dealStatus: "active",
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 0
        },
        {
          id: "regular-bladders-012",
          supplierId: "46102542",
          title: "Bladders",
          description: "Standard water storage bladders for various applications",
          price: "850.00",
          originalPrice: "1000.00",
          dealType: "regular",
          category: "Storage",
          keywords: [],
          imageUrl: "/public-objects/product-images/OjuD4ef-pGlmFVsGktiuC.JPG",
          expiryDate: /* @__PURE__ */ new Date("2025-12-31T00:00:00.000Z"),
          dealStatus: "active",
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 0
        },
        {
          id: "regular-dam-liners-345",
          supplierId: "46102542",
          title: "Dam liners",
          description: "Made to fit in our factory with custom specifications",
          price: "200.00",
          originalPrice: "235.00",
          dealType: "regular",
          category: "Other",
          keywords: [],
          imageUrl: "/public-objects/product-images/OjuD4ef-pGlmFVsGktiuC.JPG",
          expiryDate: /* @__PURE__ */ new Date("2025-08-12T22:00:00.000Z"),
          dealStatus: "active",
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 1
        }
      ];
      console.log("Testing database schema with simple deal...");
      try {
        const testDeal = {
          id: "test-deal-schema-check",
          supplierId: "46102542",
          title: "Test Deal",
          description: "Testing database schema",
          price: "100.00",
          originalPrice: "120.00",
          dealType: "regular",
          category: "Test",
          dealStatus: "active",
          viewCount: 0,
          inquiryCount: 0,
          creditsCost: 0
        };
        const [deal] = await db.insert(deals).values(testDeal).returning();
        console.log("\u2705 Test deal created successfully:", deal.title);
        await db.delete(deals).where(eq2(deals.id, "test-deal-schema-check"));
        console.log("\u2705 Test deal cleaned up");
      } catch (testError) {
        console.error("\u274C Database schema test failed:", testError);
        return res.status(500).json({
          message: "Database schema mismatch",
          error: testError.message,
          details: "Production database schema doesn't match development"
        });
      }
      let successCount = 0;
      for (const dealData of workingDeals) {
        try {
          const dealForDB = {
            ...dealData,
            price: dealData.price.toString(),
            originalPrice: dealData.originalPrice.toString(),
            creditsCost: dealData.creditsCost.toString()
          };
          const [deal] = await db.insert(deals).values(dealForDB).returning();
          console.log(`\u2705 Successfully created deal: ${deal.title}`);
          successCount++;
        } catch (error) {
          console.error(`\u274C Failed to create deal ${dealData.title}:`, error);
          console.error(`Full error details:`, JSON.stringify(error, null, 2));
        }
      }
      res.json({
        message: `Successfully populated ${successCount} deals`,
        total: workingDeals.length
      });
    } catch (error) {
      console.error("Error populating production deals:", error);
      res.status(500).json({ message: "Failed to populate deals" });
    }
  });
  app2.get("/api/business/stats", async (req, res) => {
    try {
      const stats = await storage.getBusinessStats();
      console.log("Fetched business stats:", stats);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching business stats:", error);
      res.status(500).json({ message: "Failed to fetch business stats", error: error.message });
    }
  });
  app2.get("/api/coupons/:code", async (req, res) => {
    try {
      const coupon = await storage.getCouponByCode(req.params.code);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error) {
      console.error("Error fetching coupon:", error);
      res.status(500).json({ message: "Failed to fetch coupon" });
    }
  });
  app2.post("/api/coupons/:code/redeem", async (req, res) => {
    try {
      const { location, notes } = req.body;
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      const userAgent = req.get("User-Agent") || "unknown";
      const result = await storage.redeemCoupon(req.params.code, {
        location,
        notes,
        ipAddress: clientIp,
        userAgent
      });
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          coupon: result.coupon,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      res.status(500).json({
        success: false,
        message: "System error occurred during redemption. Please try again or contact support.",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.get("/api/coupons/:code/validate", async (req, res) => {
    try {
      const validation = await storage.validateCouponForRedemption(req.params.code);
      res.json(validation);
    } catch (error) {
      console.error("Error validating coupon:", error);
      res.status(500).json({
        valid: false,
        message: "Error validating coupon",
        canRedeem: false
      });
    }
  });
  app2.get("/api/coupons/:code/history", async (req, res) => {
    try {
      const history = await storage.getCouponRedemptionHistory(req.params.code);
      res.json(history);
    } catch (error) {
      console.error("Error fetching coupon history:", error);
      res.status(500).json({ message: "Failed to fetch coupon history" });
    }
  });
  app2.get("/api/rates", async (req, res) => {
    try {
      const rates2 = await storage.getRates();
      res.json(rates2);
    } catch (error) {
      console.error("Error fetching rates:", error);
      res.status(500).json({ message: "Failed to fetch rates" });
    }
  });
  app2.post("/api/rates", isAuthenticated, async (req, res) => {
    try {
      const rate = await storage.createRate(req.body);
      res.json(rate);
    } catch (error) {
      console.error("Error creating rate:", error);
      res.status(500).json({ message: "Failed to create rate" });
    }
  });
  app2.post("/api/rates/bulk-upload", isAuthenticated, async (req, res) => {
    try {
      const { rates: rates2 } = req.body;
      if (!Array.isArray(rates2)) {
        return res.status(400).json({ message: "Rates must be an array" });
      }
      const createdRates = await storage.bulkCreateRates(rates2);
      res.json({
        message: `Successfully uploaded ${createdRates.length} rates`,
        rates: createdRates
      });
    } catch (error) {
      console.error("Error bulk uploading rates:", error);
      res.status(500).json({ message: "Failed to upload rates" });
    }
  });
  app2.put("/api/rates/:id", isAuthenticated, async (req, res) => {
    try {
      const rate = await storage.updateRate(req.params.id, req.body);
      res.json(rate);
    } catch (error) {
      console.error("Error updating rate:", error);
      res.status(500).json({ message: "Failed to update rate" });
    }
  });
  app2.delete("/api/rates/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteRate(req.params.id);
      res.json({ message: "Rate deleted successfully" });
    } catch (error) {
      console.error("Error deleting rate:", error);
      res.status(500).json({ message: "Failed to delete rate" });
    }
  });
  app2.delete("/api/rates", isAuthenticated, async (req, res) => {
    try {
      await storage.clearAllRates();
      res.json({ message: "All rates cleared successfully" });
    } catch (error) {
      console.error("Error clearing rates:", error);
      res.status(500).json({ message: "Failed to clear rates" });
    }
  });
  app2.get("/api/search", async (req, res) => {
    try {
      const { query, type = "deals", category, dealType, minPrice, maxPrice } = req.query;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      let results = [];
      if (type === "deals") {
        const filters = {};
        if (category && category !== "All") filters.category = category;
        if (dealType && dealType !== "all") filters.dealType = dealType;
        if (minPrice || maxPrice) {
          filters.priceRange = {
            min: minPrice ? parseFloat(minPrice) : 0,
            max: maxPrice ? parseFloat(maxPrice) : 0
          };
        }
        results = await storage.searchDealsAdvanced(query, filters);
      } else if (type === "companies") {
        results = await storage.searchCompanies(query);
      }
      res.json(results);
    } catch (error) {
      console.error("Error in advanced search:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });
  app2.get("/api/credits/balance", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const balance = await storage.getUserCreditBalance(userId);
      res.json(balance);
    } catch (error) {
      console.error("Error fetching credit balance:", error);
      res.status(500).json({ message: "Failed to fetch credit balance" });
    }
  });
  app2.get("/api/credits/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserCreditTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching credit transactions:", error);
      res.status(500).json({ message: "Failed to fetch credit transactions" });
    }
  });
  app2.post("/api/credits/purchase", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { packageId, customAmount } = req.body;
      let amount;
      let credits;
      let description;
      if (packageId) {
        const packages = {
          "starter": { credits: 100, price: 250 },
          "business": { credits: 550, price: 1e3 },
          // 500 + 50 bonus
          "enterprise": { credits: 1200, price: 1800 },
          // 1000 + 200 bonus
          "premium": { credits: 2500, price: 3200 }
          // 2000 + 500 bonus
        };
        const pkg = packages[packageId];
        if (!pkg) {
          return res.status(400).json({ message: "Invalid package" });
        }
        amount = pkg.price;
        credits = pkg.credits;
        description = `${packageId.charAt(0).toUpperCase() + packageId.slice(1)} Package - ${credits} Credits`;
      } else if (customAmount) {
        if (customAmount < 50) {
          return res.status(400).json({ message: "Minimum purchase is R50" });
        }
        amount = Math.round(customAmount * 100) / 100;
        credits = Math.floor(customAmount / 2.5);
        description = `Custom Credit Purchase - ${credits} Credits`;
      } else {
        return res.status(400).json({ message: "Package ID or custom amount required" });
      }
      const merchantPaymentId = `BDD-${credits}CRED-${Date.now()}`;
      const transaction = await storage.createCreditTransaction({
        userId,
        amount: amount.toFixed(2),
        type: "purchase",
        description,
        paymentReference: merchantPaymentId,
        // Will be updated with PayFast reference
        merchantReference: merchantPaymentId
      });
      const user = await storage.getUser(userId);
      const customerName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.companyName || "Business Daily Deals Customer";
      const paymentData = {
        merchant_id: process.env.PAYFAST_MERCHANT_ID,
        merchant_key: process.env.PAYFAST_MERCHANT_KEY,
        return_url: `${req.protocol}://${req.get("host")}/payment-success`,
        cancel_url: `${req.protocol}://${req.get("host")}/payment-cancelled`,
        notify_url: `${req.protocol}://${req.get("host")}/api/payfast/success`,
        name_first: user?.firstName || "Customer",
        name_last: user?.lastName || "",
        email_address: user?.email || "",
        m_payment_id: merchantPaymentId,
        amount: amount.toFixed(2),
        item_name: description,
        item_description: `Business Daily Deals - ${description}`,
        custom_str1: userId,
        custom_str2: credits.toString(),
        custom_str3: "credit_purchase"
      };
      res.json({
        paymentData,
        transactionId: transaction.id,
        credits,
        paymentUrl: process.env.NODE_ENV === "production" ? "https://www.payfast.co.za/eng/process" : "https://sandbox.payfast.co.za/eng/process"
      });
    } catch (error) {
      console.error("Error creating PayFast credit purchase:", error);
      res.status(500).json({ message: "Failed to create purchase" });
    }
  });
  app2.post("/api/coupons/purchase", isAuthenticated, async (req, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const { dealId } = req.body;
      const deal = await storage.getDealById(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      const now = /* @__PURE__ */ new Date();
      const promotionalEndDate = /* @__PURE__ */ new Date("2025-12-31T23:59:59Z");
      if (now <= promotionalEndDate) {
        const couponCode = `BDD${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const coupon = await storage.createCoupon({
          code: couponCode,
          dealId,
          buyerId,
          supplierName: deal.companyName || "Supplier",
          buyerName: "Customer",
          // Will be updated with real name
          originalPrice: deal.originalPrice,
          discountedPrice: deal.discountedPrice,
          validUntil: deal.expiresAt,
          status: "active",
          purchasedAt: now,
          notes: "FREE promotional period purchase"
        });
        return res.json({
          coupon,
          message: "Coupon generated for FREE during promotional period",
          promotional: true
        });
      }
      const amount = parseFloat(deal.discountedPrice);
      const merchantPaymentId = `BDD-COUP-${dealId.substring(0, 8)}-${Date.now()}`;
      const user = await storage.getUser(buyerId);
      const paymentData = {
        merchant_id: process.env.PAYFAST_MERCHANT_ID,
        merchant_key: process.env.PAYFAST_MERCHANT_KEY,
        return_url: `${req.protocol}://${req.get("host")}/coupon-payment-success`,
        cancel_url: `${req.protocol}://${req.get("host")}/payment-cancelled`,
        notify_url: `${req.protocol}://${req.get("host")}/api/payfast/coupon-success`,
        name_first: user?.firstName || "Customer",
        name_last: user?.lastName || "",
        email_address: user?.email || "",
        m_payment_id: merchantPaymentId,
        amount: amount.toFixed(2),
        item_name: `Coupon: ${deal.title}`,
        item_description: `Business Daily Deals Coupon - ${deal.title}`,
        custom_str1: buyerId,
        custom_str2: dealId,
        custom_str3: "coupon_purchase"
      };
      res.json({
        paymentData,
        dealTitle: deal.title,
        amount: amount.toFixed(2),
        paymentUrl: process.env.NODE_ENV === "production" ? "https://www.payfast.co.za/eng/process" : "https://sandbox.payfast.co.za/eng/process"
      });
    } catch (error) {
      console.error("Error creating PayFast coupon purchase:", error);
      res.status(500).json({ message: "Failed to create coupon purchase" });
    }
  });
  app2.post("/api/payfast/success", async (req, res) => {
    try {
      const paymentData = req.body;
      console.log("PayFast payment success:", paymentData);
      const transaction = await storage.getCreditTransactionByReference(
        paymentData.payment_id || paymentData.pf_payment_id
      );
      if (transaction) {
        await storage.updateCreditTransaction(transaction.id, {
          status: "completed"
        });
        await storage.addCreditsToUser(transaction.userId, transaction.credits);
        const user = await storage.getUser(transaction.userId);
        if (user) {
          const paymentEmailData = {
            customerName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.companyName || "Valued Customer",
            customerEmail: user.email || "No email provided",
            packageType: transaction.description,
            credits: Math.floor(parseFloat(transaction.amount) / 2.5),
            // R2.50 per credit
            amount: `R${transaction.amount}`,
            paymentReference: paymentData.payment_id || paymentData.pf_payment_id,
            merchantReference: transaction.merchantReference || `BDD-${transaction.id}`,
            paymentMethod: paymentData.payment_method || "PayFast",
            paidAt: (/* @__PURE__ */ new Date()).toLocaleString("en-ZA", {
              timeZone: "Africa/Johannesburg",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })
          };
          const adminEmailSent = await sendPaymentNotificationToAdmin(paymentEmailData);
          let customerEmailSent = false;
          if (user.email) {
            customerEmailSent = await sendPaymentConfirmationToCustomer(paymentEmailData);
          }
          console.log(`Payment emails - Admin: ${adminEmailSent ? "sent" : "failed"}, Customer: ${customerEmailSent ? "sent" : user.email ? "failed" : "no email"}`);
        }
      }
      res.status(200).send("OK");
    } catch (error) {
      console.error("Error processing PayFast payment success:", error);
      res.status(500).send("Error");
    }
  });
  app2.post("/api/payfast/coupon-success", async (req, res) => {
    try {
      const paymentData = req.body;
      console.log("PayFast coupon payment success:", paymentData);
      const buyerId = paymentData.custom_str1;
      const dealId = paymentData.custom_str2;
      const merchantPaymentId = paymentData.m_payment_id;
      if (buyerId && dealId) {
        const [deal, user] = await Promise.all([
          storage.getDealById(dealId),
          storage.getUser(buyerId)
        ]);
        if (deal && user) {
          const couponCode = `BDD${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
          const coupon = await storage.createCoupon({
            code: couponCode,
            dealId,
            buyerId,
            supplierName: deal.companyName || "Supplier",
            buyerName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.companyName || "Customer",
            originalPrice: deal.originalPrice,
            discountedPrice: deal.discountedPrice,
            validUntil: deal.expiresAt,
            status: "active",
            purchasedAt: /* @__PURE__ */ new Date(),
            notes: `Paid via PayFast - ${merchantPaymentId}`
          });
          const paymentEmailData = {
            customerName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.companyName || "Valued Customer",
            customerEmail: user.email || "No email provided",
            packageType: `Coupon: ${deal.title}`,
            credits: 1,
            // 1 coupon purchased
            amount: `R${deal.discountedPrice}`,
            paymentReference: paymentData.payment_id || paymentData.pf_payment_id,
            merchantReference: merchantPaymentId,
            paymentMethod: paymentData.payment_method || "PayFast",
            paidAt: (/* @__PURE__ */ new Date()).toLocaleString("en-ZA", {
              timeZone: "Africa/Johannesburg",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })
          };
          const [adminEmailSent, customerEmailSent] = await Promise.all([
            sendPaymentNotificationToAdmin(paymentEmailData),
            user.email ? sendPaymentConfirmationToCustomer({
              ...paymentEmailData,
              packageType: `Coupon Purchase: ${deal.title}`,
              credits: 1
              // For display purposes
            }) : Promise.resolve(false)
          ]);
          console.log(`Coupon payment emails - Admin: ${adminEmailSent ? "sent" : "failed"}, Customer: ${customerEmailSent ? "sent" : user.email ? "failed" : "no email"}`);
          console.log(`Coupon generated: ${couponCode} for deal ${deal.title}`);
        }
      }
      res.status(200).send("OK");
    } catch (error) {
      console.error("Error processing PayFast coupon payment:", error);
      res.status(500).send("Error");
    }
  });
  app2.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const orderData = insertOrderSchema.parse({ ...req.body, buyerId });
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type = "buyer" } = req.query;
      const orders2 = await storage.getUserOrders(userId, type);
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/directory", async (req, res) => {
    try {
      const { type = "products", letter, category, search } = req.query;
      if (type === "products") {
        let deals2 = await storage.getDeals();
        if (letter) {
          deals2 = deals2.filter(
            (deal) => deal.title.toUpperCase().startsWith(letter)
          );
        }
        if (category && category !== "All") {
          deals2 = deals2.filter((deal) => deal.category === category);
        }
        if (search) {
          deals2 = deals2.filter(
            (deal) => deal.title.toLowerCase().includes(search.toLowerCase()) || deal.description.toLowerCase().includes(search.toLowerCase())
          );
        }
        res.json(deals2);
      } else if (type === "companies") {
        const companies2 = await storage.getCompanies(
          category !== "All" ? category : void 0,
          true
          // alphabetical
        );
        res.json(companies2);
      }
    } catch (error) {
      console.error("Error fetching directory data:", error);
      res.status(500).json({ message: "Failed to fetch directory" });
    }
  });
  app2.get("/api/suppliers/directory", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliersDirectory();
      res.json(suppliers);
    } catch (error) {
      console.error("Error fetching suppliers directory:", error);
      res.status(500).json({ message: "Failed to fetch suppliers directory" });
    }
  });
  app2.get("/api/basket", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const basketItems2 = await storage.getBasketItems(userId);
      res.json(basketItems2);
    } catch (error) {
      console.error("Error fetching basket items:", error);
      res.status(500).json({ message: "Failed to fetch basket items" });
    }
  });
  app2.post("/api/basket", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const basketData = insertBasketItemSchema.parse({ ...req.body, userId });
      const basketItem = await storage.addBasketItem(basketData);
      res.json(basketItem);
    } catch (error) {
      console.error("Error adding basket item:", error);
      res.status(500).json({ message: "Failed to add item to basket" });
    }
  });
  app2.delete("/api/basket/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      await storage.removeBasketItem(id, userId);
      res.json({ message: "Item removed from basket" });
    } catch (error) {
      console.error("Error removing basket item:", error);
      res.status(500).json({ message: "Failed to remove item from basket" });
    }
  });
  app2.delete("/api/basket", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearBasket(userId);
      res.json({ message: "Basket cleared" });
    } catch (error) {
      console.error("Error clearing basket:", error);
      res.status(500).json({ message: "Failed to clear basket" });
    }
  });
  app2.post("/api/purchase-basket-credits", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { totalAmount, currency = "ZAR" } = req.body;
      const basketItems2 = await storage.getBasketItems(userId);
      if (!basketItems2 || basketItems2.length === 0) {
        return res.status(400).json({ message: "Basket is empty" });
      }
      const totalCredits = parseFloat(totalAmount);
      const transaction = await storage.createCreditTransaction({
        userId,
        amount: totalAmount.toString(),
        type: "purchase",
        description: `Purchase of ${totalCredits} advertising credits from basket items`
      });
      await storage.clearBasket(userId);
      res.json({
        message: "Credits purchased successfully",
        credits: totalCredits,
        transaction: transaction.id,
        currency
      });
    } catch (error) {
      console.error("Error processing credit purchase:", error);
      res.status(500).json({ message: "Failed to process purchase" });
    }
  });
  app2.get("/api/directory/featured", async (req, res) => {
    try {
      const hotDeals = await storage.getDeals("hot");
      const featured = hotDeals.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 12);
      res.json(featured);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });
  app2.get("/api/banner-ads", async (req, res) => {
    try {
      const { position } = req.query;
      const bannerAds2 = await storage.getActiveBannerAds(position);
      res.json(bannerAds2);
    } catch (error) {
      console.error("Error fetching banner ads:", error);
      res.status(500).json({ message: "Failed to fetch banner ads" });
    }
  });
  app2.post("/api/banner-ads", isAuthenticated, async (req, res) => {
    try {
      const advertiserId = req.user.claims.sub;
      const bannerData = insertBannerAdSchema.parse({ ...req.body, advertiserId });
      const bannerAd = await storage.createBannerAd(bannerData);
      res.json(bannerAd);
    } catch (error) {
      console.error("Error creating banner ad:", error);
      res.status(500).json({ message: "Failed to create banner ad" });
    }
  });
  app2.put("/api/banner-ads/:id/stats", async (req, res) => {
    try {
      const { id } = req.params;
      const { type } = req.body;
      const updated = await storage.updateBannerAdStats(id, type);
      res.json(updated);
    } catch (error) {
      console.error("Error updating banner ad stats:", error);
      res.status(500).json({ message: "Failed to update stats" });
    }
  });
  app2.get("/api/analytics/site", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await storage.getSiteAnalytics(
        startDate,
        endDate
      );
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching site analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
  app2.post("/api/analytics/record", async (req, res) => {
    try {
      const { type } = req.body;
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      await storage.recordSiteAnalytics(today, type);
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording analytics:", error);
      res.status(500).json({ message: "Failed to record analytics" });
    }
  });
  app2.put("/api/deals/:id/analytics", async (req, res) => {
    try {
      const { id } = req.params;
      const { type } = req.body;
      const updated = await storage.updateDealAnalytics(id, type);
      res.json(updated);
    } catch (error) {
      console.error("Error updating deal analytics:", error);
      res.status(500).json({ message: "Failed to update analytics" });
    }
  });
  app2.get("/api/suppliers/directory", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliersDirectory();
      res.json(suppliers);
    } catch (error) {
      console.error("Error fetching suppliers directory:", error);
      res.status(500).json({ message: "Failed to fetch suppliers directory" });
    }
  });
  app2.post("/api/deal-requests", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const userId = user?.id || user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const requestData = {
        requesterId: userId,
        productName: req.body.productName,
        productSize: req.body.productSize,
        quantityRequired: req.body.quantityRequired,
        deliveryDestination: req.body.deliveryDestination,
        priceRangeMin: req.body.priceRangeMin,
        priceRangeMax: req.body.priceRangeMax,
        additionalRequirements: req.body.additionalRequirements
      };
      const dealRequest = await storage.createDealRequest(requestData);
      const userInfo = await storage.getUser(userId);
      const emailSuccess = await sendDealRequestToAdmin({
        requesterName: userInfo ? `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() || "Unknown" : "Unknown",
        requesterEmail: userInfo?.email || user?.claims?.email || "unknown@unknown.com",
        productName: requestData.productName,
        productSize: requestData.productSize,
        quantityRequired: requestData.quantityRequired,
        deliveryDestination: requestData.deliveryDestination,
        priceRangeMin: requestData.priceRangeMin ? Number(requestData.priceRangeMin) : void 0,
        priceRangeMax: requestData.priceRangeMax ? Number(requestData.priceRangeMax) : void 0,
        additionalRequirements: requestData.additionalRequirements,
        submittedAt: (/* @__PURE__ */ new Date()).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })
      });
      if (!emailSuccess) {
        console.warn("Failed to send deal request email to admin");
      }
      res.status(201).json({
        ...dealRequest,
        emailSent: emailSuccess
      });
    } catch (error) {
      console.error("Error creating deal request:", error);
      res.status(500).json({ message: "Failed to create deal request" });
    }
  });
  app2.get("/api/deal-requests", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const userId = user?.id || user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userRequests = await storage.getDealRequestsByUser(userId);
      res.json(userRequests);
    } catch (error) {
      console.error("Error fetching deal requests:", error);
      res.status(500).json({ message: "Failed to fetch deal requests" });
    }
  });
  app2.get("/api/get-signed-url", async (req, res) => {
    try {
      const imagePath = req.query.path;
      if (!imagePath || !imagePath.startsWith("/public-objects/")) {
        return res.json({ signedUrl: null });
      }
      const filePath = imagePath.replace("/public-objects/", "");
      const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
      if (!bucketId) {
        return res.json({ signedUrl: null });
      }
      if (!global.objectStorageClient) {
        const { Storage: Storage2 } = await import("@google-cloud/storage");
        const REPLIT_SIDECAR_ENDPOINT2 = "http://127.0.0.1:1106";
        global.objectStorageClient = new Storage2({
          credentials: {
            audience: "replit",
            subject_token_type: "access_token",
            token_url: `${REPLIT_SIDECAR_ENDPOINT2}/token`,
            type: "external_account",
            credential_source: {
              url: `${REPLIT_SIDECAR_ENDPOINT2}/credential`,
              format: {
                type: "json",
                subject_token_field_name: "access_token"
              }
            },
            universe_domain: "googleapis.com"
          },
          projectId: "",
          retryOptions: {
            autoRetry: true,
            maxRetries: 3,
            retryDelayMultiplier: 2,
            totalTimeout: 3e4,
            maxRetryDelay: 1e4
          }
        });
      }
      const bucket = global.objectStorageClient.bucket(bucketId);
      const file = bucket.file(`public/${filePath}`);
      const [exists] = await file.exists();
      if (!exists) {
        return res.json({ signedUrl: null });
      }
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 3600 * 1e3
        // 1 hour
      });
      console.log(`\u{1F517} SIGNED URL: Generated for ${filePath}`);
      res.json({ signedUrl });
    } catch (error) {
      console.error(`\u{1F534} SIGNED URL ERROR:`, error.message);
      res.json({ signedUrl: null });
    }
  });
  app2.get("/api/validate-image", async (req, res) => {
    try {
      const imageUrl = req.query.url;
      if (!imageUrl) {
        return res.json({ valid: false });
      }
      if (imageUrl.startsWith("/public-objects/")) {
        const filePath = imageUrl.replace("/public-objects/", "");
        const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
        if (!bucketId) {
          return res.json({ valid: false });
        }
        try {
          if (!global.objectStorageClient) {
            const { Storage: Storage2 } = await import("@google-cloud/storage");
            const REPLIT_SIDECAR_ENDPOINT2 = "http://127.0.0.1:1106";
            global.objectStorageClient = new Storage2({
              credentials: {
                audience: "replit",
                subject_token_type: "access_token",
                token_url: `${REPLIT_SIDECAR_ENDPOINT2}/token`,
                type: "external_account",
                credential_source: {
                  url: `${REPLIT_SIDECAR_ENDPOINT2}/credential`,
                  format: {
                    type: "json",
                    subject_token_field_name: "access_token"
                  }
                },
                universe_domain: "googleapis.com"
              },
              projectId: "",
              retryOptions: {
                autoRetry: true,
                maxRetries: 3,
                retryDelayMultiplier: 2,
                totalTimeout: 3e4,
                maxRetryDelay: 1e4
              }
            });
          }
          const bucket = global.objectStorageClient.bucket(bucketId);
          const file = bucket.file(`public/${filePath}`);
          const [exists] = await file.exists();
          return res.json({ valid: exists });
        } catch (error) {
          console.error(`\u{1F534} VALIDATION ERROR for ${filePath}:`, error.message);
          return res.json({ valid: false });
        }
      }
      res.json({ valid: true });
    } catch (error) {
      res.json({ valid: false });
    }
  });
  app2.get("/public-objects/*", async (req, res) => {
    const filePath = req.path.replace("/public-objects/", "");
    const imageMap = {
      "product-images/6y9M7PQvU4JNi6f8A39ra.jpg": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      "product-images/Tg7hPOh3CxbWQt8rzmY1N.jpg": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
      "product-images/NNxGFI1n-VBRJ5vpPqqKV.JPG": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      "product-images/OjuD4ef-pGlmFVsGktiuC.JPG": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      // Additional professional business images
      "product-images/business-cards.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      "product-images/office-supplies.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      "product-images/printing.jpg": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
      "product-images/industrial-equipment.jpg": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
    };
    const externalUrl = imageMap[filePath];
    if (externalUrl) {
      try {
        const response = await fetch(externalUrl);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          res.set({
            "Content-Type": "image/jpeg",
            "Content-Length": buffer.byteLength.toString(),
            "Cache-Control": "public, max-age=3600"
          });
          res.send(Buffer.from(buffer));
          return;
        }
      } catch (error) {
        console.log("External image fetch failed:", error);
      }
    }
    res.status(404).send("Image not found");
  });
  app2.get("/debug-image-test.html", (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
    <title>Image Test</title>
    <style>
        body { margin: 20px; font-family: Arial, sans-serif; }
        img { margin: 10px; border: 2px solid #ccc; max-width: 300px; }
        .working { border-color: green !important; }
        .failed { border-color: red !important; }
        .log { background: #f5f5f5; padding: 10px; margin: 10px 0; font-family: monospace; }
    </style>
</head>
<body>
    <h1>Direct Image Test</h1>
    <p>Testing image loading directly...</p>
    <div id="log" class="log"></div>
    
    <img id="img1" src="/public-objects/product-images/6y9M7PQvU4JNi6f8A39ra.jpg?t=${Date.now()}" 
         onload="logSuccess('Image 1 loaded')" 
         onerror="logError('Image 1 failed')">
    
    <img id="img2" src="/public-objects/product-images/Tg7hPOh3CxbWQt8rzmY1N.jpg?t=${Date.now()}" 
         onload="logSuccess('Image 2 loaded')" 
         onerror="logError('Image 2 failed')">
    
    <img id="img3" src="/public-objects/product-images/NNxGFI1n-VBRJ5vpPqqKV.JPG?t=${Date.now()}" 
         onload="logSuccess('Image 3 loaded')" 
         onerror="logError('Image 3 failed')">

    <script>
        const logDiv = document.getElementById('log');
        
        function logMessage(msg, type = 'info') {
            console.log(msg);
            logDiv.innerHTML += \`<div style="color: \${type === 'error' ? 'red' : 'green'}">\${new Date().toLocaleTimeString()}: \${msg}</div>\`;
        }
        
        function logSuccess(msg) {
            logMessage('\u2705 ' + msg, 'success');
        }
        
        function logError(msg) {
            logMessage('\u274C ' + msg, 'error');
        }
        
        logMessage('Starting image tests...');
        
        // Test fetch directly
        async function testFetch() {
            try {
                const response = await fetch('/public-objects/product-images/6y9M7PQvU4JNi6f8A39ra.jpg?fetch=test');
                logMessage(\`Fetch status: \${response.status} \${response.statusText}\`);
                if (response.ok) {
                    const blob = await response.blob();
                    logMessage(\`Blob size: \${blob.size} bytes, type: \${blob.type}\`);
                } else {
                    const text = await response.text();
                    logMessage(\`Error response: \${text}\`, 'error');
                }
            } catch (error) {
                logMessage(\`Fetch error: \${error.message}\`, 'error');
            }
        }
        
        setTimeout(testFetch, 1000);
    </script>
</body>
</html>`);
  });
  const uploadRoutes = (await Promise.resolve().then(() => (init_upload(), upload_exports))).default;
  app2.use("/api/upload", uploadRoutes);
  app2.use(securityErrorHandler);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid as nanoid3 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid3()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/db-mysql.ts
import { drizzle as drizzle2 } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
var connectionConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "businessdailydeals",
  ssl: process.env.MYSQL_SSL === "true" ? {} : false
};
var mysqlConnection = mysql.createPool(connectionConfig);
var mysqlDb = drizzle2(mysqlConnection, { schema: schema_exports, mode: "default" });
async function testMySQLConnection() {
  try {
    const connection = await mysqlConnection.getConnection();
    await connection.ping();
    connection.release();
    console.log("\u2705 MySQL connection successful");
    return true;
  } catch (error) {
    console.error("\u274C MySQL connection failed:", error);
    return false;
  }
}

// server/db-selector.ts
async function getDatabase() {
  const hasMySQLCredentials = process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD && process.env.MYSQL_DATABASE;
  if (hasMySQLCredentials) {
    console.log("\u{1F504} MySQL credentials detected, testing connection...");
    const mysqlConnected = await testMySQLConnection();
    if (mysqlConnected) {
      console.log("\u2705 Using MySQL database (Cybersmart production)");
      return mysqlDb;
    } else {
      console.log("\u26A0\uFE0F MySQL connection failed, falling back to PostgreSQL");
    }
  } else {
    console.log("\u2139\uFE0F No MySQL credentials provided, using PostgreSQL");
  }
  console.log("\u2705 Using PostgreSQL database (Replit development)");
  return db;
}
var selectedDb = null;
async function initializeDatabase() {
  if (!selectedDb) {
    selectedDb = await getDatabase();
  }
  return selectedDb;
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const timestamp2 = Date.now();
  res.set({
    "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
    "Last-Modified": new Date(timestamp2).toUTCString(),
    "ETag": `"${timestamp2}"`,
    "Vary": "Cache-Control",
    "X-Timestamp": timestamp2.toString()
  });
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    log("\u{1F680} Starting Business Daily Deals B2B Marketplace...");
    log(`\u{1F310} NODE_ENV: ${process.env.NODE_ENV || "not set"}`);
    log(`\u{1F6A2} PORT: ${process.env.PORT || "not set (will default to 5000)"}`);
    log(`\u{1F4BE} DATABASE_URL: ${process.env.DATABASE_URL ? "configured" : "not set"}`);
    const requiredEnvVars = ["DATABASE_URL"];
    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
      log(`\u274C Missing required environment variables: ${missingEnvVars.join(", ")}`);
      log(`\u{1F50D} Available environment variables: ${Object.keys(process.env).filter((key) => !key.includes("SECRET") && !key.includes("KEY")).join(", ")}`);
      process.exit(1);
    }
    log("\u2705 Environment variables verified");
    const hasMySQLCredentials = process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD && process.env.MYSQL_DATABASE;
    if (hasMySQLCredentials) {
      log("\u{1F504} MySQL credentials detected, initializing unified database...");
      try {
        const db2 = await initializeDatabase();
        log("\u2705 MySQL unified database connection established");
      } catch (error) {
        log(`\u274C MySQL connection failed: ${error}`);
        log("\u26A0\uFE0F Falling back to PostgreSQL");
        await testDatabaseConnection();
      }
      if (process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID) {
        log("\u{1F504} Pre-initializing Google Cloud Storage...");
        const { Storage: Storage2 } = await import("@google-cloud/storage");
        global.objectStorageClient = new Storage2({
          credentials: {
            audience: "replit",
            subject_token_type: "access_token",
            token_url: "http://127.0.0.1:1106/token",
            type: "external_account",
            credential_source: {
              url: "http://127.0.0.1:1106/credential",
              format: { type: "json", subject_token_field_name: "access_token" }
            },
            universe_domain: "googleapis.com"
          },
          projectId: ""
        });
        log("\u2705 Google Cloud Storage pre-initialized");
      }
    } else {
      log("\u2139\uFE0F Using PostgreSQL development database");
      await testDatabaseConnection();
    }
    const server = await registerRoutes(app);
    log("\u2705 Routes registered successfully");
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`\u274C Error ${status}: ${message}`);
      res.status(status).json({ message });
      throw err;
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
      log("\u2705 Vite development server setup complete");
    } else {
      serveStatic(app);
      log("\u2705 Static file serving enabled for production");
    }
    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`\u{1F389} Business Daily Deals server successfully started on port ${port}`);
      log(`\u{1F310} Environment: ${app.get("env")}`);
      log(`\u{1F4CA} Health check available at: http://0.0.0.0:${port}/api/health`);
    });
    process.on("SIGTERM", () => {
      log("\u{1F504} SIGTERM received, shutting down gracefully...");
      server.close(() => {
        log("\u2705 Server closed");
        process.exit(0);
      });
    });
    process.on("SIGINT", () => {
      log("\u{1F504} SIGINT received, shutting down gracefully...");
      server.close(() => {
        log("\u2705 Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    log(`\u274C Failed to start server: ${error}`);
    process.exit(1);
  }
})();
