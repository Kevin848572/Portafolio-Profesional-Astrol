import type { APIRoute } from 'astro';
import { getFeaturedProjects } from '../../../lib/db/projects';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const projects = await getFeaturedProjects();
    return new Response(JSON.stringify(projects), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
