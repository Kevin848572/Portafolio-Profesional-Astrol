import crypto from 'node:crypto';
import { getUserByUsername, type User } from './db/users';

export interface TokenPayload {
  sub: string;
  exp?: number;
}

function getSecretKey(): string {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET_KEY debe estar configurada en el entorno de producción con un mínimo de 16 caracteres.');
    }
    console.warn('ADVERTENCIA: JWT_SECRET_KEY no definida o insegura en entorno de desarrollo. Usando clave de desarrollo local.');
    return 'dev-local-jwt-secret-key-32-chars-long-security-fix';
  }
  return secret;
}

export function createAccessToken(username: string): string {
  const secret = getSecretKey();
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');
    
  return `${header}.${payload}.${signature}`;
}

export async function verifyAuth(request: Request): Promise<User> {
  let token = '';

  // 1. Extraer desde cabecera Authorization: Bearer <token>
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Extraer alternativamente desde Cookie HTTP admin_token
  if (!token) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]).trim();
    }
  }

  if (!token) {
    throw new Error('No autorizado: Token faltante o formato incorrecto');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Token inválido: formato incorrecto');
  }

  const [header, payload, signature] = parts;
  const secret = getSecretKey();
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  // Prevención de Timing Attacks: Comparación en tiempo constante usando Buffer seguro
  const sigBuffer = Buffer.from(signature, 'utf8');
  const expBuffer = Buffer.from(expectedSignature, 'utf8');

  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    throw new Error('Token inválido: firma no coincide');
  }

  let data: TokenPayload;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TokenPayload;
  } catch {
    throw new Error('Token inválido: formato de carga no válido');
  }

  if (data.exp && Date.now() / 1000 > data.exp) {
    throw new Error('Token expirado');
  }

  if (!data.sub) {
    throw new Error('Token inválido: "sub" faltante');
  }

  const user = await getUserByUsername(data.sub);
  if (!user || !user.is_active) {
    throw new Error('No autorizado: Usuario inactivo o inexistente');
  }

  return user;
}
