import jwt from 'jsonwebtoken';
import { getUserByUsername, type User } from './db/users';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'change-this-in-production';
const ALGORITHM = 'HS256';

export interface TokenPayload {
  sub: string;
  exp?: number;
}

export function createAccessToken(username: string): string {
  // Access token valid for 1 day (1440 minutes)
  return jwt.sign({ sub: username }, SECRET_KEY, { algorithm: ALGORITHM, expiresIn: '24h' });
}

export async function verifyAuth(request: Request): Promise<User> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No autorizado: Token faltante o formato incorrecto');
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, SECRET_KEY, { algorithms: [ALGORITHM] }) as TokenPayload;
    if (!payload.sub) {
      throw new Error('Token inválido: "sub" faltante');
    }

    const user = await getUserByUsername(payload.sub);
    if (!user || !user.is_active) {
      throw new Error('No autorizado: Usuario inactivo o inexistente');
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Token inválido o expirado');
  }
}
