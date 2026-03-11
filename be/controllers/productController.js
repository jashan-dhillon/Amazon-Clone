const pool = require('../config/db');

// get all products with optional search and category filter
// supports: ?search=iphone&category=electronics&page=1&limit=12
const getAllProducts = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 12 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT p.*, c.name as category_name, c.slug as category_slug,
                   (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        let countQuery = `SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
        const params = [];
        const countParams = [];
        let paramIndex = 1;
        let countParamIndex = 1;

        // add search filter if provided
        if (search) {
            query += ` AND (LOWER(p.name) LIKE $${paramIndex} OR LOWER(p.brand) LIKE $${paramIndex})`;
            countQuery += ` AND (LOWER(p.name) LIKE $${countParamIndex} OR LOWER(p.brand) LIKE $${countParamIndex})`;
            params.push(`%${search.toLowerCase()}%`);
            countParams.push(`%${search.toLowerCase()}%`);
            paramIndex++;
            countParamIndex++;
        }

        // add category filter if provided
        if (category) {
            query += ` AND c.slug = $${paramIndex}`;
            countQuery += ` AND c.slug = $${countParamIndex}`;
            params.push(category);
            countParams.push(category);
            paramIndex++;
            countParamIndex++;
        }

        // add sorting and pagination
        query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await pool.query(query, params);
        const countResult = await pool.query(countQuery, countParams);
        const totalProducts = parseInt(countResult.rows[0].count);

        res.json({
            products: result.rows,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (err) {
        console.error('get products error:', err.message);
        res.status(500).json({ error: 'failed to fetch products' });
    }
};

// get a single product by its id, including all its images
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // get the product details
        const productResult = await pool.query(
            `SELECT p.*, c.name as category_name, c.slug as category_slug
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.id = $1`,
            [id]
        );

        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'product not found' });
        }

        // get all images for this product
        const imagesResult = await pool.query(
            'SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order',
            [id]
        );

        const product = productResult.rows[0];
        product.images = imagesResult.rows;

        res.json({ product });
    } catch (err) {
        console.error('get product error:', err.message);
        res.status(500).json({ error: 'failed to fetch product details' });
    }
};

// get all categories
const getCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name');
        res.json({ categories: result.rows });
    } catch (err) {
        console.error('get categories error:', err.message);
        res.status(500).json({ error: 'failed to fetch categories' });
    }
};

// get featured/deal products for homepage
const getFeaturedProducts = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.*, c.name as category_name,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.is_featured = true
             ORDER BY p.created_at DESC
             LIMIT 8`
        );
        res.json({ products: result.rows });
    } catch (err) {
        console.error('get featured error:', err.message);
        res.status(500).json({ error: 'failed to fetch featured products' });
    }
};

module.exports = { getAllProducts, getProductById, getCategories, getFeaturedProducts };
