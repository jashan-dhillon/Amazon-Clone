const pool = require('../config/db');

// get everything in the user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT ci.id, ci.quantity, ci.added_at,
                    p.id as product_id, p.name, p.price, p.original_price, p.stock, p.brand,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.user_id = $1
             ORDER BY ci.added_at DESC`,
            [userId]
        );

        // calculate the total
        let subtotal = 0;
        result.rows.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        res.json({
            items: result.rows,
            subtotal: parseFloat(subtotal.toFixed(2)),
            itemCount: result.rows.length
        });
    } catch (err) {
        console.error('get cart error:', err.message);
        res.status(500).json({ error: 'failed to fetch cart' });
    }
};

// add a product to cart (or increase quantity if already there)
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'product id is required' });
        }

        // check if product exists and is in stock
        const product = await pool.query('SELECT id, stock FROM products WHERE id = $1', [productId]);
        if (product.rows.length === 0) {
            return res.status(404).json({ error: 'product not found' });
        }
        if (product.rows[0].stock < 1) {
            return res.status(400).json({ error: 'product is out of stock' });
        }

        // try to insert, if product already in cart then just update the quantity
        // this is where the UNIQUE(user_id, product_id) constraint helps us
        const result = await pool.query(
            `INSERT INTO cart_items (user_id, product_id, quantity)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, product_id)
             DO UPDATE SET quantity = cart_items.quantity + $3
             RETURNING *`,
            [userId, productId, quantity]
        );

        res.status(201).json({
            message: 'added to cart',
            item: result.rows[0]
        });
    } catch (err) {
        console.error('add to cart error:', err.message);
        res.status(500).json({ error: 'failed to add item to cart' });
    }
};

// update quantity of a cart item
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;        // cart_item id
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'quantity must be at least 1' });
        }

        const result = await pool.query(
            'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [quantity, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'cart item not found' });
        }

        res.json({ message: 'cart updated', item: result.rows[0] });
    } catch (err) {
        console.error('update cart error:', err.message);
        res.status(500).json({ error: 'failed to update cart' });
    }
};

// remove an item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'cart item not found' });
        }

        res.json({ message: 'item removed from cart' });
    } catch (err) {
        console.error('remove from cart error:', err.message);
        res.status(500).json({ error: 'failed to remove item from cart' });
    }
};

// clear the entire cart (used after placing an order)
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
        res.json({ message: 'cart cleared' });
    } catch (err) {
        console.error('clear cart error:', err.message);
        res.status(500).json({ error: 'failed to clear cart' });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
