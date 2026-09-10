import type { APIRoute } from 'astro';
import { 
  db, 
  isFirebaseConfigured, 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  orderBy 
} from '../../../lib/firebase.js';
import { verifyAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await verifyAuth(request);

    if (isFirebaseConfigured() && db) {
      try {
        const colRef = collection(db, 'contacts');
        const q = query(colRef, orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);

        const messages = snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || '',
            email: data.email || '',
            message: data.message || '',
            created_at: data.created_at || null
          };
        });

        return new Response(JSON.stringify(messages), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (fbError) {
        console.warn('Fallback a lectura simple de contactos Firestore:', fbError);
        // Fallback en caso de que el índice ordenado aún no esté listo
        const snapshot = await getDocs(collection(db, 'contacts'));
        const messages = snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || '',
            email: data.email || '',
            message: data.message || '',
            created_at: data.created_at || null
          };
        });
        messages.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        return new Response(JSON.stringify(messages), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify([]), {
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

    if (isFirebaseConfigured() && db) {
      await deleteDoc(doc(db, 'contacts', id));
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
