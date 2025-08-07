# Business Daily Deals B2B Marketplace

## Overview

This is a full-stack B2B marketplace application called "Business Daily Deals" (www.businessdailydeals.com.za) that connects suppliers with buyers through targeted deal notifications and special pricing. The platform serves the South African B2B market, enabling suppliers to post deals (both hot deals with premium pricing and regular deals) while allowing buyers to discover opportunities through search, categories, and keyword-based notifications.

The application is built with a modern web stack featuring React frontend, Express.js backend, PostgreSQL database with Drizzle ORM, and uses Replit's authentication system for user management. The platform is fully operational with database migrations completed and authentication working correctly.

## Recent Changes (Aug 7, 2025)
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
- Changed color scheme from blue to olive and charcoal throughout the application for brand consistency
- All core features are now working: authentication, deal management, role switching, notifications, deal posting, deal browsing, expired deal management
- Applied consistent olive and charcoal color scheme across all pages, components, and UI elements
- Modified home page for non-authenticated users to show ONLY hot deals (no search, no other information)
- Fixed regular deal posting issue by removing required product images validation from both schema and client-side validation

## User Preferences

Preferred communication style: Simple, everyday language.
Brand name: Business Daily Deals
Domain: www.businessdailydeals.com.za
Target market: South African B2B marketplace
Pricing structure: Hot deals (premium home page placement, higher pricing) vs Regular deals (dropdown sections, standard pricing)

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