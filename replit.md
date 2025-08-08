# Business Daily Deals B2B Marketplace

## Overview

This is a full-stack B2B marketplace application called "Business Daily Deals" (www.businessdailydeals.com.za) that connects suppliers with buyers through targeted deal notifications and special pricing. The platform serves the South African B2B market, enabling suppliers to post deals (both hot deals with premium pricing and regular deals) while allowing buyers to discover opportunities through search, categories, and keyword-based notifications.

The application is built with a modern web stack featuring React frontend, Express.js backend, PostgreSQL database with Drizzle ORM, and uses Replit's authentication system for user management. The platform is fully operational with database migrations completed and authentication working correctly.

## Recent Changes (Aug 8, 2025)

### Header Implementation
- **STATUS**: Header charcoal gradient styling implemented with full navigation functionality
- **LIMITATION**: Full viewport-width extension constrained by CSS framework - multiple techniques attempted (viewport units, bleed methods, transforms, fixed positioning)
- **SOLUTION**: Applied horizontal scrolling to header content to ensure all menu items remain accessible when charcoal background extends beyond content width
- **RESOLUTION**: ✅ COMPLETED - All menu items now visible and accessible via top scroll bar; professional charcoal styling maintained
- **CONFIRMATION**: User verified successful access to all navigation menu items using horizontal scroll functionality
- Fixed CSS compilation errors by updating Tailwind opacity classes
- Completed PostgreSQL database setup and ran migrations successfully  
- Resolved TypeScript errors in frontend components for proper type safety
- Fixed server port configuration (running on port 5000 as configured)
- Fixed deal posting validation issues with proper schema handling for decimal fields and arrays
- Fixed TanStack Query URL construction issues causing "[object Object]" errors in deal browsing
- Changed currency from USD to South African Rand (ZAR) for local market
- Added "REGULAR" badges to regular deal cards for better visual identification
- Expanded business categories to 19 South African B2B categories including "Water" category
- Added expired deals dropdown with reactivation functionality for suppliers
- Removed buyer dashboard - only suppliers have dashboards now
- Fixed expired deals dropdown visibility and functionality on supplier dashboard
- Modernized home page with contemporary design, gradients, better layouts, and enhanced user experience
- Updated home page to show only hot deals (6 deals) - regular deals removed per user requirement
- Changed color scheme from blue to charcoal/slate throughout the application for brand consistency
- All core features are now working: authentication, deal management, role switching, notifications, deal posting, deal browsing, expired deal management
- Applied consistent charcoal/slate color scheme across all pages, components, and UI elements including header navigation
- Modified home page for non-authenticated users to show ONLY hot deals (no search, no other information)
- Fixed regular deal posting issue by removing required product images validation from both schema and client-side validation
- **COMPLETED: Comprehensive UI modernization across ALL pages** - Applied contemporary design patterns, modern gradients, enhanced layouts, and improved visual hierarchy throughout entire application
- **ADDED: Professional rates card (pricing table) feature** - Created reusable RatesCard component and dedicated /pricing page with supplier plans, buyer benefits, FAQ section, and South African Rand pricing
- **IMPLEMENTED: Dynamic rates management system** - Built complete rates table upload functionality with CSV/Excel support, database schema, API endpoints, and admin interface for uploading actual advertising rates data
- **ENHANCED: Browse Regular Deals button visibility** - Fixed contrast and styling issues on home page hero section, ensured both hero buttons have consistent white backgrounds for optimal visibility
- **COMPLETED: Advanced search system** - Built comprehensive search functionality for products, companies, and hot deals with category filters and modern UI
- **COMPLETED: Credits system with payment integration** - Implemented credit packages, Stripe payment gateway integration, credit balance management, and top-up functionality
- **COMPLETED: Alphabetical product directory** - Created organized directory with company listings, product categories, and easy navigation
- **COMPLETED: Main navigation structure** - Successfully implemented exact menu order: Home/How Site Works, Register as SUPPLIER, Register as BUYER, Find Me a Deal, Regular Deals, Rates per Advert, Coupons Downloaded, Contact Us
- **ADDED: Professional contact page** - Comprehensive contact form with business information, hours, and multiple contact methods
- **ADDED: Home page bottom features section** - Six community support cards: View Expired Deals, Report Bad Deals, Comment on Site, Share & Earn Credits, Membership Counters (suppliers/buyers), Products Listed Counter
- **UPDATED: Hot deals visibility** - Hot deals now only visible on home page for authenticated users; non-authenticated users see navigation to register instead
- **ADDED: Regular Deals to navigation** - Added Regular Deals menu item for buyers to browse all regular deals listings
- **COMPLETED: Comprehensive rates per advert system** - Built complete advertising rates marketplace with Excel-based pricing structure (1-30 days for regular deals, 1-7 days for hot deals), shopping basket functionality, and local South African payment processing (no Stripe needed)
- **IMPLEMENTED: Local payment solution** - Created ZAR-based credit purchase system specifically for South African market, bypassing international payment gateway limitations
- **ADDED: Credit balance display** - Suppliers can view current credit balance and purchase additional credits directly from rates page
- **COMPLETED: Enhanced My Credits page** - Restructured credits page with transaction history prominently displayed at the top, clear supplier identification in each transaction, account summary with company name/email, and improved navigation through "My Credits" menu item
- **ENHANCED: Authentication & session management** - Extended session duration to 30 days, added rolling sessions that refresh on activity, improved session timeout handling with better error messages, and enhanced query client to keep sessions alive with periodic refetching
- **COMPLETED: Unique page backgrounds** - Applied distinctive gradient backgrounds to all pages (home: emerald-green, deals: orange-yellow, credits: green-teal, rates: blue-sky, search: violet-indigo, etc.) for enhanced visual experience and better page identification
- **HOSTING STRATEGY**: Development and testing on Replit platform, final production deployment to Cybersmart (South African hosting) once design and functionality are complete
- **NEW FEATURES PLANNED**: Image upload for products, banner advertising system, analytics/hit counters, direct purchasing with delivery options
- **DEPLOYMENT FIXES APPLIED (Aug 8, 2025)**: 
  - Added comprehensive startup logging with environment variable verification
  - Implemented health check endpoint at /api/health for autoscale deployment diagnostics
  - Enhanced PORT environment variable handling with production deployment compatibility
  - Added database connection testing during server startup with proper error handling
  - Implemented graceful shutdown handling for SIGTERM and SIGINT signals
  - Added detailed error logging and environment information for production debugging
- **IMPLEMENTED: Professional image upload system** - Added complete file upload functionality with Google Cloud Storage integration, drag-and-drop interface, image previews, and proper validation for deal posting
- **RESOLVED: Full-width header implementation** - Identified and fixed parent container width constraints (859px) that were preventing header from extending to full viewport width (874px). Applied viewport-based sizing to HTML body, root div, and App container to enable complete screen-width charcoal header background
- **COMPLETED: Find Me a Deal feature** - Built comprehensive deal request system where buyers can submit specific product requirements (name, size, quantity, delivery destination, price range) with proper authentication, form validation, and database storage
- **FIXED: Session authentication issues** - Resolved cookie security settings for development environment to ensure proper authentication persistence and API request authorization
- **RESOLVED: User ID extraction in authentication** - Fixed authentication middleware to properly extract user ID from session claims (user.claims.sub) enabling successful deal request submissions
- **IMPLEMENTED: Deal request email notifications** - Added SendGrid email integration to automatically send deal requests to Business Daily Deals admin email for manual processing and supplier matching
- **COMPLETED: Currency system conversion** - Successfully converted all USD/dollar references to South African Rands (ZAR) throughout platform including navigation icons, pricing displays, and currency formatting
- **UPDATED: Navigation menu structure** - Changed menu order to: Home/HOT deals, Register as SUPPLIER, Register as BUYER, REGULAR deals, Supplier dashboard (per user requirements)
- **CREATED: Comprehensive registration system** - Built detailed buyer and supplier registration pages with all required fields from user specifications including personal info, company details, deal preferences, and data offer integration
- **ADDED: About Us page** - Created professional About Us page using provided content with sections for mission, values, deal types, and Find Me a Deal explanation
- **EXPANDED: User database schema** - Added all buyer fields (mobile, province, newsletter subscription, data offer preferences) and supplier fields (company details, item information, deal type preferences)
- **FIXED: Navigation menu consistency** - Ensured navbar is visible on ALL pages including landing and 404 pages for easy navigation between sections

## User Preferences

Preferred communication style: Simple, everyday language.
Brand name: Business Daily Deals
Domain: www.businessdailydeals.com.za
Target market: South African B2B marketplace
Pricing structure: Hot deals (premium home page placement, higher pricing) vs Regular deals (dropdown sections, standard pricing)
Color scheme preference: Charcoal/slate theme throughout application (header, components, UI elements)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API structure with modular route handlers
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage
- **Middleware**: Custom logging, error handling, and authentication middleware
- **Development**: Hot reload with Vite integration in development mode

### Database Schema
- **Users**: Store user profiles with buyer/supplier roles
- **Deals**: Central entity with categories, pricing, and deal types (hot/regular)
- **Keywords**: User-defined keywords for deal notifications
- **Notifications**: System-generated alerts for keyword matches
- **Inquiries**: Communication system between buyers and suppliers
- **Sessions**: Secure session storage in PostgreSQL

### Authentication & Authorization
- **Provider**: Replit OpenID Connect (OIDC) integration
- **Strategy**: Passport.js with custom OpenID strategy
- **Session Security**: HTTP-only cookies with PostgreSQL session store
- **Role-based Access**: Buyer and supplier roles with route protection

### Key Features
- **Deal Management**: Suppliers can create, edit, and manage hot deals and regular deals
- **Smart Notifications**: Keyword-based matching system that alerts buyers to relevant deals
- **Search & Discovery**: Full-text search with category filtering
- **Inquiry System**: Direct communication channel between buyers and suppliers
- **Supplier Dashboard**: Comprehensive dashboard for suppliers to manage deals, view inquiries, and reactivate expired deals
- **Responsive Design**: Mobile-first approach with responsive navigation

## External Dependencies

### Core Services
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: Replit OIDC service
- **Session Storage**: PostgreSQL with connect-pg-simple

### Frontend Libraries
- **UI Framework**: Radix UI primitives for accessible components
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Validation**: Zod schema validation
- **Styling**: Tailwind CSS with class-variance-authority
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

### Backend Libraries
- **Database**: Drizzle ORM with Neon serverless adapter
- **Authentication**: Passport.js with OpenID Client
- **Validation**: Drizzle Zod for schema validation
- **Utilities**: Memoizee for caching, nanoid for ID generation

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full type safety across frontend and backend
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: tsx for TypeScript execution
- **Replit Integration**: Cartographer plugin for enhanced development experience