const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware setup
app.use(cors());                    // allow frontend to talk to backend
app.use(express.json());            // parse incoming JSON requests

// basic health check route - just to verify server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'server is up and running' });
});

// ---- route imports will go here as we build them ----
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/cart', require('./routes/cart'));
// app.use('/api/wishlist', require('./routes/wishlist'));
// app.use('/api/orders', require('./routes/orders'));

// start the server
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});
