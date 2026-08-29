import type { APIRoute } from 'astro';
import { getAllSkillsFlat } from '../../../lib/db/skills';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const skills = await getAllSkillsFlat();
    return new Response(JSON.stringify(skills), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
