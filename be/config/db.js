const { Pool } = require('pg');
require('dotenv').config();

// create a connection pool to our postgres database
// pool is better than single connection - it reuses connections efficiently
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'amazon_clone',
});

// quick test to make sure db connection works
pool.on('connect', () => {
    console.log('connected to postgresql database');
});

pool.on('error', (err) => {
    console.error('database connection error:', err.message);
});

module.exports = pool;
