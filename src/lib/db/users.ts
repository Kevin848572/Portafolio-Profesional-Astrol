import pool from '../db.ts';

export interface User {
  id: number;
  username: string;
  hashed_password: string;
  is_active: boolean;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const defaultAdminUser = process.env.ADMIN_USERNAME || 'admin';
  if (username === defaultAdminUser) {
    return {
      id: 1,
      username: defaultAdminUser,
      hashed_password: '',
      is_active: true
    };
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [username]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const defaultAdminUser = process.env.ADMIN_USERNAME || 'admin';
  const defaultAdminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === defaultAdminUser && password === defaultAdminPass) {
    return {
      id: 1,
      username: defaultAdminUser,
      hashed_password: '',
      is_active: true
    };
  }

  try {
    const user = await getUserByUsername(username);
    if (!user || !user.is_active || !user.hashed_password) return null;
    
    const bcryptModule = await import('bcryptjs');
    const bcrypt = bcryptModule.default || bcryptModule;
    const matches = bcrypt.compareSync(password, user.hashed_password);
    if (!matches) return null;
    
    return user;
  } catch (error) {
    return null;
  }
}

export async function createUser(username: string, password: string): Promise<User> {
  const bcryptModule = await import('bcryptjs');
  const bcrypt = bcryptModule.default || bcryptModule;
  const hashed = bcrypt.hashSync(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, hashed_password, is_active) VALUES ($1, $2, $3) RETURNING *',
    [username, hashed, true]
  );
  return result.rows[0];
}
