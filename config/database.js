require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Failed to connect to PostgreSQL:', err.message);
    } else {
        console.log('✅ Connected to PostgreSQL at:', res.rows[0].now);
    }
})

module.exports = pool;