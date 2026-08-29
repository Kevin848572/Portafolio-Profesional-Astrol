import type { APIRoute } from 'astro';
import { getAllProjects, createProject, getProjectBySlug } from '../../../lib/db/projects';
import { verifyAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const category = url.searchParams.get('category');
    const projects = await getAllProjects(category);
    return new Response(JSON.stringify(projects), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Require auth
    await verifyAuth(request);
    
    const data = await request.json();
    
    // Check if slug already exists
    const existing = await getProjectBySlug(data.slug);
    if (existing) {
      return new Response(
        JSON.stringify({ detail: 'Ya existe un proyecto con ese slug' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const project = await createProject(data);
    return new Response(JSON.stringify(project), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    const status = error.message.includes('No autorizado') ? 401 : 500;
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
