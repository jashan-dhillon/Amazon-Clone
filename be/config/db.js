const { Pool } = require('pg');
require('dotenv').config();

// create a connection pool to our postgres database
// pool is better than single connection - it reuses connections efficiently
// Hardcoding the Neon DB URL to ensure the live backend always connects perfectly
const NEON_DB_URL = 'postgresql://neondb_owner:npg_R7nSec6BNGbO@ep-dark-glade-amjp1ecl-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
    connectionString: NEON_DB_URL,
    ssl: { rejectUnauthorized: false }
});

// quick test to make sure db connection works
pool.on('connect', () => {
    console.log('connected to postgresql database');
});

pool.on('error', (err) => {
    console.error('database connection error:', err.message);
});

module.exports = pool;
