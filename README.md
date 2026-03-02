# 📚 Smart Library Management System

A full-stack Library Management System with smart book recommendations, built with **Vite + React.js** (frontend) and **Spring Boot + JPA** (backend).

---

## 🏗️ Project Structure

```
library-management/
├── backend/          # Spring Boot application (Java 17)
└── frontend/         # Vite + React application
```

---

## 📋 Features

### 🏠 Main Page (Home)
- Hero section with call-to-action
- Feature highlights
- Links to login/register

### 👤 User Login & Registration
- Secure JWT-based authentication
- Form validation
- Auto-redirect to dashboard after login

### 👥 Admin Login
- Same login page — role detected automatically
- Redirected to Admin Dashboard

### 📊 Admin Dashboard
- **Overview**: Stats (total users, books, borrowed, returned)
- **Manage Books**: Add, edit, delete books with genre tagging
- **Borrow Records**: View all borrow records, mark books as returned
- **Fine Management**: See all fines, amounts, overdue info
- **Users**: View all registered users

### 📖 User Dashboard
- **Overview**: Personal stats + Smart Recommendations based on reading history
- **Browse Books**: Search books by title/author/genre, borrow books
- **My Books**: View borrowed books, return them
- **Fines**: View personal fine history

### 🤖 Smart Recommendations
- Analyzes user's borrowing history
- Recommends books from the user's favorite genre
- Falls back to popular books for new users
- Only recommends books not yet borrowed

### 💰 Fine Management
- $1.00 fine per day overdue
- 14-day borrowing period
- Automatic calculation on return

---

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2** — REST API
- **Spring Security** — Authentication & Authorization
- **Spring Data JPA** — Database ORM
- **H2 Database** — In-memory database (no setup needed)
- **Lombok** — Reduce boilerplate code

### Frontend
- **Vite 5** — Build tool
- **React 18** — UI library
- **React Router v6** — Client-side routing
- **Axios** — HTTP client
- **Context API** — State management

---
