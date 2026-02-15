import { createHmac } from 'crypto';

export type AuthTokenPayload = {
  sub: number;
  email: string;
  role: 'USER' | 'ADMIN';
  exp: number;
};

const base64url = (input: string) => Buffer.from(input).toString('base64url');
const parse = <T>(value: string): T => JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T;

export function signAuthToken(payload: Omit<AuthTokenPayload, 'exp'>, secret: string, expiresSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const full: AuthTokenPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + expiresSeconds };
  const h = base64url(JSON.stringify(header));
  const p = base64url(JSON.stringify(full));
  const s = createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
  return `${h}.${p}.${s}`;
}

export function verifyAuthToken(token: string, secret: string): AuthTokenPayload | null {
  try {
    const [h, p, s] = token.split('.');
    if (!h || !p || !s) return null;
    const expected = createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
    if (s !== expected) return null;
    const payload = parse<AuthTokenPayload>(p);
    if (!payload?.sub || !payload?.email || !payload?.role || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function extractBearerToken(header?: string): string | null {
  if (!header) return null;
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token.trim();
}
