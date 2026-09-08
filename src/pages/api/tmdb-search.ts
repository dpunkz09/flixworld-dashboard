import type { APIRoute } from 'astro';
import { searchMulti } from '../../lib/tmdb';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q') ?? '';
  if (!query.trim()) {
    return new Response(JSON.stringify({ results: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const data = await searchMulti(query);
    // Keep only movie/tv results with a poster
    const filtered = data.results.filter(
      (r) => (r.media_type === 'movie' || r.media_type === 'tv')
    );
    return new Response(JSON.stringify({ results: filtered }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
