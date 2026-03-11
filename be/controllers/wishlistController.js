const pool = require('../config/db');

// get all wishlist items for the logged in user
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT wi.id, wi.added_at,
                    p.id as product_id, p.name, p.price, p.original_price, p.stock, p.brand, p.rating,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
             FROM wishlist_items wi
             JOIN products p ON wi.product_id = p.id
             WHERE wi.user_id = $1
             ORDER BY wi.added_at DESC`,
            [userId]
        );

        res.json({ items: result.rows });
    } catch (err) {
        console.error('get wishlist error:', err.message);
        res.status(500).json({ error: 'failed to fetch wishlist' });
    }
};

// add a product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'product id is required' });
        }

        // check if product exists
        const product = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);
        if (product.rows.length === 0) {
            return res.status(404).json({ error: 'product not found' });
        }

        // insert into wishlist, ignore if already there
        const result = await pool.query(
            `INSERT INTO wishlist_items (user_id, product_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, product_id) DO NOTHING
             RETURNING *`,
            [userId, productId]
        );

        if (result.rows.length === 0) {
            return res.json({ message: 'product is already in your wishlist' });
        }

        res.status(201).json({
            message: 'added to wishlist',
            item: result.rows[0]
        });
    } catch (err) {
        console.error('add to wishlist error:', err.message);
        res.status(500).json({ error: 'failed to add to wishlist' });
    }
};

// remove a product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM wishlist_items WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'wishlist item not found' });
        }

        res.json({ message: 'removed from wishlist' });
    } catch (err) {
        console.error('remove from wishlist error:', err.message);
        res.status(500).json({ error: 'failed to remove from wishlist' });
    }
};

// move item from wishlist to cart (add to cart + remove from wishlist)
const moveToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;    // wishlist item id

        // find the wishlist item
        const wishlistItem = await pool.query(
            'SELECT * FROM wishlist_items WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (wishlistItem.rows.length === 0) {
            return res.status(404).json({ error: 'wishlist item not found' });
        }

        const productId = wishlistItem.rows[0].product_id;

        // add to cart
        await pool.query(
            `INSERT INTO cart_items (user_id, product_id, quantity)
             VALUES ($1, $2, 1)
             ON CONFLICT (user_id, product_id)
             DO UPDATE SET quantity = cart_items.quantity + 1`,
            [userId, productId]
        );

        // remove from wishlist
        await pool.query('DELETE FROM wishlist_items WHERE id = $1', [id]);

        res.json({ message: 'moved to cart' });
    } catch (err) {
        console.error('move to cart error:', err.message);
        res.status(500).json({ error: 'failed to move item to cart' });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, moveToCart };
