const pool = require('../config/db');
const bcrypt = require('bcryptjs');

/*
    This script fills the database with sample data so the app
    has something to display right away. Run it once after setting
    up the schema.

    Usage: node seed/seedData.js
*/

const seedDatabase = async () => {
    try {
        console.log('starting to seed database...\n');

        // ---- 1. create a default test user ----
        const hashedPassword = await bcrypt.hash('password123', 10);
        const userResult = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ('Jashan', 'jashan@example.com', $1)
             ON CONFLICT (email) DO NOTHING
             RETURNING id`,
            [hashedPassword]
        );

        let userId;
        if (userResult.rows.length > 0) {
            userId = userResult.rows[0].id;
            console.log('created default user (jashan@example.com / password123)');
        } else {
            const existing = await pool.query("SELECT id FROM users WHERE email = 'jashan@example.com'");
            userId = existing.rows[0].id;
            console.log('default user already exists, skipping');
        }

        // add a default address for the test user
        await pool.query(
            `INSERT INTO addresses (user_id, full_name, phone, street, city, state, zip_code, country, is_default)
             VALUES ($1, 'Jashan Dhillon', '9876543210', '123 Main Street', 'Chandigarh', 'Punjab', '160001', 'India', true)
             ON CONFLICT DO NOTHING`,
            [userId]
        );
        console.log('added default shipping address');

        // ---- 2. create product categories ----
        const categories = [
            { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300' },
            { name: 'Clothing', slug: 'clothing', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300' },
            { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300' },
            { name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300' },
            { name: 'Sports & Fitness', slug: 'sports-fitness', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0a5d?w=300' },
            { name: 'Beauty & Personal Care', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300' },
        ];

        const categoryIds = {};
        for (const cat of categories) {
            const result = await pool.query(
                `INSERT INTO categories (name, slug, image_url)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (slug) DO UPDATE SET image_url = $3
                 RETURNING id`,
                [cat.name, cat.slug, cat.image]
            );
            categoryIds[cat.slug] = result.rows[0].id;
        }
        console.log(`added ${categories.length} categories`);

        // ---- 3. create sample products ----
        const products = [
            // electronics
            {
                name: 'boAt Rockerz 450 Bluetooth Headphone',
                description: 'Wireless bluetooth headphone with 40mm drivers, 15 hours playback, padded ear cushions, and dual connectivity modes. Perfect for everyday listening with deep bass and clear sound.',
                price: 1299,
                originalPrice: 3990,
                stock: 45,
                category: 'electronics',
                brand: 'boAt',
                rating: 4.1,
                numReviews: 28543,
                isFeatured: true,
                images: [
                    { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', primary: true },
                    { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500', primary: false },
                    { url: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500', primary: false },
                ]
            },
            {
                name: 'Samsung Galaxy M34 5G (Midnight Blue, 6GB RAM, 128GB)',
                description: '6000mAh battery, 120Hz sAMOLED display, 50MP triple camera, Exynos 1280 processor. Great mid-range phone with flagship-level display quality.',
                price: 14999,
                originalPrice: 21999,
                stock: 20,
                category: 'electronics',
                brand: 'Samsung',
                rating: 4.3,
                numReviews: 15234,
                isFeatured: true,
                images: [
                    { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', primary: true },
                    { url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500', primary: false },
                ]
            },
            {
                name: 'HP 15s Laptop (12th Gen Intel Core i5, 8GB RAM, 512GB SSD)',
                description: 'Thin and light laptop with 15.6 inch FHD display, Intel Iris Xe graphics, Windows 11, long battery life. Ideal for students and professionals.',
                price: 49990,
                originalPrice: 66545,
                stock: 12,
                category: 'electronics',
                brand: 'HP',
                rating: 4.2,
                numReviews: 5678,
                isFeatured: true,
                images: [
                    { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', primary: true },
                    { url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500', primary: false },
                ]
            },
            {
                name: 'Fire-Boltt Ninja Call Pro Plus Smartwatch',
                description: '1.83 inch display, bluetooth calling, 100+ sports modes, heart rate & SpO2 monitoring, IP67 water resistant. Budget-friendly smartwatch that packs in premium features.',
                price: 1499,
                originalPrice: 7999,
                stock: 100,
                category: 'electronics',
                brand: 'Fire-Boltt',
                rating: 3.9,
                numReviews: 42311,
                isFeatured: false,
                images: [
                    { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', primary: true },
                    { url: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=500', primary: false },
                ]
            },
            {
                name: 'Sony WH-1000XM4 Noise Cancelling Headphones',
                description: 'Industry leading noise cancellation with Dual Noise Sensor technology. 30-hour battery life, touch sensor controls, speak-to-chat technology.',
                price: 19990,
                originalPrice: 29990,
                stock: 8,
                category: 'electronics',
                brand: 'Sony',
                rating: 4.6,
                numReviews: 8932,
                isFeatured: true,
                images: [
                    { url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500', primary: true },
                    { url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500', primary: false },
                ]
            },

            // clothing
            {
                name: 'Levi\'s Men\'s 511 Slim Fit Jeans',
                description: 'Classic slim fit jeans with stretch denim for comfort. Sits below waist, slim through hip and thigh. A modern staple for any wardrobe.',
                price: 1799,
                originalPrice: 3999,
                stock: 60,
                category: 'clothing',
                brand: 'Levi\'s',
                rating: 4.3,
                numReviews: 12456,
                isFeatured: true,
                images: [
                    { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', primary: true },
                    { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', primary: false },
                ]
            },
            {
                name: 'Allen Solly Men\'s Regular Fit Polo T-Shirt',
                description: 'Premium cotton polo t-shirt with ribbed collar and cuffs. Classic fit thats comfortable for all-day wear. Available in multiple colors.',
                price: 699,
                originalPrice: 1499,
                stock: 85,
                category: 'clothing',
                brand: 'Allen Solly',
                rating: 4.0,
                numReviews: 7823,
                isFeatured: false,
                images: [
                    { url: 'https://images.unsplash.com/photo-1625910513413-5fc14e3e2e60?w=500', primary: true },
                    { url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500', primary: false },
                ]
            },
            {
                name: 'Nike Revolution 6 Running Shoes',
                description: 'Lightweight mesh upper for breathability. Foam midsole provides a soft and smooth ride. Rubber outsole for traction on multiple surfaces.',
                price: 2695,
                originalPrice: 3695,
                stock: 35,
                category: 'clothing',
                brand: 'Nike',
                rating: 4.4,
                numReviews: 9412,
                isFeatured: true,
                images: [
                    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', primary: true },
                    { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500', primary: false },
                ]
            },

            // books
            {
                name: 'Atomic Habits by James Clear',
                description: 'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results. One of the most popular self-help books of the decade.',
                price: 399,
                originalPrice: 799,
                stock: 150,
                category: 'books',
                brand: 'Penguin',
                rating: 4.7,
                numReviews: 56789,
                isFeatured: true,
                images: [
                    { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', primary: true },
                ]
            },
            {
                name: 'The Psychology of Money by Morgan Housel',
                description: 'Timeless lessons on wealth, greed, and happiness. 19 short stories exploring the strange ways people think about money.',
                price: 299,
                originalPrice: 399,
                stock: 200,
                category: 'books',
                brand: 'Jaico Publishing',
                rating: 4.6,
                numReviews: 34521,
                isFeatured: false,
                images: [
                    { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', primary: true },
                ]
            },
            {
                name: 'Rich Dad Poor Dad by Robert Kiyosaki',
                description: 'What the rich teach their kids about money that the poor and middle class do not. A classic personal finance book that changed millions of lives.',
                price: 349,
                originalPrice: 599,
                stock: 175,
                category: 'books',
                brand: 'Plata Publishing',
                rating: 4.5,
                numReviews: 41209,
                isFeatured: false,
                images: [
                    { url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500', primary: true },
                ]
            },

            // home & kitchen
            {
                name: 'Prestige Iris 750W Mixer Grinder (3 Jars)',
                description: 'Powerful 750 watt motor with 3 stainless steel jars. Super efficient blades for fine grinding. Sturdy handles and anti-skid feet for safety.',
                price: 2499,
                originalPrice: 4195,
                stock: 30,
                category: 'home-kitchen',
                brand: 'Prestige',
                rating: 4.1,
                numReviews: 11234,
                isFeatured: false,
                images: [
                    { url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500', primary: true },
                ]
            },
            {
                name: 'Milton Thermosteel Flask 1 Litre',
                description: 'Double wall vacuum insulation keeps beverages hot or cold for up to 24 hours. Food grade stainless steel, rust proof and leak proof.',
                price: 699,
                originalPrice: 1099,
                stock: 70,
                category: 'home-kitchen',
                brand: 'Milton',
                rating: 4.3,
                numReviews: 19876,
                isFeatured: false,
                images: [
                    { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', primary: true },
                ]
            },
            {
                name: 'Pigeon by Stovekraft Favourite Outer Lid Pressure Cooker 5L',
                description: 'Aluminium body pressure cooker with metallic safety plug, gasket release system, and precision weight valve. Essential kitchen item for Indian cooking.',
                price: 849,
                originalPrice: 1495,
                stock: 55,
                category: 'home-kitchen',
                brand: 'Pigeon',
                rating: 4.0,
                numReviews: 25489,
                isFeatured: false,
                images: [
                    { url: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=500', primary: true },
                ]
            },

            // sports & fitness
            {
                name: 'Boldfit Yoga Mat for Women and Men',
                description: 'Extra thick 6mm NBR material provides excellent cushioning. Anti-skid surface, lightweight and easy to carry. Includes carrying strap.',
                price: 399,
                originalPrice: 1299,
                stock: 90,
                category: 'sports-fitness',
                brand: 'Boldfit',
                rating: 4.2,
                numReviews: 8765,
                isFeatured: false,
                images: [
                    { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', primary: true },
                ]
            },
            {
                name: 'Strauss Adjustable Dumbbell Set 20kg',
                description: 'PVC coated dumbbell set with adjustable weights. Includes connecting rod to convert to barbell. Chrome plated nuts for secure locking.',
                price: 1899,
                originalPrice: 3499,
                stock: 25,
                category: 'sports-fitness',
                brand: 'Strauss',
                rating: 4.1,
                numReviews: 6543,
                isFeatured: false,
                images: [
                    { url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500', primary: true },
                ]
            },

            // beauty
            {
                name: 'Maybelline New York Fit Me Foundation',
                description: 'Lightweight gel-based formula with SPF 22. Blurs pores and smooths skin for a natural, poreless-looking finish. Available in 18 shades.',
                price: 399,
                originalPrice: 550,
                stock: 120,
                category: 'beauty',
                brand: 'Maybelline',
                rating: 4.0,
                numReviews: 15678,
                isFeatured: false,
                images: [
                    { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500', primary: true },
                ]
            },
            {
                name: 'The Man Company Charcoal Face Wash',
                description: 'Activated charcoal face wash that deep cleanses pores and removes dirt and oil. Enriched with aloe vera and tea tree oil for fresh, clean skin.',
                price: 299,
                originalPrice: 449,
                stock: 95,
                category: 'beauty',
                brand: 'The Man Company',
                rating: 4.2,
                numReviews: 9876,
                isFeatured: false,
                images: [
                    { url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500', primary: true },
                ]
            },
        ];

        let productCount = 0;
        for (const prod of products) {
            const result = await pool.query(
                `INSERT INTO products (name, description, price, original_price, stock, category_id, brand, rating, num_reviews, is_featured)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 RETURNING id`,
                [
                    prod.name, prod.description, prod.price, prod.originalPrice,
                    prod.stock, categoryIds[prod.category], prod.brand,
                    prod.rating, prod.numReviews, prod.isFeatured
                ]
            );

            const productId = result.rows[0].id;

            // insert images for this product
            for (let i = 0; i < prod.images.length; i++) {
                await pool.query(
                    `INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
                     VALUES ($1, $2, $3, $4)`,
                    [productId, prod.images[i].url, prod.images[i].primary, i]
                );
            }

            productCount++;
        }

        console.log(`added ${productCount} products with images`);
        console.log('\ndatabase seeded successfully!');
        console.log('you can login with: jashan@example.com / password123');

        process.exit(0);
    } catch (err) {
        console.error('seeding failed:', err.message);
        process.exit(1);
    }
};

seedDatabase();
