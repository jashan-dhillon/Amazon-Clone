-- ============================================
-- Amazon Clone - Database Schema
-- designed for PostgreSQL
-- ============================================

-- clean slate (drop tables if re-running this script)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS
-- stores registered user accounts
-- ============================================
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,           -- stores bcrypt hashed password
    avatar_url  VARCHAR(500),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. ADDRESSES
-- each user can save multiple shipping addresses
-- ============================================
CREATE TABLE addresses (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name   VARCHAR(100) NOT NULL,
    phone       VARCHAR(15) NOT NULL,
    street      VARCHAR(255) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    state       VARCHAR(100) NOT NULL,
    zip_code    VARCHAR(10) NOT NULL,
    country     VARCHAR(50) DEFAULT 'India',
    is_default  BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. CATEGORIES
-- product categories like Electronics, Books etc
-- ============================================
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,    -- url friendly version of name
    image_url   VARCHAR(500),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. PRODUCTS
-- the main products table
-- ============================================
CREATE TABLE products (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(300) NOT NULL,
    description     TEXT,
    price           DECIMAL(10, 2) NOT NULL,         -- current selling price
    original_price  DECIMAL(10, 2),                   -- MRP (shown as strikethrough)
    stock           INT DEFAULT 0,
    category_id     INT REFERENCES categories(id) ON DELETE SET NULL,
    brand           VARCHAR(100),
    rating          DECIMAL(2, 1) DEFAULT 0,          -- average rating out of 5
    num_reviews     INT DEFAULT 0,
    is_featured     BOOLEAN DEFAULT FALSE,            -- for homepage featured section
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. PRODUCT IMAGES
-- multiple images per product (for the carousel)
-- ============================================
CREATE TABLE product_images (
    id          SERIAL PRIMARY KEY,
    product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url   VARCHAR(500) NOT NULL,
    is_primary  BOOLEAN DEFAULT FALSE,       -- the main thumbnail image
    sort_order  INT DEFAULT 0                -- controls display order in carousel
);

-- ============================================
-- 6. CART ITEMS
-- tracks what each user has in their cart
-- ============================================
CREATE TABLE cart_items (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity    INT DEFAULT 1 CHECK (quantity > 0),
    added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)      -- prevents duplicate product entries per user
);

-- ============================================
-- 7. WISHLIST
-- products saved for later
-- ============================================
CREATE TABLE wishlist_items (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)      -- cant wishlist same product twice
);

-- ============================================
-- 8. ORDERS
-- completed / placed orders
-- ============================================
CREATE TABLE orders (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_id      INT REFERENCES addresses(id) ON DELETE SET NULL,
    total_amount    DECIMAL(10, 2) NOT NULL,
    status          VARCHAR(30) DEFAULT 'placed',       -- placed, shipped, delivered, cancelled
    payment_method  VARCHAR(50) DEFAULT 'cod',          -- cod, card, upi
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. ORDER ITEMS
-- individual products inside each order
-- price is locked at time of purchase so future price changes dont affect old orders
-- ============================================
CREATE TABLE order_items (
    id                  SERIAL PRIMARY KEY,
    order_id            INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id          INT NOT NULL REFERENCES products(id) ON DELETE SET NULL,
    quantity            INT NOT NULL CHECK (quantity > 0),
    price_at_purchase   DECIMAL(10, 2) NOT NULL      -- price snapshot when order was placed
);

-- ============================================
-- INDEXES for better query performance
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_addresses_user ON addresses(user_id);
