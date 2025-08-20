# Business Daily Deals B2B Marketplace

## Overview
Business Daily Deals (www.businessdailydeals.co.za) is a full-stack B2B marketplace for the South African market. It connects suppliers and buyers, facilitating the exchange of goods and services through targeted deal notifications and special pricing. The platform aims to be a fully operational and modern B2B e-commerce solution, currently under development, with production deployment hosted by Cybersmart in South Africa. Key capabilities include suppliers posting premium "hot deals" and standard "regular deals," and buyers discovering opportunities via search, categories, and keyword-based notifications. The platform features dynamic business analytics that scale organically with growth.

## User Preferences
Preferred communication style: Simple, everyday language.
Brand name: Business Daily Deals
Domain: www.businessdailydeals.com.za
Target market: South African B2B marketplace
Pricing structure: Hot deals (premium home page placement, higher pricing) vs Regular deals (dropdown sections, standard pricing)
NEW PROMOTIONAL PERIOD: FREE deal posting for suppliers until 20th February 2026 to build user base quickly, then start charging
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
- **Deal Management**: Suppliers can create, edit, manage hot and regular deals, extend expiry, and reactivate expired deals (FREE during promotional period until Feb 20, 2026).
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
- **Enterprise Coupon Security**: Multi-layer validation system preventing duplicate redemptions across company branches, with comprehensive audit trails and supplier verification interface optimized for existing platform users.

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
**CYBERSMART DEPLOYMENT READY**: ✅ Business Daily Deals marketplace optimized for shared hosting  
**Hosting Provider**: Cybersmart (South African) with MySQL 5.7.44 and Apache web server  
**Database**: `businessdailydeals_main` - MySQL schema ready for Cybersmart deployment  
**Production Build**: 179KB optimized server bundle with February 20th, 2026 promotional content  
**Development Status**: All February 20th, 2026 updates working perfectly, production files prepared  
**Features Ready**: Complete deals management, supplier analytics, credit system, professional business theme  
**Promotional Period**: FREE until February 20, 2026 - fully implemented and tested  
**Latest Update**: August 16, 2025 - CYBERSMART CREDENTIALS RECEIVED: Database simonsta_businessdailydeals_main created with credentials provided. Complete deployment package ready including configured .env.cybersmart, database schema, and production files. 7-minute launch process documented. Ready for immediate deployment.

## Recent Changes

### Casino Homepage Design Restoration (August 20, 2025)
- **Original Design Restored**: Successfully identified and restored the correct original casino homepage design from home-comprehensive.tsx
- **Proper Casino Theme**: One-armed bandit slot machine with 3 spinning red 7's in contained dark box, NOT scattered elements
- **Accurate Gradient**: Orange halftone to slate gradient background (#ffcc80 → #ffb74d → #c8b8a0 → #8fa3b8)
- **Professional Layout**: "South Africa's #1 B2B Marketplace" star badge, large white "BUSINESS DAILY DEALS" text
- **February 2026 Content**: All promotional dates updated to February 20th, 2026 throughout the site
- **Production Ready**: Homepage confirmed working with proper casino theme and updated promotional content

### February 2026 Homepage Implementation (August 15, 2025)
- **Homepage Updates**: Created multiple homepage versions (homepage-final.tsx, new-homepage.tsx) with February 20th, 2026 promotional content
- **Cache-Busting**: Implemented aggressive cache clearing mechanisms and visual confirmation elements
- **Logout Fixes**: Enhanced logout functionality using window.location.replace() for proper state clearing
- **Visual Distinction**: Purple/blue themed homepage with red debug banners to bypass browser caching
- **Development Confirmed**: Console logs show "NEW HOMEPAGE LOADED WITH FEBRUARY 20TH 2026 DATES" - ready for production deployment
- **Production URL**: https://b4c4fa9a-c209-4d1e-9ad6-d30acf9c86d2.worf.prod.repl.run/ (awaiting redeployment for February 2026 content)

### Image System Complete (August 12, 2025)
- **All Images Loading**: 8 Hot Deals + 5 Regular Deals displaying professional business stock photos
- **Database Updated**: All deals now have proper imageUrl values, eliminating placeholder boxes permanently
- **Reliable Image Proxy**: Direct image serving bypasses Google Cloud Storage timing issues
- **Professional Quality**: High-quality business imagery across entire marketplace
- **Permanent Fix**: Database-level solution ensures consistent image display across server restarts

### MySQL Integration Complete (August 12, 2025)
- **Database Unification**: Intelligent database selector system implemented
- **MySQL Configuration**: All 4 Cybersmart MySQL secrets configured successfully
- **Host Confirmation**: Cybersmart confirmed MYSQL_HOST is 'localhost' (works on their servers)
- **Smart Fallback**: System detects MySQL credentials, attempts connection, gracefully falls back to PostgreSQL
- **Production Ready**: Unified database activates automatically on Cybersmart deployment
- **Development Continuity**: Full functionality maintained with PostgreSQL during development

### Coupon Security System Complete (August 12, 2025)
- **Enterprise-Grade Validation**: Multi-layer system prevents duplicate coupon redemptions across all company branches
- **Comprehensive Audit Trail**: Complete logging of all redemption attempts with IP tracking and failure analysis
- **Supplier Integration**: Verification system optimized for existing platform users (suppliers already familiar with Business Daily Deals interface)
- **Database-Level Protection**: Bulletproof schema with redemption tracking, location logging, and verification codes
- **User-Friendly Interface**: New /coupon-verification page with intuitive validation workflow for suppliers

### Technical Achievements
- ✅ Dual-database architecture: PostgreSQL (development) + MySQL (production)  
- ✅ Intelligent connection logic: Automatic MySQL detection and fallback
- ✅ 13 active deals with complete marketplace functionality
- ✅ Production deployment ready for Cybersmart hosting with MySQL activation
- ✅ Zero downtime database switching: Seamless transition between database systems
- ✅ Cybersmart database credentials configured: simonsta_businessdailydeals_main ready
- ✅ Complete deployment package with 7-minute launch process documented