import type { APIRoute } from 'astro';
import { getAllExperiences, createExperience } from '../../../lib/db/experiences';
import { verifyAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const experiences = await getAllExperiences();
    return new Response(JSON.stringify(experiences), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await verifyAuth(request);
    
    const data = await request.json();
    const experience = await createExperience(data);
    return new Response(JSON.stringify(experience), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    const status = error.message.includes('No autorizado') ? 401 : 500;
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
