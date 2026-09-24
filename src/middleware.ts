import { defineMiddleware } from 'astro:middleware';
import { verifyAuth } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // 1. Permitir siempre el acceso directo a la página de login sin bucles de redirección
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return next();
  }

  // 2. Cualquier otra ruta administrativa (/admin, /admin/*) requiere sesión válida en el servidor
  if (pathname.startsWith('/admin')) {
    try {
      const user = await verifyAuth(context.request);
      context.locals.user = user;
    } catch {
      // Redirigir a login sólo si no está autenticado
      return context.redirect('/admin/login');
    }
  }

  const response = await next();

  // Inyectar cabeceras HTTP de seguridad
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
});
