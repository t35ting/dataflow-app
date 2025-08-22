# Overview

This is a full-stack problem management system built with React, TypeScript, Express, and PostgreSQL. The application allows users to upload, manage, and track coding problems via CSV import, with features for filtering, editing, and analytics. The system includes protected edit functionality through key-based authentication and comprehensive data validation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL schema
- **Validation**: Zod schemas shared between client and server
- **File Processing**: Papa Parse for CSV handling
- **Storage Pattern**: Repository pattern with in-memory fallback storage

## Data Layer
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Single problems table with fields for ID, title, difficulty, tags, link, status, notes, and metadata
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon Database serverless connection

## Authentication & Security
- **Edit Protection**: Key-based authentication (`qwerty@321123`) for modification operations
- **Session Management**: Express sessions with connect-pg-simple store
- **Input Validation**: Comprehensive Zod schemas for all data inputs
- **CSRF Protection**: Built-in Express security measures

## Key Features
- **CSV Import Pipeline**: Multi-stage validation, normalization, and deduplication
- **Real-time Analytics**: Difficulty distribution, tag statistics, and progress tracking
- **Advanced Filtering**: Search, difficulty, status, and pagination support
- **Edit Management**: Protected edit mode with audit trails
- **Data Export**: CSV export functionality for backup and sharing

## Design Patterns
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Type Safety**: End-to-end TypeScript with shared type definitions
- **Component Composition**: Reusable UI components with consistent design system
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Progressive Enhancement**: Graceful degradation for various user scenarios

# External Dependencies

## Database & Storage
- **@neondatabase/serverless**: Serverless PostgreSQL connection for Neon Database
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database schema management and migrations

## UI & Styling
- **@radix-ui/react-***: Accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **lucide-react**: Icon library

## Data Processing
- **papaparse**: CSV parsing and processing
- **date-fns**: Date manipulation utilities
- **recharts**: Data visualization and charting

## Development & Build
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-***: Replit-specific development enhancements

## State Management
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation integration

## Validation & Schemas
- **zod**: Runtime type validation and schema definition
- **drizzle-zod**: Integration between Drizzle and Zod schemas