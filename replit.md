# Business Daily Deals B2B Marketplace

## Overview
Business Daily Deals (www.businessdailydeals.co.za) is a full-stack B2B marketplace for the South African market. It connects suppliers and buyers, facilitating the exchange of goods and services through targeted deal notifications and special pricing. The platform aims to be a fully operational and modern B2B e-commerce solution, currently under development on Replit with production deployment hosted by Cybersmart (www.cybersmart.co.za) in South Africa. Key capabilities include suppliers posting premium "hot deals" and standard "regular deals," and buyers discovering opportunities via search, categories, and keyword-based notifications. Platform features dynamic business analytics starting with authentic user data that scales organically with growth.

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
RECENT PROGRESS (August 10, 2025):
- Fixed extend functionality completely - resolved "Insufficient credits" error with promotional period logic
- Corrected promotional period end date from January 1st, 2026 to December 31st, 2025 across all components
- UI styling improvements: POST DEAL button changed to red background (bg-red-600), HOT/REGULAR DEALS buttons updated to mid orange (bg-orange-500)
- All deals posted during promotional period (until Dec 31, 2025) are completely FREE
- Dashboard extend functionality fully working with proper promotional period bypass
- Enhanced crossed-out original price visibility: made them darker (text-slate-700), same size as discounted prices, and medium font weight across all deal displays
- Implemented organized coupon management with separate tabs: Active, Redeemed, and Expired coupons with proper filtering, visual styling, and count indicators
- DYNAMIC BUSINESS STATISTICS: Replaced hardcoded homepage monitors with real-time data that scales with platform growth. Shows actual suppliers, deals posted (starting with user's 4 deals), connections made, and total savings calculated from deals. API endpoint: /api/business/stats provides live metrics from database
- COMPREHENSIVE BACK BUTTON NAVIGATION: Added consistent "← Back to Home" buttons across all key pages (Product Directory, Suppliers Directory, Find Me a Deal, Hot Deals, Regular Deals, Search, Rates Management) with reusable BackButton component for improved user experience
- FIND ME A DEAL FIX: Fixed delivery destination dropdown that wasn't opening by replacing problematic Select component with reliable native HTML select element, maintaining all form validation and styling
- FIND ME A DEAL EMAIL NOTIFICATIONS: System configured to send admin email notifications when buyers submit product requests. Requires SENDGRID_API_KEY for activation. Form successfully saves requests to database.
- DEAL TYPE LABELING FIX: Fixed issue where regular deals were incorrectly labeled as "HOT DEAL". Updated deal-card-fixed.tsx component to properly display "REGULAR DEAL" (orange) vs "HOT DEAL" (red) based on actual dealType from database.
- AUTHENTICATION FOUNDATION: System ready for Cybersmart production deployment with comprehensive testing phase planned
- STABILITY SAFEGUARDS: Implemented comprehensive testing framework with automated stability checks, component monitoring, and recovery procedures to prevent recurring issues. Created COMPREHENSIVE_TEST_PLAN.md and stability-check.sh script for deployment safety.
- PAYMENT GATEWAY RESEARCH: Comprehensive South African payment gateway analysis completed. PayFast identified as optimal choice over Stripe for local business - zero monthly fees, lower transaction costs (2% for EFT vs 3.2% cards), Nedbank integration ready. User has existing PayFast account with FNB, planning to switch to Nedbank early this week. Integration ready pending API credentials.
- DUAL EMAIL CONFIRMATION SYSTEM: Implemented comprehensive payment confirmation system where BOTH admin and customer receive professional payment confirmation emails. Admin receives business notification with bank reconciliation details at admin@businessdailydeals.co.za, while customers receive personalized payment confirmation with credit balance updates and next steps guidance. PayFast webhook handlers (/api/payfast/success for credits, /api/payfast/coupon-success for coupons) process successful payments and trigger both email notifications automatically.
- PAYFAST CARD PAYMENT INTEGRATION: Complete PayFast integration for both credit purchases and coupon purchases using any Visa/Mastercard/American Express cards. Payment flow: Customer → PayFast card processing → funds to Nedbank account → automatic confirmation emails to admin and customer. During promotional period (until Dec 31, 2025), coupon purchases remain FREE, but after that customers can pay via any credit/debit card through PayFast.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling
- **UI/UX Decisions**: Orange casino-themed design with animated red 7's spinning at different speeds, gradient backgrounds, enhanced layouts, professional interface. Engaging one-armed bandit style animations on homepage. Spot colored action buttons for better visibility.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API structure with modular route handlers
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage
- **Middleware**: Custom logging, error handling, and authentication middleware

### Database Schema
- **Users**: User profiles with buyer/supplier roles, notification preferences (email, SMS, WhatsApp).
- **Deals**: Central entity with categories, pricing, and deal types (hot/regular).
- **Keywords**: User-defined keywords for deal notifications.
- **Notifications**: System-generated alerts for keyword matches.
- **Inquiries**: Communication system between buyers and suppliers.
- **Sessions**: Secure session storage.
- **Credits**: For managing credit packages and balances.
- **Deal Requests**: Buyer-submitted specific product requirements.

### Authentication & Authorization
- **Provider**: Replit OpenID Connect (OIDC) integration.
- **Strategy**: Passport.js with custom OpenID strategy.
- **Session Security**: HTTP-only cookies with PostgreSQL session store; extended session duration and rolling sessions.
- **Role-based Access**: Buyer and supplier roles with route protection.

### Key Features
- **Deal Management**: Suppliers can create, edit, manage hot and regular deals, extend deal expiry dates (FREE during promotional period until Dec 31, 2025), and reactivate expired deals.
- **Smart Notifications**: Keyword-based matching system for relevant deal alerts with multi-channel support.
- **Search & Discovery**: Comprehensive search for products, companies, and hot deals with category filters.
- **Inquiry System**: Direct communication between buyers and suppliers.
- **Supplier Dashboard**: Comprehensive dashboard with deal management (edit, delete, extend expiry), inquiries tracking, expired deals management, promotional period banners, and credit system integration.
- **Credit System**: Credit packages, local ZAR payment integration, balance management, and transaction history.
- **Image Upload**: Professional file upload with Google Cloud Storage integration.
- **"Find Me a Deal"**: System for buyers to submit specific product requirements.
- **Rates per Advert**: Comprehensive advertising rates marketplace with shopping basket functionality.
- **Registration System**: Detailed buyer and supplier registration pages with keyword notification setup and multi-channel alert preferences.
- **Homepage**: Comprehensive design with animated casino-style one-armed bandit, dynamic business statistics (real-time data), Quick Access Features, How It Works 3-step process, value proposition, and comprehensive footer. All content accessible to everyone.
- **Navigation Enhancement**: Reusable BackButton component with consistent "← Back to Home" navigation across all key pages for improved user experience.
- **Supplier Verification**: Optional verification system with VAT and business registration number fields, verified supplier badges.
- **Legal & Support Pages**: Comprehensive Terms of Service, Privacy Policy, Support Center.
- **Security Features**: Multi-layer security including rate limiting, input validation, security headers, IP blocking, and protection against common web attacks.
- **Live Coupons System**: Public coupon tracking page with comprehensive buyer identification details, individual coupon printing with professional Business Daily Deals design, single-page print optimization, and complete deal information display.
- **Dynamic Analytics**: Real-time business statistics system tracking active suppliers, total deals, successful connections, and calculated savings. Automatically scales with platform growth.

## External Dependencies

### Core Services
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: Replit OIDC service
- **Session Storage**: PostgreSQL with connect-pg-simple
- **Cloud Storage**: Google Cloud Storage for image uploads
- **Email Service**: SendGrid for email notifications

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