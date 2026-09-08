import type { APIRoute } from 'astro';
import {
  addCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
} from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { tmdb_id, type } = await request.json();
    if (!tmdb_id || !type) return json({ error: 'tmdb_id and type are required' }, 400);
    const data = await addCarouselItem(tmdb_id, type);
    return json(data, 201);
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const { id, tmdb_id, type } = await request.json();
    if (!id || !tmdb_id || !type) return json({ error: 'id, tmdb_id, and type are required' }, 400);
    const data = await updateCarouselItem(id, tmdb_id, type);
    return json(data, 200);
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();
    if (!id) return json({ error: 'id is required' }, 400);
    await deleteCarouselItem(id);
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
