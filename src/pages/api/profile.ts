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
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
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
    const status = error.message.includes('No autorizado') ? 401 : 500;
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
