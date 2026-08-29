import pool from '../db';

export interface Profile {
  id: number;
  name: string;
  role: string;
  status: string;
  title: string;
  subtitle: string;
  image_url: string;
  email: string;
  location: string;
  cv_url: string | null;
  stats: any; // will hold parsed json array
  socials: any; // will hold parsed json object
}

export async function getProfile(): Promise<Profile | null> {
  const result = await pool.query('SELECT * FROM profile LIMIT 1');
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

export async function updateProfile(id: number, data: Partial<Omit<Profile, 'id'>>): Promise<Profile | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    // Stringify JSON/JSONB fields for pg package
    if (key === 'stats' || key === 'socials') {
      fields.push(`${key} = $${index}`);
      values.push(JSON.stringify(value));
    } else {
      fields.push(`${key} = $${index}`);
      values.push(value);
    }
    index++;
  }

  if (fields.length === 0) return await getProfile();

  values.push(id);
  const query = `UPDATE profile SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
  const result = await pool.query(query, values);
  if (result.rows.length === 0) return null;
  return result.rows[0];
}
