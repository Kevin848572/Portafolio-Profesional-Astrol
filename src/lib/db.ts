import pg from 'pg';

const databaseUrl = 
  process.env.DATABASE_URL || 
  (typeof import.meta !== 'undefined' ? import.meta.env?.DATABASE_URL : undefined);

const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl && !databaseUrl.includes('localhost') ? { rejectUnauthorized: false } : false
});

export default pool;
