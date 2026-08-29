import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // Use SSL for production databases (like Supabase/Neon/etc.) but disable rejectUnauthorized unless needed.
  // Locally, if DATABASE_URL contains localhost, ssl can be disabled.
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

export default pool;
