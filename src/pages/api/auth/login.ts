import type { APIRoute } from 'astro';
import { authenticateUser } from '../../../lib/db/users';
import { createAccessToken } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const username = body.username;
    const password = body.password;
    
    if (!username || !password) {
      return new Response(
        JSON.stringify({ detail: 'El usuario y la contraseña son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const user = await authenticateUser(String(username).trim(), String(password));
    if (!user) {
      return new Response(
        JSON.stringify({ detail: 'Credenciales incorrectas' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = createAccessToken(user.username);

    // Guardar token en cookie segura HttpOnly para protección de rutas SSR en servidor
    cookies.set('admin_token', token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 horas
    });

    return new Response(
      JSON.stringify({ success: true, access_token: token }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[Login Error]:', error);
    return new Response(
      JSON.stringify({ detail: 'Error interno en el servidor al autenticar' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
