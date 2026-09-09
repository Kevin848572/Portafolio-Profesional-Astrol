import crypto from 'node:crypto';
import { getUserByUsername, type User } from './db/users';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'kevindev-secret-key-super-secure-2026';

export interface TokenPayload {
  sub: string;
  exp?: number;
}

export function createAccessToken(username: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${payload}`)
    .digest('base64url');
    
  return `${header}.${payload}.${signature}`;
}

export async function verifyAuth(request: Request): Promise<User> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No autorizado: Token faltante o formato incorrecto');
  }

  const token = authHeader.substring(7);
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Token inválido: formato incorrecto');
  }

  const [header, payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (signature !== expectedSignature) {
    throw new Error('Token inválido: firma no coincide');
  }

  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TokenPayload;
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
