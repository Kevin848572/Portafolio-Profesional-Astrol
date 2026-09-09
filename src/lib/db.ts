let poolInstance: any = null;

async function getPool() {
  if (!poolInstance) {
    const pgModule = await import('pg');
    const pg = pgModule.default || pgModule;
    const databaseUrl = 
      process.env.DATABASE_URL || 
      (typeof import.meta !== 'undefined' ? import.meta.env?.DATABASE_URL : undefined);

    poolInstance = new pg.Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl && !databaseUrl.includes('localhost') ? { rejectUnauthorized: false } : false
    });
  }
  return poolInstance;
}

const pool = {
  query: async (...args: any[]) => {
    const p = await getPool();
    return p.query(...args);
  }
};

export default pool;
