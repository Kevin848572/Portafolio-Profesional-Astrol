import type { APIRoute } from 'astro';
import { getProfile, updateProfile } from '../../lib/db/profile';
import { verifyAuth } from '../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const profile = await getProfile();
    if (!profile) {
      return new Response(
        JSON.stringify({ detail: 'Perfil no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(JSON.stringify(profile), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[API profile GET error]:', error);
    return new Response(
      JSON.stringify({ detail: 'Error interno en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    // Require auth
    await verifyAuth(request);
    
    const profile = await getProfile();
    if (!profile) {
      return new Response(
        JSON.stringify({ detail: 'Perfil no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await request.json();
    const updated = await updateProfile(profile.id, data);
    
    return new Response(JSON.stringify(updated), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    const isAuth = error.message?.includes('No autorizado');
    if (!isAuth) console.error('[API profile PUT error]:', error);
    return new Response(
      JSON.stringify({ detail: isAuth ? error.message : 'Error interno en el servidor' }),
      { status: isAuth ? 401 : 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
