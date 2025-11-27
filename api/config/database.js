const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

let pool;

const getPool = () => {
  if (!pool) {
    // Allow empty password (some MySQL installations don't require password)
    // If password is not set at all (undefined), use empty string
    const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
    
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: password,
      database: process.env.DB_NAME || 'auth_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
};

const initializeDatabase = async () => {
  try {
    const pool = getPool();
    
    // Test connection
    await pool.execute('SELECT 1');
    console.log('Database connection established');
    
    // Read and execute schema SQL
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      // Split by semicolon and filter out empty statements and comments
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await pool.execute(statement);
          } catch (error) {
            // Ignore errors for CREATE DATABASE IF NOT EXISTS and similar
            if (!error.message.includes('already exists') && !error.message.includes('Duplicate')) {
              console.warn('Schema statement warning:', error.message);
            }
          }
        }
      }
      console.log('Database schema checked');
    }
    
    // Read and execute seed SQL if exists
    const seedPath = path.join(__dirname, '../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf8');
      const statements = seed
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await pool.execute(statement);
          } catch (error) {
            // Ignore duplicate key errors for seed data
            if (!error.message.includes('Duplicate')) {
              console.warn('Seed statement warning:', error.message);
            }
          }
        }
      }
      console.log('Database seed checked');
    }
    
    return pool;
  } catch (error) {
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n❌ Database access denied!');
      console.error('Please check your .env file and update:');
      console.error('  - DB_USER (current: ' + (process.env.DB_USER || 'root') + ')');
      console.error('  - DB_PASSWORD (must be your actual MySQL password)');
      console.error('  - Make sure MySQL server is running');
      console.error('\nIf you haven\'t set a MySQL password, try:');
      console.error('  DB_PASSWORD=');
      console.error('Or set a password in MySQL and update .env\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ Cannot connect to MySQL server!');
      console.error('Please make sure MySQL is running on ' + (process.env.DB_HOST || 'localhost') + ':' + (process.env.DB_PORT || 3306));
    } else {
      console.error('Database initialization error:', error.message);
    }
    throw error;
  }
};

module.exports = {
  getPool,
  initializeDatabase
};

