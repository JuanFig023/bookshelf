# 📚 BookShelf - Library Management System

A modern, full-stack library management system built with React, GraphQL, and PostgreSQL. Users can browse books, check out copies, and admins can manage the entire catalog.

[Deployment URL](https://bookshelf-frontend-mz1m.onrender.com)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![GraphQL](https://img.shields.io/badge/GraphQL-16.8.1-e10098.svg)
![Node](https://img.shields.io/badge/Node.js-18+-339933.svg)

## ✨ Features

### User Features
- 📖 **Browse Library** - Discover books by category (Fiction, Romance, Fantasy, Dystopian Fiction, Classic Literature)
- 🔍 **Search Functionality** - Find your favorite books quickly
- 📚 **Book Details** - View detailed information about each book including available editions
- ✅ **Checkout System** - Borrow books with automatic due date tracking (14 days)
- 📋 **My Checkouts** - Track your active and returned books
- 🔐 **User Authentication** - Secure login and registration system

### Admin Features
- ➕ **Book Management** - Create, edit, and delete books from the catalog
- 📝 **Edition Management** - Add and remove editions (Hardcover, Paperback, Ebook, Audiobook, CD)
- 📊 **Inventory Tracking** - Monitor available copies for each edition
- 🔒 **Role-Based Access** - Admin-only panel with restricted access

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0**
- **Vite**
- **Apollo Client 3.14.0** - GraphQL client for data fetching
- **React Router DOM 7.10.1** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Lucide React** - Icon library

### Backend
- **Node.js + Express** - Server framework
- **Apollo Server 4.10.0** - GraphQL server
- **Prisma 5.22.0** - Next-generation ORM
- **PostgreSQL** - Relational database
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JuanFig023/bookshelf.git
   cd bookshelf
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with the following the .env.example file:
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database with sample data
   npm run seed
   
   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend GraphQL Playground: http://localhost:4000/graphql
   - Prisma Studio: `npx prisma studio` (runs on http://localhost:5555)

### Default User Accounts
After seeding, you can login with:

**Admin Account:**
- Email: `admin@library.com`
- Password: `password123`

**Test User Account:**
- Email: `test@library.com`
- Password: `password123`

## 🔐 Authentication & Security

- **JWT Tokens** - Stored in httpOnly cookies for security
- **Password Hashing** - bcryptjs with salt rounds
- **Role-Based Access Control** - USER and ADMIN roles
- **Protected Routes** - Client-side route guards
- **CORS Configuration** - Configured for localhost development

## 📊 Database Schema

### Models
- **User** - Authentication and user information
- **Book** - Book catalog with title, author, ISBN, genre, etc.
- **Edition** - Different formats of books (Hardcover, Paperback, etc.)
- **Checkout** - Tracks borrowed books with due dates and status

### Key Relationships
- One Book → Many Editions
- One Edition → Many Checkouts
- One User → Many Checkouts

## 🎨 UI/UX Features

- **Clean, Modern Interface** - Consistent design with shadcn/ui
- **Responsive Layout** - Fixed sidebar navigation and top bar
- **Category Filtering** - Browse books by genre
- **Search Bar** - Real-time book search
- **User Profile Display** - Shows logged-in user info
- **Visual Feedback** - Success/error messages for actions

## 🧪 Available Scripts

### Backend
```bash
npm run dev       # Start development server with hot reload
npm run seed      # Seed database with sample data
```

### Frontend
```bash
npm run dev       # Start Vite development server
```

## 📝 GraphQL API

### Queries
- `books` - Get all books with editions
- `book(id: ID!)` - Get single book by ID
- `me` - Get current authenticated user
- `myCheckouts` - Get current user's checkouts

### Mutations
- `signup(email, password, name)` - Create new user account
- `login(email, password)` - Authenticate user
- `logout` - End user session
- `checkoutEdition(editionId)` - Borrow a book
- `returnEdition(checkoutId)` - Return a borrowed book
- `createBook(...)` - Admin: Add new book
- `updateBook(id, ...)` - Admin: Edit book
- `deleteBook(id)` - Admin: Remove book (cascades to editions and checkouts)
- `createEdition(...)` - Admin: Add edition to book
- `deleteEdition(id)` - Admin: Remove edition

## 📄 License

This project is licensed under the MIT License.
