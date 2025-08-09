# Business Daily Deals B2B Marketplace

## Overview

Business Daily Deals (www.businessdailydeals.com.za) is a full-stack B2B marketplace for the South African market. It connects suppliers and buyers, facilitating the exchange of goods and services through targeted deal notifications and special pricing. Suppliers can post both premium "hot deals" and standard "regular deals." Buyers can discover opportunities via search, categories, and keyword-based notifications. The platform aims to be a fully operational and modern B2B e-commerce solution, currently under development on Replit with a planned production deployment to Cybersmart.

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
- **UI/UX Decisions**: Modern design, gradients, enhanced layouts, professional rates card, and unique gradient backgrounds per page (e.g., emerald-green for home, orange-yellow for deals). Consistent charcoal/slate color scheme across all UI elements.

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
- **Home Page**: Modernized design with animated casino-style one-armed bandit featuring authentic red 7's spinning vertically at different speeds, showing only hot deals for authenticated users.
- **Supplier Verification**: Optional verification system with VAT and business registration number fields, verified supplier badges with shield icons displayed on deal cards.

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