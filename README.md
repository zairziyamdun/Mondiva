<h1 align="center">Mondiva</h1>
<p align="center">
  <strong>Premium women's fashion e‑commerce</strong> — full‑stack marketplace with admin panel, roles, and Kazakhstan localization (KZT, Kaspi, Halyk, Jusan).
</p>

<p align="center">
  <a href="https://mondiva.vercel.app/">🌐 Live Demo</a>
  &nbsp;·&nbsp;
  <a>Tech Stack</a>
  &nbsp;·&nbsp;
  <a>Getting Started</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css" alt="Tailwind" />
</p>

---

## About

**Mondiva** is a modern, production-oriented e‑commerce platform for premium women's clothing. It includes a customer-facing store (catalog, product pages, cart, checkout), JWT-based auth with roles, a full admin panel for products and orders, and time-based discounts. The project is localized for **Kazakhstan** (currency KZT, payment methods Kaspi / Halyk / Jusan, cities and phone format).

---

## Features

| Area | Features |
|------|----------|
| **Storefront** | Catalog with filters (category, price, color, size, brand), sorting, product detail with gallery and reviews, cart (localStorage), multi-step checkout (address → delivery → payment → confirm) |
| **Auth** | Register / login, JWT access + refresh (httpOnly cookie), protected routes, role-based access |
| **Account** | Profile, order history, return requests |
| **Admin** | Dashboard, products CRUD, categories, orders and status updates, users, return requests; product-level discount management (percentage/fixed, date range) |
| **Backend** | REST API, Helmet, CORS, rate limiting, express-validator; MongoDB with Mongoose; optional transaction support for order creation (replica set) |

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons, react-hook-form + Zod |
| **Backend** | Node.js, Express 5, Mongoose, JWT, bcrypt, cookie-parser, Helmet, express-rate-limit, express-validator |
| **Database** | MongoDB (Atlas-ready); models: User, Product, Category, Order, Review, ReturnRequest, Discount |
| **Deploy** | Frontend: Vercel; Backend: e.g. Render, Railway, or VPS |

---

## Project Structure

```
2mondiva/
├── frontend/                 # Next.js app
│   ├── app/                  # App Router pages (catalog, product, auth, account, admin)
│   ├── components/           # UI and feature components (cart, checkout, admin)
│   ├── lib/                  # API client, auth context, types, utils
│   └── package.json
├── backend/                  # Express API
│   ├── config/               # DB connection, CORS
│   ├── controllers/
│   ├── middleware/           # auth, rate limit, validation, errors
│   ├── models/
│   ├── routes/
│   ├── services/             # e.g. discount logic
│   ├── index.js
│   ├── seed.js               # Seed DB with sample data
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **pnpm**

### 1. Clone and install

```bash
git clone https://github.com/your-username/2mondiva.git
cd 2mondiva
```

```bash
# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

### 2. Environment variables

**Backend** (`backend/.env`):

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/your-db?retryWrites=true&w=majority
JWT_SECRET=your-secret-min-32-chars
JWT_EXPIRE=1d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRE=7d
# Production: set CORS_ORIGINS to your frontend URL(s), comma-separated
CORS_ORIGINS=https://mondiva.vercel.app
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production, set `NEXT_PUBLIC_API_URL` to your deployed API URL.

### 3. Seed the database (optional)

From the project root:

```bash
cd backend && npm run seed && cd ..
```

### 4. Run locally

**Terminal 1 — API:**

```bash
cd backend && npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend && npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:5000](http://localhost:5000)

---

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| `backend` | `npm run dev` | Start API with nodemon |
| `backend` | `npm start` | Start API (production) |
| `backend` | `npm run seed` | Seed MongoDB with sample data |
| `frontend` | `npm run dev` | Start Next.js dev server |
| `frontend` | `npm run build` | Production build |
| `frontend` | `npm start` | Start production server |

---

## API Overview

| Group | Endpoints |
|-------|-----------|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/refresh` |
| **Products** | `GET /api/products`, `GET /api/products/:idOrSlug`, `POST/PUT/DELETE /api/products` (admin) |
| **Categories** | `GET /api/categories`, CRUD (admin) |
| **Orders** | `POST /api/orders`, `GET /api/orders/my`, `GET/PATCH /api/orders/:id` |
| **Users** | `GET /api/users/me`, `GET /api/users` (admin) |
| **Reviews** | `GET /api/reviews/product/:productId`, `POST /api/reviews` |
| **Returns** | `GET /api/returns`, `GET /api/returns/my`, `PATCH /api/returns/:id` |
| **Discounts** | `GET /api/discounts`, `GET /api/discounts/product/:productId`, `POST/PATCH/DELETE /api/discounts` |


<p align="center">
  <sub>Built for portfolio and learning. Live demo: <a>mondiva.vercel.app</a></sub>
</p>
