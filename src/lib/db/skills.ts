import pool from '../db';

export interface Skill {
  id: number;
  name: string;
  level: string;
  description: string | null;
  category_id: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  skills?: Skill[];
}

export async function getAllCategories(): Promise<SkillCategory[]> {
  // First, get all categories
  const categoriesResult = await pool.query('SELECT * FROM skill_categories ORDER BY id');
  const categories: SkillCategory[] = categoriesResult.rows;

  // Then, get all skills
  const skillsResult = await pool.query('SELECT * FROM skills ORDER BY id');
  const skills: Skill[] = skillsResult.rows;

  // Nest skills in categories
  for (const category of categories) {
    category.skills = skills.filter(s => s.category_id === category.id);
  }

  return categories;
}

export async function getCategoryById(id: number): Promise<SkillCategory | null> {
  const categoryResult = await pool.query('SELECT * FROM skill_categories WHERE id = $1 LIMIT 1', [id]);
  if (categoryResult.rows.length === 0) return null;
  const category: SkillCategory = categoryResult.rows[0];

  const skillsResult = await pool.query('SELECT * FROM skills WHERE category_id = $1 ORDER BY id', [id]);
  category.skills = skillsResult.rows;

  return category;
}

export async function createCategory(name: string): Promise<SkillCategory> {
  const result = await pool.query('INSERT INTO skill_categories (name) VALUES ($1) RETURNING *', [name]);
  return result.rows[0];
}

export async function getSkillById(id: number): Promise<Skill | null> {
  const result = await pool.query('SELECT * FROM skills WHERE id = $1 LIMIT 1', [id]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

export async function getAllSkillsFlat(): Promise<Skill[]> {
  const result = await pool.query('SELECT * FROM skills ORDER BY id');
  return result.rows;
}

export async function createSkill(data: Omit<Skill, 'id'>): Promise<Skill> {
  const result = await pool.query(
    'INSERT INTO skills (name, level, description, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [data.name, data.level, data.description, data.category_id]
  );
  return result.rows[0];
}

export async function updateSkill(id: number, data: Partial<Omit<Skill, 'id'>>): Promise<Skill | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }

  if (fields.length === 0) return await getSkillById(id);

  values.push(id);
  const query = `UPDATE skills SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
  const result = await pool.query(query, values);
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

export async function deleteSkill(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM skills WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
