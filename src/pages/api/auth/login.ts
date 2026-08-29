import type { APIRoute } from 'astro';
import { authenticateUser } from '../../../lib/db/users';
import { createAccessToken } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return new Response(
        JSON.stringify({ detail: 'El usuario y la contraseña son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const user = await authenticateUser(username, password);
    if (!user) {
      return new Response(
        JSON.stringify({ detail: 'Credenciales incorrectas' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = createAccessToken(user.username);
    return new Response(
      JSON.stringify({ access_token: token }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
