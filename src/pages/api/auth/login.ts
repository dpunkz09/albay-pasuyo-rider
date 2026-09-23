import type { APIRoute } from 'astro';
import { verifyPassword, createSessionToken, COOKIE_NAME, COOKIE_MAX_AGE } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const password = String(body.password ?? '');

  if (!verifyPassword(password)) {
    return new Response(JSON.stringify({ error: 'Invalid password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = createSessionToken();
  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    // secure: true, // uncomment when serving over HTTPS
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
