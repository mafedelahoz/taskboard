# TaskBoard - Project Management Tool

A minimal project management application built with Next.js, featuring real-time task management and a modern UI.

## Features

- Create and manage projects
- Add and track tasks
- Secure authentication
- Fully responsive design
- Optimistic UI updates

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form
- **Deployment**: Vercel

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/mafedelahoz/taskboard
   cd taskboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Fill in the required environment variables:
     ```
     DATABASE_URL=""
     NEXTAUTH_SECRET=""
     NEXTAUTH_URL=""
     ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open "" in your browser

## Architectural Decisions

### 1. App Router & Server Components
- Utilized Next.js 13 App Router for improved performance and better SEO
- Strategic use of Server and Client Components to optimize rendering
- Server Components for static layouts and Client Components for interactive elements

### 2. Authentication Strategy
- Implemented NextAuth.js for secure, session-based authentication
- Protected routes and API endpoints
- Seamless authentication flow with minimal friction

### 3. Data Management
- MongoDB for flexible schema and scalability
- Prisma ORM for type-safe database operations
- Optimistic updates for better user experience

### 4. UI/UX Decisions
- Clean, minimalist design for better focus
- Responsive layout with mobile-first approach
- Smooth transitions and loading states
- Consistent visual language across the application

## Future Improvements

Given more time, these are the areas I would focus on improving:

### 1. Enhanced Features
- Drag and drop task reordering
- Rich text editor for task descriptions
- Task due dates and priorities
- Project categories and tags
- Task comments and attachments

### 2. Performance Optimizations
- Implement data caching
- Add pagination for large projects
- Optimize image loading and assets
- Add service worker for offline support

### 3. Developer Experience
- Add comprehensive test coverage
- Add detailed API documentation

### 4. User Experience
- Add keyboard shortcuts
- Implement dark mode
