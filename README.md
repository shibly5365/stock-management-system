# Multi-Store Stock Management (MERN)

## Overview

Multi-Store Stock Management is a full-stack MERN application that allows administrators to manage products, stores, and stock across multiple locations while allowing shoppers to view available products and stock levels.

This project was built as part of a backend-focused machine test.

---

# Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cookies
- bcryptjs
- express-async-handler

## Frontend

- React
- Vite
- React Router DOM
- Axios
- Plain CSS

---

# Features

## Authentication

- Register
- Login
- Logout
- JWT Cookie Authentication
- Role Based Authorization

---

## Admin

### Stores

- Create Store
- View Stores
- Update Store
- Delete Store

### Products

- Create Product
- View Products
- Update Product
- Delete Product

### Stock

- Create Stock
- View Stocks
- Update Stock
- Delete Stock

### Stock Operations

- Adjust Stock
- Transfer Stock

---

## Shopper

- View Products
- View Stocks

---

# Folder Structure

```
project
│
├── backend
│
├── frontend
│
├── README.md
├── DESIGN.md
├── openapi.yaml
└── .env.example
```

---

# Backend Installation

Clone repository

```bash
git clone https://github.com/yourusername/multi-store-stock-management.git
```

Go to backend

```bash
cd backend
```

Install packages

```bash
npm install
```

Create `.env`

```env
PORT=7005

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret

NODE_ENV=development

CLIENT_URL=http://localhost:5173
```

Run Backend

```bash
npm run dev
```

Backend runs on

```
http://localhost:7005
```

---

# Frontend Installation

Go to frontend

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run frontend

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
```

---

## Stores

```
GET    /api/stores
GET    /api/stores/:id
POST   /api/stores
PUT    /api/stores/:id
DELETE /api/stores/:id
```

---

## Products

```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

---

## Stocks

```
GET    /api/stocks
GET    /api/stocks/:id
POST   /api/stocks
PUT    /api/stocks/:id
DELETE /api/stocks/:id
PATCH  /api/stocks/adjust
POST   /api/stocks/transfer
```

---

# Validation

- Required field validation
- Unique SKU validation
- Unique Product + Store stock validation
- Prevent negative stock
- Positive transfer quantity validation
- Different source and destination stores
- Product existence validation
- Store existence validation

---

# Security

- Password Hashing
- JWT Authentication
- HTTP-only Cookies
- Protected Routes
- Role Based Authorization

---

# Frontend Pages

## Admin

- Dashboard
- Stores
- Products
- Stocks
- Adjust Stock
- Transfer Stock

## Shopper

- Dashboard
- Products
- Stocks

---

# Author

**Nuhman Ibnu Shibly**

MERN Stack Developer