# Amazon Clone - E-Commerce Platform

A full-stack e-commerce web app that replicates Amazon's design and shopping experience. Built as a learning project to understand how real e-commerce platforms work under the hood.

## What it does

- Browse products with search and category filters
- View detailed product pages with image carousels
- Add items to cart or save them to wishlist
- Place orders with shipping address and get a confirmation
- User signup/login with JWT authentication
- View past order history

## Tech Stack

| Layer      | Technology              |
|------------|------------------------|
| Frontend   | React.js (Vite)        |
| Backend    | Node.js + Express.js   |
| Database   | PostgreSQL             |
| Auth       | JWT + bcrypt           |

## Project Structure

```
Amazon-Clone/
├── fe/          → React frontend (UI)
├── be/          → Express backend (API)
├── db/          → Database schema and seed data
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL installed and running
- npm (comes with Node.js)

### 1. Clone the repo

```bash
git clone https://github.com/jashan-dhillon/Amazon-Clone.git
cd Amazon-Clone
```

### 2. Set up the database

Create a PostgreSQL database called `amazon_clone`:

```bash
createdb amazon_clone
```

Run the schema file to create all tables:

```bash
psql -U postgres -d amazon_clone -f db/schema.sql
```

### 3. Configure environment variables

```bash
cp .env.example be/.env
```

Open `be/.env` and fill in your PostgreSQL password and a JWT secret.

### 4. Start the backend

```bash
cd be
npm install
npm run dev
```

Server will start on `http://localhost:5000`

### 5. Start the frontend

```bash
cd fe
npm install
npm run dev
```

Frontend will open on `http://localhost:5173`

## Database Schema

The database has 9 tables covering users, products, cart, wishlist, and orders. Full schema is in `db/schema.sql`.

Key tables: `users`, `products`, `categories`, `cart_items`, `wishlist_items`, `orders`, `order_items`, `addresses`, `product_images`

## Assumptions

- A default user is assumed to be logged in for quick testing
- Sample products are seeded across multiple categories
- Payments are simulated (no real payment gateway)
- Prices are in INR (₹)

## Status

🚧 Work in progress - building step by step
