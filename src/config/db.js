
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
  
class DatbaseConfig {
    constructor() {
        this.connectionString = process.env.DATABASE_URL

    }

    getConnectionPool() {
        const pool = new Pool({
            connectionString: this.connectionString,
            ssl: false
        })
        pool.connect()
            .then(client => {
                console.log('✅ Connected to PostgreSQL database');
                client.release();
            })
            .catch(err => {
                console.error('❌ Error connecting to PostgreSQL:', err.stack);
            });
        return pool;
    }

}

const dbConfig = new DatbaseConfig();
const pool = dbConfig.getConnectionPool();

module.exports = pool;
