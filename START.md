# LUXE ESSENCE — Quick Start Guide

## Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Stripe account (for payments)

---

## Step 1: Install Dependencies

Open TWO terminals.

**Terminal 1 — Backend:**
```bash
cd "ammar ayoub/backend"
npm install
```

**Terminal 2 — Frontend:**
```bash
cd "ammar ayoub/frontend"
npm install
```

---

## Step 2: Configure Environment Variables

**Backend** — Edit `backend/.env`:
- Set your `MONGO_URI` (default: `mongodb://localhost:27017/luxe-essence`)
- Replace `STRIPE_SECRET_KEY` with your Stripe secret key (from stripe.com/dashboard)
- Replace `STRIPE_WEBHOOK_SECRET` with your Stripe webhook secret

**Frontend** — Edit `frontend/.env`:
- Replace `VITE_STRIPE_PUBLISHABLE_KEY` with your Stripe publishable key

---

## Step 3: Seed the Database (20 Products + Admin User)

```bash
cd backend
npm run seed
```

This creates:
- ✅ 20 popular perfumes (women, men, unisex)
- ✅ Admin account: `admin@luxeessence.com` / `admin123`

---

## Step 4: Start the Application

**Terminal 1 — Backend (port 5000):**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (port 5173):**
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:5173**

---

## Features

| Feature | Status |
|---------|--------|
| Product catalog (20 perfumes) | ✅ |
| Filter by gender & category | ✅ |
| Search products | ✅ |
| User registration & login | ✅ |
| Shopping cart (guest + logged in) | ✅ |
| Stripe payment checkout | ✅ |
| Order history | ✅ |
| Arabic (RTL) + English | ✅ |
| Admin panel | ✅ |
| Mobile responsive | ✅ |

---

## Admin Panel
Visit `/admin` after logging in with admin credentials.
- Add / Edit / Delete products
- View and update order statuses

---

## Stripe Test Cards
- Success: `4242 4242 4242 4242` (any future date, any CVC)
- Failure: `4000 0000 0000 0002`

---

## Project Structure
```
ammar ayoub/
├── backend/          Node.js + Express + MongoDB
│   ├── models/       User, Product, Order, Cart
│   ├── routes/       Auth, Products, Cart, Orders, Payment, Admin
│   ├── controllers/  Business logic
│   ├── middleware/   JWT auth, Admin guard, Error handler
│   └── utils/        Token generator, DB seeder
└── frontend/         React + Vite
    ├── src/
    │   ├── pages/    Home, Shop, Product, Cart, Checkout, etc.
    │   ├── components/ Navbar, Footer, ProductCard, CartDrawer, etc.
    │   ├── context/  Auth + Cart state management
    │   ├── i18n/     English + Arabic translations
    │   └── services/ API calls (Axios)
    └── public/
```
