import type { APIRoute } from 'astro';
import { getProjectById, updateProject, deleteProject } from '../../../lib/db/projects';
import { verifyAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ detail: 'ID inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const project = await getProjectById(id);
    if (!project) {
      return new Response(
        JSON.stringify({ detail: 'Proyecto no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(JSON.stringify(project), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[API projects GET error]:', error);
    return new Response(
      JSON.stringify({ detail: 'Error interno en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    await verifyAuth(request);
    
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ detail: 'ID inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const data = await request.json();
    const updated = await updateProject(id, data);
    if (!updated) {
      return new Response(
        JSON.stringify({ detail: 'Proyecto no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(JSON.stringify(updated), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    const isAuth = error.message?.includes('No autorizado');
    if (!isAuth) console.error('[API projects PUT error]:', error);
    return new Response(
      JSON.stringify({ detail: isAuth ? error.message : 'Error interno en el servidor' }),
      { status: isAuth ? 401 : 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    await verifyAuth(request);
    
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ detail: 'ID inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const deleted = await deleteProject(id);
    if (!deleted) {
      return new Response(
        JSON.stringify({ detail: 'Proyecto no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(null, { status: 204 });
  } catch (error: any) {
    const isAuth = error.message?.includes('No autorizado');
    if (!isAuth) console.error('[API projects DELETE error]:', error);
    return new Response(
      JSON.stringify({ detail: isAuth ? error.message : 'Error interno en el servidor' }),
      { status: isAuth ? 401 : 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
