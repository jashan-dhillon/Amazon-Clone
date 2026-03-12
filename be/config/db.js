const { Pool } = require('pg');
require('dotenv').config();

// create a connection pool to our postgres database
// pool is better than single connection - it reuses connections efficiently
// check if we have a direct DATABASE_URL string (like from Neon/Vercel)
const connectionOptions = process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for cloud databases like Neon
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'amazon_clone',
      };

const pool = new Pool(connectionOptions);

// quick test to make sure db connection works
pool.on('connect', () => {
    console.log('connected to postgresql database');
});

pool.on('error', (err) => {
    console.error('database connection error:', err.message);
});

module.exports = pool;
