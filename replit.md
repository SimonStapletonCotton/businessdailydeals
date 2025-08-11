# Business Daily Deals B2B Marketplace

## Overview
Business Daily Deals (www.businessdailydeals.co.za) is a full-stack B2B marketplace for the South African market. It connects suppliers and buyers, facilitating the exchange of goods and services through targeted deal notifications and special pricing. The platform aims to be a fully operational and modern B2B e-commerce solution, currently under development, with production deployment hosted by Cybersmart in South Africa. Key capabilities include suppliers posting premium "hot deals" and standard "regular deals," and buyers discovering opportunities via search, categories, and keyword-based notifications. The platform features dynamic business analytics that scale organically with growth.

## User Preferences
Preferred communication style: Simple, everyday language.
Brand name: Business Daily Deals
Domain: www.businessdailydeals.com.za
Target market: South African B2B marketplace
Pricing structure: Hot deals (premium home page placement, higher pricing) vs Regular deals (dropdown sections, standard pricing)
NEW PROMOTIONAL PERIOD: FREE deal posting for suppliers until 31st December 2025 to build user base quickly, then start charging
Color scheme preference: Orange halftone casino-style theme with animated red 7's, professional gradient backgrounds (specific: orange halftone on left #ffcc80 → #ffb74d graduating to slate halftone #c8b8a0 → #8fa3b8 on right), mid charcoal navbar (#64748b)
Quality expectations: Comprehensive implementations with thorough attention to detail - "master coder should think of every combination"
Backup requirements: Critical - cannot start from beginning if crashes occur, need complete documentation

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling
- **UI/UX Decisions**: Orange casino-themed design with animated red 7's, gradient backgrounds, enhanced layouts, professional interface. Engaging one-armed bandit style animations on homepage. Spot colored action buttons.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API structure with modular route handlers
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions.
- **Middleware**: Custom logging, error handling, and authentication middleware.

### Database Schema
- **Users**: User profiles with buyer/supplier roles, notification preferences, credit balance tracking.
- **Deals**: Central entity with categories, pricing, deal types (hot/regular), expiry management.
- **Keywords**: User-defined keywords for deal notifications.
- **Notifications**: System-generated alerts for keyword matches.
- **Inquiries**: Communication system between buyers and suppliers.
- **Coupons**: Deal acceptance tracking and coupon code generation.
- **Basket Items**: Shopping cart for advertising rate purchases.
- **Rates**: Advertising rate structure and pricing tiers.
- **Credit Transactions**: Complete credit system transaction history.
- **Orders**: Credit purchases and advertising order management.
- **Banner Ads**: Revolving banner advertisement management.
- **Companies**: Supplier directory and business profiles.
- **Site Analytics**: Business statistics and performance tracking.
- **Deal Requests**: "Find Me a Deal" buyer requirement submissions.
- **Sessions**: Secure session storage.

### Authentication & Authorization
- **Provider**: Replit OpenID Connect (OIDC) integration.
- **Strategy**: Passport.js with custom OpenID strategy.
- **Session Security**: HTTP-only cookies; extended session duration and rolling sessions.
- **Role-based Access**: Buyer and supplier roles with route protection.

### Key Features
- **Deal Management**: Suppliers can create, edit, manage hot and regular deals, extend expiry, and reactivate expired deals (FREE during promotional period until Dec 31, 2025).
- **Smart Notifications**: Keyword-based matching system for relevant deal alerts with multi-channel support.
- **Search & Discovery**: Comprehensive search for products, companies, and hot deals with category filters.
- **Inquiry System**: Direct communication between buyers and suppliers.
- **Supplier Dashboard**: Comprehensive dashboard with deal management, inquiries tracking, expired deals management, promotional banners, and credit system integration.
- **Credit System**: Credit packages, local ZAR payment integration, balance management, and transaction history.
- **Image Upload**: Professional file upload with Google Cloud Storage integration.
- **"Find Me a Deal"**: System for buyers to submit specific product requirements with admin email notifications.
- **Rates per Advert**: Comprehensive advertising rates marketplace with shopping basket functionality.
- **Registration System**: Detailed buyer and supplier registration pages with keyword notification setup and multi-channel alert preferences.
- **Homepage**: Comprehensive design with animated casino-style one-armed bandit, dynamic business statistics (real-time data), Quick Access Features, How It Works 3-step process, value proposition, and comprehensive footer.
- **Navigation Enhancement**: Reusable BackButton component with consistent "← Back to Home" navigation across all key pages.
- **Supplier Verification**: Optional verification system with VAT and business registration number fields, verified supplier badges.
- **Legal & Support Pages**: Comprehensive Terms of Service, Privacy Policy, Support Center.
- **Security Features**: Multi-layer security including rate limiting, input validation, security headers, IP blocking, and protection against common web attacks.
- **Live Coupons System**: Public coupon tracking page with comprehensive buyer identification details, individual coupon printing, and complete deal information display.
- **Dynamic Analytics**: Real-time business statistics system tracking active suppliers, total deals, successful connections, and calculated savings, scaling with platform growth.
- **Payment Confirmation**: Dual email confirmation system for admin and customers upon successful payments via PayFast.

## External Dependencies

### Core Services
- **Database**: PostgreSQL (current active) + MySQL conversion 100% complete for Cybersmart hosting deployment
- **Cybersmart MySQL**: Production credentials secured, schema conversion complete, ready for deployment
- **Authentication**: Replit OIDC service
- **Cloud Storage**: Google Cloud Storage for image uploads
- **Email Service**: SendGrid for email notifications
- **Payment Gateway**: PayFast (South African local payment gateway)

### Frontend Libraries
- **UI Framework**: Radix UI primitives, Shadcn/ui
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Validation**: Zod schema validation
- **Styling**: Tailwind CSS with class-variance-authority
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Routing**: Wouter

### Backend Libraries
- **Database**: Drizzle ORM with Neon serverless adapter
- **Authentication**: Passport.js with OpenID Client
- **Validation**: Drizzle Zod
- **Utilities**: Memoizee, nanoid
- **Session Store**: connect-pg-simple

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full type safety
- **Database Migrations**: Drizzle Kit
- **Development Server**: tsx

## Production Deployment Status
**DEPLOYING NOW**: ✅ Replit deployment in progress - waiting for completion (10+ minutes elapsed)  
**Database**: PostgreSQL (development) + MySQL (production package complete)  
**Deployment**: Replit Autoscale deployment approved and processing for www.businessdailydeals.co.za  
**Status**: Extended deployment time - waiting for production URL from Replit system  
**Timeline**: Extended wait time normal for complex applications - DNS configuration ready to follow  
**Documentation**: Complete deployment guides ready (`PRODUCTION_DEPLOYMENT_GUIDE.md`, `DEPLOYMENT_SUCCESS_CHECKLIST.md`)

## Recent Changes

### Database Schema Alignment - Complete (August 11, 2025)
- **MAJOR FIX**: Systematically resolved all database schema alignment issues
- **Fixed**: Column name mismatches causing SQL errors (keywords_for_notifications, etc.)
- **Updated**: All deal-related database queries with explicit column selection  
- **Result**: Application now runs flawlessly with all APIs returning 200 status
- **Status**: Production-ready with zero database errors

### Technical Achievements
- ✅ PostgreSQL development environment: 100% functional
- ✅ MySQL production package: Complete and ready for Cybersmart deployment
- ✅ All core features operational: deals, analytics, image system, user management
- ✅ API endpoints verified working: /api/deals, /api/business/stats, image streaming
- ✅ Production deployment guides: Created and ready for immediate use