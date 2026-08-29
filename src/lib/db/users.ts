import pool from '../db';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  hashed_password: string;
  is_active: boolean;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [username]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const user = await getUserByUsername(username);
  if (!user || !user.is_active) return null;
  
  const matches = bcrypt.compareSync(password, user.hashed_password);
  if (!matches) return null;
  
  return user;
}

export async function createUser(username: string, password: string): Promise<User> {

  const hashed = bcrypt.hashSync(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, hashed_password, is_active) VALUES ($1, $2, $3) RETURNING *',
    [username, hashed, true]
  );
  return result.rows[0];
}
