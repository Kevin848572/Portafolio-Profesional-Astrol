import pool from '../db';

export interface ExperienceAchievement {
  id: number;
  text: string;
  experience_id: number;
}

export interface Experience {
  id: number;
  year: string;
  period: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
  achievements?: ExperienceAchievement[];
}

export async function getAllExperiences(): Promise<Experience[]> {
  const experiencesResult = await pool.query('SELECT * FROM experiences ORDER BY id DESC');
  const experiences: Experience[] = experiencesResult.rows;

  const achievementsResult = await pool.query('SELECT * FROM experience_achievements ORDER BY id');
  const achievements: ExperienceAchievement[] = achievementsResult.rows;

  for (const exp of experiences) {
    exp.achievements = achievements.filter(a => a.experience_id === exp.id);
  }

  return experiences;
}

export async function getExperienceById(id: number): Promise<Experience | null> {
  const expResult = await pool.query('SELECT * FROM experiences WHERE id = $1 LIMIT 1', [id]);
  if (expResult.rows.length === 0) return null;
  const exp: Experience = expResult.rows[0];

  const achResult = await pool.query('SELECT * FROM experience_achievements WHERE experience_id = $1 ORDER BY id', [id]);
  exp.achievements = achResult.rows;

  return exp;
}

export async function createExperience(data: Omit<Experience, 'id'> & { achievements?: Omit<ExperienceAchievement, 'id' | 'experience_id'>[] }): Promise<Experience> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Insert experience
    const expResult = await client.query(
      `INSERT INTO experiences (year, period, role, company, description, tags) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [data.year, data.period, data.role, data.company, data.description, data.tags]
    );
    const exp: Experience = expResult.rows[0];
    
    // Insert achievements if provided
    exp.achievements = [];
    if (data.achievements && data.achievements.length > 0) {
      for (const ach of data.achievements) {
        const achResult = await client.query(
          'INSERT INTO experience_achievements (text, experience_id) VALUES ($1, $2) RETURNING *',
          [ach.text, exp.id]
        );
        exp.achievements.push(achResult.rows[0]);
      }
    }
    
    await client.query('COMMIT');
    return exp;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function updateExperience(
  id: number, 
  data: Partial<Omit<Experience, 'id'>> & { achievements?: Omit<ExperienceAchievement, 'id' | 'experience_id'>[] }
): Promise<Experience | null> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Filter fields to update
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    const { achievements, ...expData } = data;

    for (const [key, value] of Object.entries(expData)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    if (fields.length > 0) {
      values.push(id);
      await client.query(`UPDATE experiences SET ${fields.join(', ')} WHERE id = $${index}`, values);
    }

    // Update achievements if provided (replace them)
    if (achievements !== undefined) {
      // Delete old achievements
      await client.query('DELETE FROM experience_achievements WHERE experience_id = $1', [id]);
      
      // Insert new achievements
      if (achievements.length > 0) {
        for (const ach of achievements) {
          await client.query(
            'INSERT INTO experience_achievements (text, experience_id) VALUES ($1, $2)',
            [ach.text, id]
          );
        }
      }
    }

    await client.query('COMMIT');
    
    // Fetch and return the updated experience
    return await getExperienceById(id);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function deleteExperience(id: number): Promise<boolean> {
  // CASCADE delete will handle achievements thanks to foreign key ON DELETE CASCADE
  const result = await pool.query('DELETE FROM experiences WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
