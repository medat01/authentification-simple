const mysql = require('mysql2/promise');

let pool;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'auth_db',
      waitForConnections: true,
      connectionLimit: 10
    });
  }
  return pool;
};

const initializeDatabase = async () => {
  try {
    const pool = getPool();
    await pool.execute('SELECT 1');
    console.log('Database connection established');
    return pool;
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
};

module.exports = {
  getPool,
  initializeDatabase
};
