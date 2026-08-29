import type { APIRoute } from 'astro';
import { getAllCategories, createSkill, getCategoryById } from '../../../lib/db/skills';
import { verifyAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const categories = await getAllCategories();
    return new Response(JSON.stringify(categories), { status: 200, headers: { 'Content-Type': 'application/json' } });
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
    
    // Check if category exists
    const category = await getCategoryById(data.category_id);
    if (!category) {
      return new Response(
        JSON.stringify({ detail: 'Categoría no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const skill = await createSkill(data);
    return new Response(JSON.stringify(skill), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    const status = error.message.includes('No autorizado') ? 401 : 500;
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
