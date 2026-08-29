import type { APIRoute } from 'astro';
import { createCategory } from '../../../lib/db/skills';
import { verifyAuth } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    await verifyAuth(request);
    
    const { name } = await request.json();
    if (!name) {
      return new Response(
        JSON.stringify({ detail: 'El nombre de la categoría es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const category = await createCategory(name);
    return new Response(JSON.stringify(category), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    const status = error.message.includes('No autorizado') ? 401 : 500;
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
