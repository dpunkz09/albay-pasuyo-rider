import type { APIRoute } from 'astro';
import { getSettings, saveSettings } from '../../lib/db';
import { verifySessionToken, COOKIE_NAME } from '../../lib/auth';

/** GET /api/settings — public, returns current settings as JSON */
export const GET: APIRoute = () => {
  const settings = getSettings();
  return new Response(JSON.stringify(settings), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

/** POST /api/settings — admin only, updates settings */
export const POST: APIRoute = async ({ request, cookies }) => {
  // Auth check
  const token = cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate numeric fields
  const fields = ['fixedLat', 'fixedLng', 'baseFee', 'feePerKm', 'freeKm', 'maxKm'] as const;
  const updates: Record<string, number> = {};
  for (const field of fields) {
    if (body[field] !== undefined) {
      const val = parseFloat(String(body[field]));
      if (isNaN(val)) {
        return new Response(JSON.stringify({ error: `Invalid value for ${field}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      updates[field] = val;
    }
  }

  saveSettings(updates);
  return new Response(JSON.stringify({ ok: true, settings: getSettings() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
