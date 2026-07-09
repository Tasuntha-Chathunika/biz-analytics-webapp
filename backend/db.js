const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

// Connect to Supabase PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Helper for hashing
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Initialize DB schema
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sales_records (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          transaction_date DATE,
          region VARCHAR(100),
          category VARCHAR(100),
          product_name VARCHAR(255),
          quantity_sold INTEGER,
          revenue NUMERIC(12, 2)
      );
      CREATE INDEX IF NOT EXISTS idx_sales_date ON sales_records(transaction_date);
      CREATE INDEX IF NOT EXISTS idx_sales_region ON sales_records(region);

      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          salt TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('admin', 'manager', 'viewer')),
          name TEXT NOT NULL
      );
    `);

    // Seed default users if empty
    const userCountRes = await pool.query('SELECT COUNT(*) as count FROM users');
    const userCount = parseInt(userCountRes.rows[0].count, 10);

    if (userCount === 0) {
      const seedUser = async (email, password, role, name) => {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = hashPassword(password, salt);
        await pool.query(
          'INSERT INTO users (email, password_hash, salt, role, name) VALUES ($1, $2, $3, $4, $5)',
          [email, hash, salt, role, name]
        );
      };

      await seedUser('admin@insightengine.com', 'admin123', 'admin', 'Admin User');
      await seedUser('manager@insightengine.com', 'manager123', 'manager', 'Manager User');
      await seedUser('viewer@insightengine.com', 'viewer123', 'viewer', 'Viewer User');
      console.log('Seeded default user accounts to Supabase.');
    }

    console.log('Database schema initialized on Supabase.');
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
};

// Run initialization
initDb();

const queryFn = async (text, params) => {
  const result = await pool.query(text, params);
  return result;
};

const getClient = async () => {
  const client = await pool.connect();
  return {
    query: (text, params) => client.query(text, params),
    release: () => client.release()
  };
};

module.exports = {
  query: queryFn,
  getClient,
  hashPassword,
};
