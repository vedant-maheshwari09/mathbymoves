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

## Technical Architecture Deep Dive

### Application Stack
- **Frontend**: React 18 with TypeScript, Vite build tool, Tailwind CSS + shadcn/ui
- **Backend**: Node.js with Express, TypeScript execution via TSX
- **Email System**: Gmail SMTP via Nodemailer with complete verification workflow  
- **Database**: In-memory storage using JavaScript Maps for development
- **State Management**: TanStack React Query for server state, React Hook Form for forms
- **Validation**: Zod schemas shared between frontend and backend
- **Styling**: CSS custom properties, Tailwind utilities, custom chess-themed design

### Email Verification System Flow
1. **Form Submission**: User submits contact form → Zod validation → Rate limiting check → Spam detection
2. **Token Generation**: Server creates unique verification token → Stores unverified message in database
3. **Verification Email**: Gmail SMTP sends HTML email with clickable verification link
4. **Email Verification**: User clicks link → Server validates token → Marks message as verified
5. **Message Forwarding**: Verified message forwarded to mathbymoves@gmail.com with proper headers
6. **User Confirmation**: Confirmation email sent back to user → Beautiful success page displayed

### File Architecture
- **`server/routes.ts`**: API endpoints (`/api/contact`, `/api/verify-email`) with complete email logic
- **`server/storage.ts`**: In-memory data persistence using Map objects with type safety
- **`shared/schema.ts`**: Drizzle ORM schemas and Zod validation shared across frontend/backend
- **`client/src/components/contact-section.tsx`**: React Hook Form with TanStack Query mutations
- **`client/src/components/navigation.tsx`**: Smooth scrolling navigation with mobile support
- **`tailwind.config.ts`**: Custom design system with chess-themed colors and animations

## Changelog

```
Changelog:
- June 26, 2025. Project cleanup - removed alternative deployment methods:
  * Removed static HTML files and Netlify-specific configurations
  * Eliminated Formspree integration files (static-index-netlify.html, netlify.toml, etc.)
  * Cleaned up 40+ unnecessary image files and screenshots
  * Project now focused solely on professional full-stack email verification system
  * Ready for deployment to server platforms (Replit, Railway, Render, Heroku)
- June 26, 2025. Email verification system fully confirmed working:
  * Complete email flow tested and verified: form submission → verification email → user clicks link → message forwards to mathbymoves@gmail.com
  * Gmail SMTP authentication successful with 250 OK responses for valid email addresses
  * System correctly handles invalid domains (example.com) with appropriate bounce notifications
  * Enhanced verification success page displays beautifully when users click email links
  * Professional confirmation emails sent back to verified users
  * All spam protection and rate limiting working properly
- June 26, 2025. Complete email verification system working perfectly:
  * Fixed verification URL generation - links now work properly from email clients
  * Verification emails correctly sent to user's email address with working Replit domain URLs
  * Users verify their email before messages reach mathbymoves@gmail.com
  * Strong verification prevents fake email addresses from submitting messages
  * Reliable delivery to mathbymoves@gmail.com with proper email headers and replyTo fields
  * Professional user confirmations sent back to verified email addresses
  * Enhanced spam protection: rate limiting, disposable email blocking, keyword filtering
  * All email credentials secured with environment variables for public deployment safety
  * Full system tested and working: user form → verification email → clickable link → message delivery → user confirmation
- June 26, 2025. Security hardening for public deployment:
  * Removed all hardcoded email credentials from source code
  * Email system now uses only environment variables (EMAIL_USER, EMAIL_PASSWORD)
  * Proper validation for missing credentials with error handling
  * Code is now safe for public repository deployment with no exposed secrets
- June 23, 2025. Created complete static website for simple Netlify deployment:
  * Built self-contained HTML file with all features (no build process required)
  * Added user's actual chess photo to About section (replaced stock image)
  * Implemented working contact form using Formspree service for direct email delivery
  * Eliminated all dependency conflicts and build errors with CDN-based approach
  * Maintained all existing content: chess achievements, math accomplishments, class offerings
  * Contact form sends submissions directly to mathbymoves@gmail.com
  * Single-file deployment ready for drag-and-drop to Netlify
- June 19, 2025. Enhanced chess achievements and class descriptions:
  * Updated chess coaching to include "Tournament preparation and competitive mindset and psychology"
  * Added "Error analysis and common mistake prevention" to AMC 8 preparation features
  * Added new chess achievement: "Top 20 Quick Rating Under 16" for speed chess mastery
  * Updated existing achievement to "Top 20 Standard Rating Age 15" for accuracy
  * Corrected Top 50 in California achievement year to 2025
  * Reordered achievements chronologically (3 achievements in 2025, 1 in 2024)
  * Improved display to show all 4 chess achievements dynamically
  * Standardized math achievements to use same 4-column grid layout as chess section
  * Made all achievement cards uniform height with consistent spacing and alignment
  * Updated chess section heading to "Chess Achievements (Rankings)" for clarity
  * Changed about section heading from "About Vedant" to "About Me" for personal connection
  * Fixed Netlify build configuration to resolve missing module errors
  * Improved clarity of coaching services offered to potential students
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