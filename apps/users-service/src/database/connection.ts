const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connected successfully at:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

/**
 * Execute a query
 */
const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

/**
 * Get a client from the pool (for transactions)
 */
const getClient = async () => {
  return await pool.connect();
};

/**
 * Close all connections
 */
const closePool = async () => {
  await pool.end();
};

module.exports = {
  testConnection,
  query,
  getClient,
  closePool,
  pool,
};
