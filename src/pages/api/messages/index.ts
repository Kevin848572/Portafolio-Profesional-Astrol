import type { APIRoute } from 'astro';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase.js';
import pool from '../../../lib/db';
import { verifyAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await verifyAuth(request);

    // 1. Intentar con Supabase client
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (e) {
        console.warn('Fallback a DB pool para consultar mensajes:', e);
      }
    }

    // 2. Fallback directo a PostgreSQL (DATABASE_URL)
    const result = await pool.query('SELECT * FROM contacts ORDER BY id DESC');
    return new Response(JSON.stringify(result.rows || []), {
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

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ detail: 'ID requerido' }), { status: 400 });
    }

    // 1. Intentar con Supabase client
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('contacts')
          .delete()
          .eq('id', id);

        if (!error) {
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (e) {
        console.warn('Fallback a DB pool para eliminar mensaje:', e);
      }
    }

    // 2. Fallback directo a PostgreSQL (DATABASE_URL)
    await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
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
