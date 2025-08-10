# Business Daily Deals B2B Marketplace

## Overview
Business Daily Deals (www.businessdailydeals.co.za) is a full-stack B2B marketplace for the South African market. It connects suppliers and buyers, facilitating the exchange of goods and services through targeted deal notifications and special pricing. The platform aims to be a fully operational and modern B2B e-commerce solution, currently under development on Replit with production deployment hosted by Cybersmart (www.cybersmart.co.za) in South Africa. Key capabilities include suppliers posting premium "hot deals" and standard "regular deals," and buyers discovering opportunities via search, categories, and keyword-based notifications.

## User Preferences
Preferred communication style: Simple, everyday language.
Brand name: Business Daily Deals
Domain: www.businessdailydeals.com.za
Target market: South African B2B marketplace
Pricing structure: Hot deals (premium home page placement, higher pricing) vs Regular deals (dropdown sections, standard pricing)
NEW PROMOTIONAL PERIOD: FREE deal posting for suppliers until 1st January 2026 to build user base quickly, then start charging
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
- **Deal Management**: Suppliers can create, edit, manage hot and regular deals, and reactivate expired deals.
- **Smart Notifications**: Keyword-based matching system for relevant deal alerts with multi-channel support.
- **Search & Discovery**: Comprehensive search for products, companies, and hot deals with category filters.
- **Inquiry System**: Direct communication between buyers and suppliers.
- **Supplier Dashboard**: For managing deals, inquiries, and expired deals.
- **Credit System**: Credit packages, local ZAR payment integration, balance management, and transaction history.
- **Image Upload**: Professional file upload with Google Cloud Storage integration.
- **"Find Me a Deal"**: System for buyers to submit specific product requirements.
- **Rates per Advert**: Comprehensive advertising rates marketplace with shopping basket functionality.
- **Registration System**: Detailed buyer and supplier registration pages with keyword notification setup and multi-channel alert preferences.
- **Homepage**: Comprehensive design with animated casino-style one-armed bandit, business statistics, Quick Access Features, How It Works 3-step process, value proposition, and comprehensive footer. All content accessible to everyone.
- **Supplier Verification**: Optional verification system with VAT and business registration number fields, verified supplier badges.
- **Legal & Support Pages**: Comprehensive Terms of Service, Privacy Policy, Support Center.
- **Security Features**: Multi-layer security including rate limiting, input validation, security headers, IP blocking, and protection against common web attacks.
- **Live Coupons System**: Public coupon tracking page with comprehensive buyer identification details, individual coupon printing with professional Business Daily Deals design, single-page print optimization, and complete deal information display.

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