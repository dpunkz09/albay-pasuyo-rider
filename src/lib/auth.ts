import crypto from 'node:crypto';

const SECRET = process.env.SESSION_SECRET ?? 'fallback-secret-change-me';
const COOKIE_NAME = 'rider_session';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours
const TOKEN_MAX_AGE_MS = COOKIE_MAX_AGE * 1000; // Convert to milliseconds

/** Create an HMAC-signed session token */
export function createSessionToken(): string {
  const payload = `admin:${Date.now()}`;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

/** Verify a session token; returns true if valid and not expired */
export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const lastColon = decoded.lastIndexOf(':');
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    
    // Verify signature
    const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) {
      return false;
    }
    
    // Verify token age
    const parts = payload.split(':');
    if (parts.length !== 2) return false;
    
    const timestamp = parseInt(parts[1], 10);
    if (isNaN(timestamp)) return false;
    
    const age = Date.now() - timestamp;
    return age >= 0 && age < TOKEN_MAX_AGE_MS;
  } catch {
    return false;
  }
}

/** Verify the admin password against env var */
export function verifyPassword(input: string): boolean {
  const stored = process.env.ADMIN_PASSWORD ?? '';
  if (!stored || !input) return false;
  // Use timingSafeEqual to prevent timing attacks
  try {
    const a = Buffer.from(input.padEnd(72).slice(0, 72));
    const b = Buffer.from(stored.padEnd(72).slice(0, 72));
    return crypto.timingSafeEqual(a, b) && input === stored;
  } catch {
    return false;
  }
}

export { COOKIE_NAME, COOKIE_MAX_AGE };
