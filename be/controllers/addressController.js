const pool = require('../config/db');

// get all saved addresses for the user
const getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
            [userId]
        );
        res.json({ addresses: result.rows });
    } catch (err) {
        console.error('get addresses error:', err.message);
        res.status(500).json({ error: 'failed to fetch addresses' });
    }
};

// add a new address
const addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phone, street, city, state, zipCode, country = 'India', isDefault = false } = req.body;

        // basic validation
        if (!fullName || !phone || !street || !city || !state || !zipCode) {
            return res.status(400).json({ error: 'please fill in all address fields' });
        }

        // if this is set as default, unmark all other addresses first
        if (isDefault) {
            await pool.query(
                'UPDATE addresses SET is_default = false WHERE user_id = $1',
                [userId]
            );
        }

        const result = await pool.query(
            `INSERT INTO addresses (user_id, full_name, phone, street, city, state, zip_code, country, is_default)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [userId, fullName, phone, street, city, state, zipCode, country, isDefault]
        );

        res.status(201).json({
            message: 'address added',
            address: result.rows[0]
        });
    } catch (err) {
        console.error('add address error:', err.message);
        res.status(500).json({ error: 'failed to add address' });
    }
};

// delete an address
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'address not found' });
        }

        res.json({ message: 'address deleted' });
    } catch (err) {
        console.error('delete address error:', err.message);
        res.status(500).json({ error: 'failed to delete address' });
    }
};

module.exports = { getAddresses, addAddress, deleteAddress };
