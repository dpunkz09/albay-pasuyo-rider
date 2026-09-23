import type { APIRoute } from 'astro';
import { COOKIE_NAME } from '../../../lib/auth';

export const POST: APIRoute = ({ cookies }) => {
  cookies.delete(COOKIE_NAME, { path: '/' });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
