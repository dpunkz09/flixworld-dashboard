import type { APIRoute } from 'astro';
import {
  addNetflixTopShowItem,
  updateNetflixTopShowItem,
  deleteNetflixTopShowItem,
} from '../../lib/supabase';

const VALID_TYPES = new Set(['movie', 'tv']);

function isValidId(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v > 0;
}

function isValidTmdbId(v: unknown): boolean {
  if (typeof v === 'number') return Number.isInteger(v) && v > 0;
  if (typeof v === 'string') return /^\d+$/.test(v) && Number(v) > 0;
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { tmdb_id, type } = body ?? {};
    if (!isValidTmdbId(tmdb_id)) return json({ error: 'tmdb_id must be a positive integer' }, 400);
    if (!VALID_TYPES.has(type)) return json({ error: 'type must be "movie" or "tv"' }, 400);
    const data = await addNetflixTopShowItem(tmdb_id, type);
    return json(data, 201);
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, tmdb_id, type } = body ?? {};
    if (!isValidId(id)) return json({ error: 'id must be a positive integer' }, 400);
    if (!isValidTmdbId(tmdb_id)) return json({ error: 'tmdb_id must be a positive integer' }, 400);
    if (!VALID_TYPES.has(type)) return json({ error: 'type must be "movie" or "tv"' }, 400);
    const data = await updateNetflixTopShowItem(id, tmdb_id, type);
    return json(data, 200);
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id } = body ?? {};
    if (!isValidId(id)) return json({ error: 'id must be a positive integer' }, 400);
    await deleteNetflixTopShowItem(id);
    return json({ success: true }, 200);
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
