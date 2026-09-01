import type { APIRoute } from 'astro';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase.js';
import { verifyAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await verifyAuth(request);

    if (!isSupabaseConfigured() || !supabase) {
      return new Response(
        JSON.stringify({ error: 'Supabase no está configurado en las variables de entorno' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    const status = error.message?.includes('No autorizado') ? 401 : 500;
    return new Response(
      JSON.stringify({ detail: error.message || 'Error en el servidor' }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    await verifyAuth(request);

    if (!isSupabaseConfigured() || !supabase) {
      return new Response(
        JSON.stringify({ error: 'Supabase no está configurado' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ detail: 'ID requerido' }), { status: 400 });
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    const status = error.message?.includes('No autorizado') ? 401 : 500;
    return new Response(
      JSON.stringify({ detail: error.message || 'Error al eliminar' }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
