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

## 🚀 Getting Started

### Prerequisites

Before running the project, make sure you have installed:

| Tool | Version | Download |
|------|---------|----------|
| Java | 17+ | https://adoptium.net/ |
| Maven | 3.8+ | https://maven.apache.org/ |
| Node.js | 18+ | https://nodejs.org/ |
| npm | 8+ | Comes with Node.js |

---

## 🔧 Backend Setup (Spring Boot)

### Step 1 — Navigate to backend directory
```bash
cd library-management/backend
```

### Step 2 — Build and run the application
```bash
mvn spring-boot:run
```

> **Note:** First run will download Maven dependencies (~2-3 min). The H2 in-memory database will be created automatically.

### Step 3 — Verify backend is running
Open your browser and go to: **http://localhost:8080/h2-console**
- JDBC URL: `jdbc:h2:mem:librarydb`
- Username: `sa`
- Password: *(leave empty)*

The API runs on: **http://localhost:8080**

---

## 🎨 Frontend Setup (Vite + React)

### Step 1 — Open a NEW terminal and navigate to frontend
```bash
cd library-management/frontend
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Start the development server
```bash
npm run dev
```

### Step 4 — Open the application
Visit: **http://localhost:5173**

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 🔴 Admin | admin@library.com | admin123 |
| 🔵 User | user@library.com | user123 |

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
- **JWT (jjwt)** — Token-based auth
- **Lombok** — Reduce boilerplate code

### Frontend
- **Vite 5** — Build tool
- **React 18** — UI library
- **React Router v6** — Client-side routing
- **Axios** — HTTP client
- **Context API** — State management

---

## 🔗 API Endpoints

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/register` | Register | Public |
| GET | `/api/books/all` | Get all books | Public |
| GET | `/api/books/search?q=` | Search books | Public |
| POST | `/api/books` | Add book | Admin |
| PUT | `/api/books/{id}` | Update book | Admin |
| DELETE | `/api/books/{id}` | Delete book | Admin |
| POST | `/api/borrow/book/{id}` | Borrow a book | User |
| POST | `/api/borrow/return/{id}` | Return a book | User |
| GET | `/api/borrow/my` | My borrow records | User |
| GET | `/api/borrow/all` | All borrow records | Admin |
| GET | `/api/recommendations` | Smart recommendations | User |
| GET | `/api/admin/stats` | Dashboard stats | Admin |
| GET | `/api/admin/users` | All users | Admin |

---

## 🔥 Common Issues

### Port already in use
- Backend: Edit `server.port` in `application.properties`
- Frontend: Edit `vite.config.js` port setting

### CORS errors
- Make sure both backend (8080) and frontend (5173) are running
- Check CORS config in `SecurityConfig.java`

### Cannot connect to backend
- Ensure backend started successfully (no errors in terminal)
- Check http://localhost:8080/api/books/all returns data

---

## 📸 Page Overview

1. **/** — Home/Landing page
2. **/login** — Login (both user and admin)
3. **/register** — User registration
4. **/dashboard** — User dashboard (requires user login)
5. **/dashboard/books** — Browse and borrow books
6. **/dashboard/my-books** — View borrowed books
7. **/dashboard/fines** — View personal fines
8. **/admin** — Admin dashboard (requires admin login)
9. **/admin/books** — Manage books (CRUD)
10. **/admin/borrows** — View all borrow records
11. **/admin/fines** — Fine management
12. **/admin/users** — View all users
