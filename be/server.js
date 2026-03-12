const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware setup
app.use(cors());                    // allow frontend to talk to backend
app.use(express.json());            // parse incoming JSON requests

// basic health check - to verify server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'server is up and running' });
});

// root route so Vercel doesn't show "Cannot GET /"
app.get('/', (req, res) => {
    res.json({ message: 'Amazon Clone API is running live! 🚀' });
});

// connect all our API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/addresses', require('./routes/addresses'));

// start the server if not running in production/serverless mode
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`server running on http://localhost:${PORT}`);
        console.log('available routes:');
        console.log('  /api/auth      - signup, login, profile');
        console.log('  /api/products  - browse and search products');
        console.log('  /api/cart      - manage cart items');
        console.log('  /api/wishlist  - manage wishlist');
        console.log('  /api/orders    - place and view orders');
        console.log('  /api/addresses - manage shipping addresses');
    });
}

// export the app for Vercel
module.exports = app;
