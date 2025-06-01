# TaskBoard - Project Management Tool

A minimal project management application built with Next.js, featuring real-time task management and a modern UI. Visit the live application at [taskboard-ecru.vercel.app](https://taskboard-ecru.vercel.app).

## Features

- Secure authentication with email
- Create and manage multiple projects
- Add and track tasks within projects
- Mark tasks as complete/incomplete
- Modern, responsive UI with smooth animations
- Real-time updates with optimistic UI
- Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form
- **Styling**: CSS-in-JS with styled-jsx
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
   

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architectural Decisions

### App Router & Server Components
- Utilized Next.js 13 App Router for improved performance and better SEO
- Strategic use of Server and Client Components to optimize rendering
- Server Components for static layouts and Client Components for interactive elements

### Authentication Strategy
- Implemented NextAuth.js for secure, session-based authentication
- Protected routes and API endpoints with proper session validation
- Centralized auth configuration for better maintainability
- Seamless authentication flow with minimal friction

### Data Management
- MongoDB for flexible schema and scalability
- Prisma ORM for type-safe database operations
- Optimistic updates for better user experience
- Proper error handling and loading states

###  UI/UX Decisions
- Modern design with gradient backgrounds
- Clean, minimalist interface for better focus
- Responsive layout with mobile-first approach
- Smooth transitions and loading animations
- Consistent visual language and spacing
- Semi-transparent elements for depth
- Clear visual feedback for user actions

## Future Improvements

Given more time, these are the areas I would focus on improving:

### Enhanced Features
- Drag and drop task reordering
- Rich text editor for task descriptions
- Task due dates and priorities
- Project categories and tags
- Task comments and attachments

### Performance Optimizations
- Implement data caching
- Add pagination for large projects
- Optimize image loading and assets

### Developer Experience
- Add comprehensive test coverage
- Add detailed API documentation
- Add error tracking and monitoring

### User Experience
- Add keyboard shortcuts
- Implement dark mode
- Add more customization options
- Add bulk actions for tasks
- Implement undo/redo functionality
