import type { APIRoute } from 'astro';
import { getSkillById, updateSkill, deleteSkill } from '../../../lib/db/skills';
import { verifyAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ detail: 'ID inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const skill = await getSkillById(id);
    if (!skill) {
      return new Response(
        JSON.stringify({ detail: 'Skill no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(JSON.stringify(skill), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[API skills GET error]:', error);
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
    const updated = await updateSkill(id, data);
    if (!updated) {
      return new Response(
        JSON.stringify({ detail: 'Skill no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(JSON.stringify(updated), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    const isAuth = error.message?.includes('No autorizado');
    if (!isAuth) console.error('[API skills PUT error]:', error);
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
    
    const deleted = await deleteSkill(id);
    if (!deleted) {
      return new Response(
        JSON.stringify({ detail: 'Skill no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(null, { status: 204 });
  } catch (error: any) {
    const isAuth = error.message?.includes('No autorizado');
    if (!isAuth) console.error('[API skills DELETE error]:', error);
    return new Response(
      JSON.stringify({ detail: isAuth ? error.message : 'Error interno en el servidor' }),
      { status: isAuth ? 401 : 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
