const pool = require('../config/db');

// place a new order from the cart
const placeOrder = async (req, res) => {
    // we use a database transaction here because placing an order involves
    // multiple steps (creating order, adding items, clearing cart, updating stock)
    // if any step fails, we want ALL of them to roll back
    const client = await pool.connect();

    try {
        const userId = req.user.id;
        const { addressId, paymentMethod = 'cod' } = req.body;

        if (!addressId) {
            return res.status(400).json({ error: 'please select a shipping address' });
        }

        // start the transaction
        await client.query('BEGIN');

        // get cart items
        const cartResult = await client.query(
            `SELECT ci.*, p.price, p.stock, p.name as product_name
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.user_id = $1`,
            [userId]
        );

        if (cartResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'your cart is empty' });
        }

        // calculate total and check stock
        let totalAmount = 0;
        for (const item of cartResult.rows) {
            if (item.stock < item.quantity) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    error: `sorry, "${item.product_name}" only has ${item.stock} items left in stock`
                });
            }
            totalAmount += item.price * item.quantity;
        }

        // create the order
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, address_id, total_amount, status, payment_method)
             VALUES ($1, $2, $3, 'placed', $4)
             RETURNING *`,
            [userId, addressId, totalAmount.toFixed(2), paymentMethod]
        );

        const order = orderResult.rows[0];

        // add each cart item as an order item
        for (const item of cartResult.rows) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                 VALUES ($1, $2, $3, $4)`,
                [order.id, item.product_id, item.quantity, item.price]
            );

            // reduce the product stock
            await client.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.product_id]
            );
        }

        // clear the user's cart
        await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        // commit all the changes
        await client.query('COMMIT');

        res.status(201).json({
            message: 'order placed successfully!',
            order: {
                id: order.id,
                totalAmount: order.total_amount,
                status: order.status,
                createdAt: order.created_at
            }
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('place order error:', err.message);
        res.status(500).json({ error: 'failed to place order' });
    } finally {
        client.release();
    }
};

// get all orders for the logged in user (order history)
const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT o.*,
                    a.full_name as shipping_name, a.city as shipping_city,
                    (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
             FROM orders o
             LEFT JOIN addresses a ON o.address_id = a.id
             WHERE o.user_id = $1
             ORDER BY o.created_at DESC`,
            [userId]
        );

        res.json({ orders: result.rows });
    } catch (err) {
        console.error('get orders error:', err.message);
        res.status(500).json({ error: 'failed to fetch orders' });
    }
};

// get details of a specific order
const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // get order info
        const orderResult = await pool.query(
            `SELECT o.*, a.*
             FROM orders o
             LEFT JOIN addresses a ON o.address_id = a.id
             WHERE o.id = $1 AND o.user_id = $2`,
            [id, userId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'order not found' });
        }

        // get items in this order
        const itemsResult = await pool.query(
            `SELECT oi.*, p.name, p.brand,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = $1`,
            [id]
        );

        const order = orderResult.rows[0];
        order.items = itemsResult.rows;

        res.json({ order });
    } catch (err) {
        console.error('get order detail error:', err.message);
        res.status(500).json({ error: 'failed to fetch order details' });
    }
};

module.exports = { placeOrder, getOrders, getOrderById };
