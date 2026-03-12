const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// handles user signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'please fill in all fields' });
        }

        // check if email already exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'an account with this email already exists' });
        }

        // hash the password before storing (never store plain text passwords!)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // insert the new user into the database
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
            [name, email, hashedPassword]
        );

        const user = result.rows[0];

        // create a JWT token so the user is automatically logged in after signup
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET || 'amazon_clone_super_secret_for_evaluators',
            { expiresIn: '7d' }  // token valid for 7 days
        );

        res.status(201).json({
            message: 'account created successfully',
            user: { id: user.id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        console.error('signup error:', err.message);
        res.status(500).json({ error: 'something went wrong, please try again' });
    }
};

// handles user login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'please enter email and password' });
        }

        // find the user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'no account found with this email' });
        }

        const user = result.rows[0];

        // compare the entered password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'incorrect password' });
        }

        // create a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET || 'amazon_clone_super_secret_for_evaluators',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'logged in successfully',
            user: { id: user.id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        console.error('login error:', err.message);
        res.status(500).json({ error: 'something went wrong, please try again' });
    }
};

// get current logged-in user's profile
const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'user not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error('get profile error:', err.message);
        res.status(500).json({ error: 'something went wrong' });
    }
};

module.exports = { signup, login, getProfile };
