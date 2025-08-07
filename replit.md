# Business Deals B2B Marketplace

## Overview

This is a full-stack B2B marketplace application called "Business Deals" that connects suppliers with buyers through targeted deal notifications and special pricing. The platform enables suppliers to post deals (both hot deals with premium pricing and regular deals) while allowing buyers to discover opportunities through search, categories, and keyword-based notifications.

The application is built with a modern web stack featuring React frontend, Express.js backend, PostgreSQL database with Drizzle ORM, and uses Replit's authentication system for user management. The platform is fully operational with database migrations completed and authentication working correctly.

## Recent Changes (Aug 7, 2025)
- Fixed CSS compilation errors by updating Tailwind opacity classes
- Completed PostgreSQL database setup and ran migrations successfully  
- Resolved TypeScript errors in frontend components for proper type safety
- Fixed server port configuration (running on port 5000 as configured)
- All core features are now working: authentication, deal management, role switching, notifications

## User Preferences

Preferred communication style: Simple, everyday language.

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
- **Dashboard Views**: Role-specific dashboards for buyers and suppliers
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