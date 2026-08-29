import type { APIRoute } from 'astro';
import { verifyAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const user = await verifyAuth(request);
    
    return new Response(
      JSON.stringify({
        id: user.id,
        username: user.username,
        is_active: user.is_active
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ detail: error.message || 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
