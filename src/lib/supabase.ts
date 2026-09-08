import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export interface SupabaseItem {
  id: number;
  created_at: string;
  tmdb_id: string | number;
  type: 'movie' | 'tv';
}

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

// ── Generic helpers ──────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error ${res.status}: ${text}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as unknown as T;
  }
  return res.json() as Promise<T>;
}

// ── Carousel ─────────────────────────────────────────────────────────────────

export const getCarouselItems = () =>
  request<SupabaseItem[]>('/carousel?order=id.asc');

export const addCarouselItem = (tmdb_id: number | string, type: 'movie' | 'tv') =>
  request<SupabaseItem[]>('/carousel', {
    method: 'POST',
    body: JSON.stringify({ tmdb_id: String(tmdb_id), type }),
  });

export const updateCarouselItem = (
  id: number,
  tmdb_id: number | string,
  type: 'movie' | 'tv'
) =>
  request<SupabaseItem[]>(`/carousel?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ tmdb_id: String(tmdb_id), type }),
  });

export const deleteCarouselItem = (id: number): Promise<void> =>
  request<void>(`/carousel?id=eq.${id}`, { method: 'DELETE' });

// ── Netflix Top ───────────────────────────────────────────────────────────────

export const getNetflixTopItems = () =>
  request<SupabaseItem[]>('/netflix_top?order=id.asc');

export const addNetflixTopItem = (tmdb_id: number | string, type: 'movie' | 'tv') =>
  request<SupabaseItem[]>('/netflix_top', {
    method: 'POST',
    body: JSON.stringify({ tmdb_id: String(tmdb_id), type }),
  });

export const updateNetflixTopItem = (
  id: number,
  tmdb_id: number | string,
  type: 'movie' | 'tv'
) =>
  request<SupabaseItem[]>(`/netflix_top?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ tmdb_id: String(tmdb_id), type }),
  });

export const deleteNetflixTopItem = (id: number): Promise<void> =>
  request<void>(`/netflix_top?id=eq.${id}`, { method: 'DELETE' });

// ── Netflix Top Shows ─────────────────────────────────────────────────────────

export const getNetflixTopShowItems = () =>
  request<SupabaseItem[]>('/netflix_topshow?order=id.asc');

export const addNetflixTopShowItem = (tmdb_id: number | string, type: 'movie' | 'tv') =>
  request<SupabaseItem[]>('/netflix_topshow', {
    method: 'POST',
    body: JSON.stringify({ tmdb_id: String(tmdb_id), type }),
  });

export const updateNetflixTopShowItem = (
  id: number,
  tmdb_id: number | string,
  type: 'movie' | 'tv'
) =>
  request<SupabaseItem[]>(`/netflix_topshow?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ tmdb_id: String(tmdb_id), type }),
  });

export const deleteNetflixTopShowItem = (id: number): Promise<void> =>
  request<void>(`/netflix_topshow?id=eq.${id}`, { method: 'DELETE' });
