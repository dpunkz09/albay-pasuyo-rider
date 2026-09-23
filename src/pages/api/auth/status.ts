import type { APIRoute } from 'astro';
import { verifySessionToken, COOKIE_NAME } from '../../../lib/auth';

/** GET /api/auth/status — returns whether the current session is authenticated */
export const GET: APIRoute = ({ cookies }) => {
  const token = cookies.get(COOKIE_NAME)?.value;
  const authenticated = !!(token && verifySessionToken(token));
  return new Response(JSON.stringify({ authenticated }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
