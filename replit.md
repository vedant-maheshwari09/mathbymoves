# Chess Player Portfolio - System Architecture

## Overview

This is a full-stack web application showcasing a professional chess player's portfolio. The application features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and Drizzle ORM for database operations. The architecture follows a clean separation between client and server concerns, with shared schema definitions for type safety.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for HTTP server and API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Development**: TSX for TypeScript execution in development

### Database Architecture
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Tables**:
  - `users`: User authentication and profile data
  - `contact_messages`: Contact form submissions with timestamps

## Key Components

### Client Components
- **Navigation**: Fixed header with smooth scrolling navigation
- **Hero Section**: Landing area with call-to-action buttons
- **About Section**: Professional biography and statistics
- **Achievements Section**: Tournament results and accomplishments
- **Gallery Section**: Visual showcase of chess-related images
- **Contact Section**: Form for visitor inquiries with validation

### Server Components
- **API Routes**: RESTful endpoints for contact form submission
- **Storage Layer**: Abstracted storage interface with in-memory fallback
- **Middleware**: Request logging and error handling
- **Static Serving**: Vite integration for development and production assets

### Shared Components
- **Schema Definitions**: Centralized database schema with Zod validation
- **Type Definitions**: Shared TypeScript interfaces for type safety

## Data Flow

1. **Contact Form Submission**:
   - User fills contact form with validation
   - Form data validated using Zod schemas
   - API request sent to `/api/contact` endpoint
   - Server validates and stores message in database
   - Success/error feedback displayed to user

2. **Page Navigation**:
   - Single-page application with smooth scrolling
   - Navigation triggers scroll to specific sections
   - No server-side routing required for main content

3. **Asset Delivery**:
   - Vite handles static asset optimization
   - Images served from external CDN (Unsplash)
   - CSS and JavaScript bundled and minified for production

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Libraries**: Radix UI primitives, Tailwind CSS, shadcn/ui
- **Database**: Drizzle ORM, Neon Database serverless driver
- **Development**: Vite, TypeScript, TSX

### External Services
- **Image CDN**: Unsplash for placeholder chess-themed images
- **Font Provider**: Google Fonts (Playfair Display, Inter, Poppins)
- **Database Hosting**: Configured for Neon Database (PostgreSQL)

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **Database**: PostgreSQL via Neon Database connection
- **Port Configuration**: Server runs on port 5000
- **Environment**: NODE_ENV=development

### Production Build
- **Frontend Build**: Vite builds optimized static assets
- **Backend Build**: esbuild bundles server code as ESM
- **Database**: Production PostgreSQL instance
- **Deployment Target**: Replit autoscale deployment

### Build Process
1. `npm run build` triggers both frontend and backend builds
2. Frontend assets compiled to `dist/public`
3. Server code bundled to `dist/index.js`
4. Production server serves static files and API endpoints

## Changelog

```
Changelog:
- June 19, 2025. Analytics integration prepared for post-deployment:
  * Added Google Analytics tracking code structure
  * Configured automatic page view tracking for single-page application
  * Set up event tracking capabilities for user interactions
  * Analytics will activate once VITE_GA_MEASUREMENT_ID is added to secrets
- June 17, 2025. Email verification system and comprehensive spam protection:
  * Implemented mandatory email verification - users must click link in their email to complete submission
  * Only verified real email addresses can send messages to mathbymoves@gmail.com
  * Added email confirmation field to prevent typos and ensure accuracy
  * Enhanced rate limiting (3 per IP, 2 per email address per 15 minutes)
  * Expanded disposable email blocking and spam keyword detection
  * Added pattern detection for repeated characters, excessive links, and caps
  * Message length validation (20-2000 characters) for quality control
  * Verification emails sent automatically, messages forwarded only after email verification
- June 17, 2025. Footer improvements and initial spam protection:
  * Fixed copyright year from 2024 to 2025
  * Enhanced footer text layout with proper line breaks for clean rectangular appearance
  * Updated contact email from howdy.vedant@gmail.com to mathbymoves@gmail.com
- June 17, 2025. Final polish and testimonial improvements:
  * Updated hero background to chess/mathematics themed image for better relevance
  * Enhanced footer description to include both chess and math expertise
  * Improved testimonials with more compelling success stories (Shawn L. AMC Honor Roll, Rayansh M. national-level chess player)
  * Emphasized email as preferred contact method throughout site
  * Removed social media links from footer (user doesn't use social platforms)
- June 17, 2025. Portfolio refinements and layout improvements:
  * Fixed chess achievements layout - National Master now positioned in center column
  * Updated achievement title to "Top 20 for Age 15" (simplified from previous version)
  * Replaced stock photo with user's actual chess photo in about section
  * Removed redundant statistics boxes and career timeline from achievements section
  * Consolidated chess classes into single comprehensive offering (Beginner to Expert)
  * Made class scheduling flexible for both AMC 8 and chess coaching
  * Updated location to San Diego, California in contact section
- June 17, 2025. Updated with Vedant's real information:
  * Added National Master title (2265 USCF rating)
  * Updated to rising sophomore in high school
  * Added math competition achievements (Math Kangaroo 1st, MOEMS winner, AMC 8 Achievement Roll)
  * Replaced gallery section with classes section (AMC 8 prep, chess coaching)
  * Updated contact email to mathbymoves@gmail.com
  * Added user's chess photo to about section
- June 17, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```