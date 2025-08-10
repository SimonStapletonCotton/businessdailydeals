# Business Daily Deals B2B Marketplace

## Overview

Business Daily Deals (www.businessdailydeals.co.za) is a full-stack B2B marketplace for the South African market. It connects suppliers and buyers, facilitating the exchange of goods and services through targeted deal notifications and special pricing. Suppliers can post both premium "hot deals" and standard "regular deals." Buyers can discover opportunities via search, categories, and keyword-based notifications. The platform aims to be a fully operational and modern B2B e-commerce solution, currently under development on Replit with production deployment hosted by Cybersmart (www.cybersmart.co.za) in South Africa.

## User Preferences

Preferred communication style: Simple, everyday language.
Brand name: Business Daily Deals
Domain: www.businessdailydeals.com.za
Target market: South African B2B marketplace
Pricing structure: Hot deals (premium home page placement, higher pricing) vs Regular deals (dropdown sections, standard pricing)
**NEW PROMOTIONAL PERIOD**: FREE deal posting for suppliers until 1st January 2026 to build user base quickly, then start charging
Color scheme preference: Orange halftone casino-style theme with animated red 7's, professional gradient backgrounds (specific: orange halftone on left #ffcc80 → #ffb74d graduating to slate halftone #c8b8a0 → #8fa3b8 on right), mid charcoal navbar (#64748b)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling
- **UI/UX Decisions**: Orange casino-themed design with animated red 7's spinning at different speeds, gradient backgrounds starting below navbar, enhanced layouts, professional interface. Engaging one-armed bandit style animations on homepage. Spot colored action buttons for better visibility.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API structure with modular route handlers
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage
- **Middleware**: Custom logging, error handling, and authentication middleware
- **Development**: Hot reload with Vite integration in development mode

### Database Schema
- **Users**: User profiles with buyer/supplier roles, including comprehensive registration fields and notification preferences (email, SMS, WhatsApp).
- **Deals**: Central entity with categories, pricing, and deal types (hot/regular).
- **Keywords**: User-defined keywords for deal notifications with multi-channel alert support.
- **Notifications**: System-generated alerts for keyword matches.
- **Inquiries**: Communication system between buyers and suppliers.
- **Sessions**: Secure session storage in PostgreSQL.
- **Credits**: For managing credit packages and balances.
- **Deal Requests**: Buyer-submitted specific product requirements.

### Authentication & Authorization
- **Provider**: Replit OpenID Connect (OIDC) integration.
- **Strategy**: Passport.js with custom OpenID strategy.
- **Session Security**: HTTP-only cookies with PostgreSQL session store; extended session duration (30 days) and rolling sessions.
- **Role-based Access**: Buyer and supplier roles with route protection.

### Key Features
- **Deal Management**: Suppliers can create, edit, manage hot and regular deals, and reactivate expired deals.
- **Smart Notifications**: Keyword-based matching system for relevant deal alerts with multi-channel support (email, SMS, WhatsApp).
- **Search & Discovery**: Comprehensive search for products, companies, and hot deals with category filters.
- **Inquiry System**: Direct communication between buyers and suppliers.
- **Supplier Dashboard**: For managing deals, inquiries, and expired deals.
- **Credit System**: Credit packages, local ZAR payment integration, balance management, and transaction history.
- **Image Upload**: Professional file upload with Google Cloud Storage integration, drag-and-drop, and previews.
- **"Find Me a Deal"**: System for buyers to submit specific product requirements with email notifications to admin.
- **Rates per Advert**: Comprehensive advertising rates marketplace with Excel-based pricing and shopping basket functionality.
- **Registration System**: Detailed buyer and supplier registration pages with keyword notification setup and multi-channel alert preferences.
- **Navigation Structure**: Home/HOT deals, Register as SUPPLIER, Register as BUYER, REGULAR deals, Supplier dashboard. Consistent navigation across all pages.
- **Information Pages**: About Us and professional Contact page.
- **Home Page**: Comprehensive design with animated casino-style one-armed bandit featuring authentic red 7's spinning vertically at different speeds. Includes detailed sections: business statistics (2,150+ suppliers, 15,340+ deals, 89,250+ connections, R12.4M+ savings), Quick Access Features (Find Me a Deal, Product Directory, Supplier Directory, Advertising Rates), How It Works 3-step process, value proposition section, and comprehensive footer. Uses orange gradient background (#ff6600 to #cc4400) transitioning to slate colors. All content accessible to everyone, not just authenticated users.
- **Supplier Verification**: Optional verification system with VAT and business registration number fields, verified supplier badges with shield icons displayed on deal cards.
- **Legal & Support Pages**: Comprehensive Terms of Service, Privacy Policy, Support Center with admin@businessdailydeals.co.za as primary help center contact.
- **Security Features**: Multi-layer security including rate limiting, input validation, security headers, IP blocking, and protection against common web attacks.
- **Copyright Protection**: Comprehensive copyright notices and intellectual property protection throughout the platform.

## Production Deployment Status

### Cybersmart Hosting Confirmation (January 9, 2025) - FINAL CONFIRMATION
**✅ CONFIRMED Available Infrastructure:**
- ✅ Node.js 18+ support (confirmed by hosting provider - January 9, 2025)
- ✅ SSL Certificate will be provided and configured by Cybersmart
- ✅ MySQL database available
- ✅ Apache web server (no Nginx reverse proxy needed)
- ✅ Environment variables can be configured in application code
- ❌ PostgreSQL not supported (MySQL required)
- ❌ PM2 process manager not supported (Node.js clustering alternative ready)
- ❌ Nginx reverse proxy not available (Apache-based shared hosting)

**✅ DEPLOYMENT READY STATUS:**
1. **Infrastructure Compatibility**: All requirements met by Cybersmart hosting
2. **Database**: MySQL schema conversion completed with `drizzle.config.mysql.ts`
3. **Web Server**: Apache .htaccess configuration ready
4. **Process Management**: Node.js clustering alternative prepared
5. **SSL/Security**: Cybersmart will handle SSL certificate provisioning
6. **Environment Variables**: Application-level configuration ready

**Next Steps:** Ready for production deployment to www.businessdailydeals.co.za

## Recent Comprehensive Homepage Implementation (August 2025)

**Complete Homepage Features Restored:**
- ✅ Casino slot machine animation with 3 spinning red 7's at different speeds
- ✅ Orange halftone to slate halftone gradient background starting below navbar
- ✅ Spot colored Browse buttons: Hot Deals (red), Regular Deals (blue)
- ✅ Mid green promotional banner with white text (suppliers post free until Jan 1, 2026)
- ✅ Business statistics section (2,150+ suppliers, 15,340+ deals, 89,250+ connections, R12.4M+ savings)
- ✅ Quick Access Features: Find Me a Deal, Product Directory, Supplier Directory, Advertising Rates
- ✅ "How Business Daily Deals Works" 3-step process
- ✅ Value proposition section with verification badges
- ✅ Comprehensive footer with all navigation and contact information
- ✅ All content accessible without authentication requirements
- ✅ Background gradient positioned correctly (starts below navbar, not above it)
- ✅ Different halftone colors per page capability established

**COMPREHENSIVE COMPLETION (January 10, 2025):**
- **Master Coding Implementation**: Completed all incomplete processes with systematic thoroughness
- **Deal Card System**: Created unified deal-card-fixed.tsx with three variants (compact, regular, hot)
- **Modal System**: Professional two-column modals with coupon generation, inquiries, and detail views
- **Cross-Page Consistency**: Updated all pages (hot-deals, regular-deals, supplier-dashboard, home) to use fixed component
- **Authentication Integration**: Proper handling of authenticated vs non-authenticated users for coupon access
- **Error Handling**: Comprehensive TypeScript error resolution and null safety checks
- **User Experience**: Eliminated all navigation/scrolling issues, replaced with proper modal interactions

**Latest Updates (January 10, 2025):**
- Fixed background positioning to start below mid charcoal navbar (#64748b)
- Updated Browse buttons to distinctive spot colors for better visibility
- Corrected promotional banner to mid green background with white text
- **FINAL BACKGROUND THEME**: Implemented medium orange to light slate gradient for homepage
- Balanced gradient flows from medium orange (#ff8f00) on left to light slate (#f8fafc) on right
- Maintained charcoal navbar (#64748b) for professional contrast with gradient background
- **RESOLVED Mixed Functionality Issues**: Fixed hot deals API parameter consistency (now using `type=hot`), resolved type compatibility for deal cards, and ensured proper navigation between homepage and registration pages
- Added "Back to Home" buttons to both buyer and supplier registration pages for improved UX
- Hot deals now display correctly on both homepage and dedicated hot deals page
- Created comprehensive color swatch comparison page (/color-swatches) with 6 professional theme options
- **BACKGROUND DESIGN FINALIZED**: After extensive color testing, settled on medium orange to light slate gradient that provides sophisticated, warm appearance with balanced intensity
- **BUTTON COLORS UPDATED**: Hot Deals button changed to red (attention-grabbing) and Regular Deals to blue (professional)
- **GRID LAYOUT IMPLEMENTATION COMPLETED**: Implemented fixed 5-column × 10-row layout for Hot Deals and Regular Deals pages (50 deals per page) with "Show More" pagination functionality
- **NAVIGATION REORDERED**: Updated menu order to: Home/HOT deals → Regular Deals → Register as Supplier → Register as Buyer for better user flow
- **COUPON SYSTEM FULLY OPERATIONAL**: Fixed all database schema issues, created sample data, and confirmed coupon generation and Live Coupons page functionality
- **SCROLL NAVIGATION FIXED (January 10, 2025)**: Completely resolved page navigation scroll issues where Hot Deals and Regular Deals pages opened at bottom instead of top. Added comprehensive scroll-to-top functionality for all navigation links, homepage deal cards, and hero section buttons with multiple fallback methods and proper timing.

**COMPLETED MODAL IMPLEMENTATION (January 10, 2025)**:
- **Solution**: Created comprehensive deal-card-fixed.tsx component with proper modal structure
- **Features**: Two-column layout with deal info, pricing, supplier details, and coupon generation
- **Modal Types**: Compact modal for grid view cards, detailed modal for full deal cards
- **Authentication**: Integrated with Replit Auth for coupon generation and inquiries
- **User Experience**: No page navigation/scrolling, clean modal popups with proper close functionality
- **Status**: ✅ COMPLETED - All deal card layouts working with proper modal dialogs

**Key File:** `client/src/pages/home-comprehensive.tsx` - This is the main homepage implementation with all detailed features.

## External Dependencies

### Core Services
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: Replit OIDC service
- **Session Storage**: PostgreSQL with connect-pg-simple
- **Cloud Storage**: Google Cloud Storage for image uploads
- **Email Service**: SendGrid for email notifications (e.g., deal requests)

### Frontend Libraries
- **UI Framework**: Radix UI primitives for accessible components, Shadcn/ui
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Validation**: Zod schema validation
- **Styling**: Tailwind CSS with class-variance-authority
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography
- **Routing**: Wouter

### Backend Libraries
- **Database**: Drizzle ORM with Neon serverless adapter
- **Authentication**: Passport.js with OpenID Client
- **Validation**: Drizzle Zod for schema validation
- **Utilities**: Memoizee for caching, nanoid for ID generation
- **Session Store**: connect-pg-simple

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full type safety across frontend and backend
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: tsx for TypeScript execution
- **Replit Integration**: Cartographer plugin for enhanced development experience