# LuxeStore - Storm Shelter E-commerce Platform

## Overview

This is a full-stack e-commerce application built for selling underground concrete storm shelters. The platform features an immersive product experience with 3D interactive demos, virtual tours, and a premium shopping interface. The application follows a monorepo structure with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Context API for global store state, TanStack Query for server state
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **3D Graphics**: React Three Fiber with Three.js for interactive shelter demos and virtual tours
- **Animations**: Framer Motion for page transitions and parallax effects, React Spring for 3D animations
- **Typography**: Playfair Display (headings) and Inter (body text) from Google Fonts

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Build Tool**: esbuild for server bundling, Vite for client
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Development**: Hot module replacement via Vite middleware

### Data Storage
- **Database**: PostgreSQL via Neon serverless driver (`@neondatabase/serverless`)
- **ORM**: Drizzle ORM with Zod schema validation
- **Schema Location**: `shared/schema.ts` contains database table definitions
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)
- **In-Memory Fallback**: `MemStorage` class in `server/storage.ts` for development without database

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/  # UI components (shadcn/ui + custom)
│   │   ├── pages/       # Route page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities, mock data, store context
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data access layer interface
│   └── vite.ts       # Vite dev server integration
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema
└── migrations/       # Database migration files
```

### Key Design Patterns
- **Storage Interface**: `IStorage` interface in `server/storage.ts` abstracts data access, allowing easy swap between in-memory and database implementations
- **Shared Schema**: Database schema and TypeScript types are defined once in `shared/schema.ts` and used by both frontend and backend
- **Component Library**: shadcn/ui components in `client/src/components/ui/` provide consistent, accessible UI primitives
- **Theme System**: CSS custom properties with Tailwind for light/dark mode and customizable theming

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database accessed via `DATABASE_URL` environment variable
- **Connection**: Uses `@neondatabase/serverless` driver optimized for edge/serverless environments

### Frontend Libraries
- **3D Rendering**: `@react-three/fiber`, `@react-three/drei`, `three` for WebGL shelter visualization
- **Animation**: `framer-motion` for UI animations, `@react-spring/three` for 3D object animations
- **UI Components**: Full shadcn/ui component suite with Radix UI primitives

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **Tailwind CSS**: Utility-first CSS framework with `@tailwindcss/vite` plugin
- **TypeScript**: Strict mode enabled across the entire codebase

### Replit-Specific
- **Error Overlay**: `@replit/vite-plugin-runtime-error-modal` for development error display
- **Cartographer**: `@replit/vite-plugin-cartographer` for file navigation in development
- **Dev Banner**: `@replit/vite-plugin-dev-banner` for development environment indicator

## Recent Changes (January 2026)

### Booking Confirmation Emails
- Resend integration for automated booking confirmation emails (`server/email.ts`)
- Branded HTML email template with booking details, order summary, and next steps
- Emails sent automatically when booking is created

### Streamlined Process
- Changed from 5-step to 4-step process (removed "Prep Your Site" step)
- Steps: Secure Your Spot → Schedule Delivery → Finalize Payment → Delivery Day

### Admin Features
- Bookings management at `/admin/bookings` with full CRUD operations
- Enhanced table view: Booking ID, customer details, full address, deposit status, creation date
- Calendar-based slot management for delivery capacity
- Payment and booking status tracking

### Cleanup
- Removed cart abandonment tracking system (ScarcityPopup, cart session endpoints)
- Cleaned up unused schema and storage code for cart_sessions and email_reminders

## Google Shopping Integration

### Pricing Strategy
- **Base Price**: $4,250 (Stock #706900)
- **Shipping**: $5.50/mile from Grandview, MO (38.8814, -94.5314)
- **City-Level Pricing**: Each city has its own distance-based price
- **Discount**: $900 off displayed price for Google Shopping visitors

### URL Parameters
- `?state=XX&price=XXXXX&city=Dallas` - Parsed from Google Shopping feed links
- **Offer Persistence**: 30-minute TTL in localStorage (`google_shopping_offer` key)
- **Timer Persistence**: Countdown timer state preserved across navigation (`google_shopping_timer` key)

### XML Feed
- **Location**: `client/public/google-shopping-feed.xml`
- **Coverage**: 77 city-level products across 18 states
- **States**: MO, KS, OK, TX, AR, NE, IA, SD, LA, MS, AL, TN, IL, IN, OH, KY, GA, CO, MN, WI
- **Price Calculation**: $4,250 + (city distance × $5.50)

### Key Files
- `client/src/lib/urlParams.ts` - URL parameter parsing and offer persistence
- `client/src/components/ProductPricing.tsx` - Dynamic pricing display
- `client/src/components/UrgencyTimer.tsx` - Countdown timer component

## User Preferences & Design Decisions
- **Brand Colors**: Orange (#E69138) for primary actions, Brown (#3E2723) for text/accents
- **Design Style**: Premium SaaS aesthetic (Stripe/Linear style) - no cards, borders, or template elements; generous whitespace
- **Family Business Positioning**: Midwest heartland, husband/wife team from Kansas City area
- **Navigation**: "Slope Storm Shelter" link for SEO, About Us, Contact Us
- **No year references**: Removed all "2025" mentions to keep content evergreen
- **No professional installation**: Service not provided by company
- **Email Service**: Resend (RESEND_API_KEY secret configured)