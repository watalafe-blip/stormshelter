# AI Rules for Home Defend Pro Application

This document outlines the technical stack and specific library usage guidelines for the Home Defend Pro application. Adhering to these rules ensures consistency, maintainability, and leverages the strengths of our chosen technologies.

## Tech Stack Overview

*   **Frontend Framework**: React 18 with TypeScript for building interactive user interfaces.
*   **Routing**: Wouter for lightweight and efficient client-side navigation.
*   **State Management**: React Context API for global application state, complemented by TanStack Query for robust server-side data management.
*   **Styling**: Tailwind CSS v4 for utility-first styling, integrated with shadcn/ui components (New York style) for a consistent and modern UI.
*   **3D Graphics**: React Three Fiber, Three.js, and Drei for immersive 3D interactive demos and virtual tours.
*   **Animations**: Framer Motion for declarative UI animations and React Spring for physics-based 3D animations.
*   **Backend**: Node.js with Express.js and TypeScript for building RESTful API endpoints.
*   **Database**: PostgreSQL, accessed via the Neon serverless driver, with Drizzle ORM for type-safe database interactions.
*   **Build Tools**: Vite for fast frontend development and bundling, and esbuild for efficient backend compilation.
*   **Icons**: Lucide-React for a comprehensive set of vector icons.

## Library Usage Guidelines

To maintain a cohesive and efficient codebase, please follow these guidelines for library usage:

*   **UI Components**:
    *   **Always** prioritize `shadcn/ui` components found in `client/src/components/ui/`.
    *   If a required component is not available in `shadcn/ui`, create a **new, small, and focused component** in `client/src/components/` and style it exclusively with Tailwind CSS.
    *   **Never** modify existing `shadcn/ui` component files directly.
*   **Styling**:
    *   Use **Tailwind CSS** for all styling. Avoid custom CSS files or extensive inline styles unless absolutely necessary for complex animations or 3D canvas elements.
*   **Routing**:
    *   Use **Wouter** for all client-side routing within the `client/src/App.tsx` file.
*   **Server-Side Logic**:
    *   All backend API endpoints must be built using **Express.js** within the `server/` directory.
*   **Database Interactions**:
    *   All database operations (CRUD) must be performed using **Drizzle ORM** with the PostgreSQL database.
*   **Form Validation**:
    *   Utilize **Zod** for defining and validating schemas for both frontend forms and backend API request bodies.
*   **Icons**:
    *   Integrate icons using the **`lucide-react`** library.
*   **3D Rendering**:
    *   For any 3D visualizations, leverage **`@react-three/fiber`**, **`@react-three/drei`**, and **`three`**.
*   **Animations**:
    *   Use **`framer-motion`** for general UI animations and transitions.
    *   For physics-based or more complex 3D animations, use **`@react-spring/three`** or **`@react-spring/web`**.
*   **Date Handling**:
    *   All date manipulation and formatting should be done using **`date-fns`**.
*   **Toasts/Notifications**:
    *   For user feedback notifications, use the `useToast` hook from `client/src/hooks/use-toast.ts`.
*   **API Calls (Frontend)**:
    *   For fetching, caching, and synchronizing server state, use **`@tanstack/react-query`**.
    *   For direct, one-off API requests not managed by TanStack Query, use the native `fetch` API.
*   **Email Sending (Backend)**:
    *   Use the **`resend`** library for sending all transactional and marketing emails. Ensure `RESEND_API_KEY` is configured.
*   **Authentication (Backend)**:
    *   Use **`bcryptjs`** for securely hashing and comparing passwords.
    *   Use **`jsonwebtoken`** for creating and verifying JWT tokens for session management.