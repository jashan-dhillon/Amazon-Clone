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

### users

| Column | Type | Constraints |
|------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| avatar_url | VARCHAR(500) | |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### addresses

| Column | Type | Constraints |
|------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INT | REFERENCES users(id) ON DELETE CASCADE |
| full_name | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(15) | NOT NULL |
| street | VARCHAR(255) | NOT NULL |
| city | VARCHAR(100) | NOT NULL |
| state | VARCHAR(100) | NOT NULL |
| zip_code | VARCHAR(10) | NOT NULL |
| country | VARCHAR(50) | DEFAULT 'India' |
| is_default | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### categories

| Column | Type | Constraints |
|------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| slug | VARCHAR(100) | UNIQUE, NOT NULL |
| image_url | VARCHAR(500) | |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### products

| Column | Type | Constraints |
|------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(300) | NOT NULL |
| description | TEXT | |
| price | DECIMAL(10,2) | NOT NULL |
| original_price | DECIMAL(10,2) | |
| stock | INT | DEFAULT 0 |
| category_id | INT | REFERENCES categories(id) ON DELETE SET NULL |
| brand | VARCHAR(100) | |
| rating | DECIMAL(2,1) | DEFAULT 0 |
| num_reviews | INT | DEFAULT 0 |
| is_featured | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### product_images

| Column | Type | Constraints |
|------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| product_id | INT | REFERENCES products(id) ON DELETE CASCADE |
| image_url | VARCHAR(500) | NOT NULL |
| is_primary | BOOLEAN | DEFAULT FALSE |
| sort_order | INT | DEFAULT 0 |

### cart_items

| Column | Type | Constraints |
|------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INT | REFERENCES users(id) ON DELETE CASCADE |
| product_id | INT | REFERENCES products(id) ON DELETE CASCADE |
| quantity | INT | DEFAULT 1 CHECK (quantity > 0) |
| added_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| unique(user_id, product_id) | | |

### wishlist_items

| Column | Type | Constraints |
|------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INT | REFERENCES users(id) ON DELETE CASCADE |
| product_id | INT | REFERENCES products(id) ON DELETE CASCADE |
| added_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| unique(user_id, product_id) | | |

### orders

| Column | Type | Constraints |
|------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INT | REFERENCES users(id) ON DELETE CASCADE |
| address_id | INT | REFERENCES addresses(id) ON DELETE SET NULL |
| total_amount | DECIMAL(10,2) | NOT NULL |
| status | VARCHAR(30) | DEFAULT 'placed' |
| payment_method | VARCHAR(50) | DEFAULT 'cod' |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### order_items

| Column | Type | Constraints |
|------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| order_id | INT | REFERENCES orders(id) ON DELETE CASCADE |
| product_id | INT | REFERENCES products(id) ON DELETE SET NULL |
| quantity | INT | NOT NULL CHECK (quantity > 0) |
| price_at_purchase | DECIMAL(10,2) | NOT NULL |

## Assumptions

- A default user is assumed to be logged in for quick testing
- Sample products are seeded across multiple categories
- Payments are simulated (no real payment gateway)
- Prices are in INR (₹)
- Only seeded products can be searched
- mock login credentials are - Email: jashan@example.com
Password: password123

