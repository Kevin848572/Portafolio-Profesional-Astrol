import pool from '../db';

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  long_description: string | null;
  category: string;
  tags: string[];
  image: string | null;
  demo_url: string | null;
  github_url: string | null;
  featured: boolean;
}

export async function getAllProjects(category?: string | null): Promise<Project[]> {
  let query = 'SELECT * FROM projects';
  const values: any[] = [];
  
  if (category && category !== 'Todos') {
    query += ' WHERE category ILIKE $1';
    values.push(category);
  }
  
  query += ' ORDER BY id';
  const result = await pool.query(query, values);
  return result.rows;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const result = await pool.query('SELECT * FROM projects WHERE featured = TRUE ORDER BY id');
  return result.rows;
}

export async function getProjectById(id: number): Promise<Project | null> {
  const result = await pool.query('SELECT * FROM projects WHERE id = $1 LIMIT 1', [id]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const result = await pool.query('SELECT * FROM projects WHERE slug = $1 LIMIT 1', [slug]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

export async function createProject(data: Omit<Project, 'id'>): Promise<Project> {
  const result = await pool.query(
    `INSERT INTO projects 
    (slug, title, description, long_description, category, tags, image, demo_url, github_url, featured) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING *`,
    [
      data.slug,
      data.title,
      data.description,
      data.long_description,
      data.category,
      data.tags,
      data.image,
      data.demo_url,
      data.github_url,
      data.featured
    ]
  );
  return result.rows[0];
}

export async function updateProject(id: number, data: Partial<Omit<Project, 'id'>>): Promise<Project | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }

  if (fields.length === 0) return await getProjectById(id);

  values.push(id);
  const query = `UPDATE projects SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
  const result = await pool.query(query, values);
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

export async function deleteProject(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
