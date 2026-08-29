import type { APIRoute } from 'astro';
import { getExperienceById, updateExperience, deleteExperience } from '../../../lib/db/experiences';
import { verifyAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ detail: 'ID inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const experience = await getExperienceById(id);
    if (!experience) {
      return new Response(
        JSON.stringify({ detail: 'Experiencia no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(JSON.stringify(experience), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    await verifyAuth(request);
    
    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ detail: 'ID inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const data = await request.json();
    const updated = await updateExperience(id, data);
    if (!updated) {
      return new Response(
        JSON.stringify({ detail: 'Experiencia no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(JSON.stringify(updated), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    const status = error.message.includes('No autorizado') ? 401 : 500;
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    await verifyAuth(request);
    
    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ detail: 'ID inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const deleted = await deleteExperience(id);
    if (!deleted) {
      return new Response(
        JSON.stringify({ detail: 'Experiencia no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(null, { status: 204 });
  } catch (error: any) {
    const status = error.message.includes('No autorizado') ? 401 : 500;
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
