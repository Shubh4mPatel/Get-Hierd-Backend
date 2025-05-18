
const { Pool } = require('pg');
  
class DatbaseConfig {
    constructor() {
        this.connectionString = process.env.DB_CONNECTION_STRING
    }

    getConnectionPool() {
        const pool = new Pool({
            connectionString: this.connectionString
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
