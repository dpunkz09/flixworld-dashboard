import { TMDB_API_KEY, TMDB_BASE, TMDB_IMAGE_BASE } from './config';

export interface TmdbMedia {
  id: number;
  title?: string;       // movies
  name?: string;        // tv
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;   // movies
  first_air_date?: string; // tv
  vote_average: number;
  media_type?: 'movie' | 'tv';
  genre_ids?: number[];
}

export interface TmdbSearchResult {
  results: TmdbMedia[];
  total_results: number;
  total_pages: number;
}

// ── In-process TTL cache ─────────────────────────────────────────────────────
// Avoids redundant TMDB fetches across page renders within the same process.
// TTL: 10 minutes — short enough for fresh data, long enough to avoid hammering
// the API on every request.

const TTL_MS = 10 * 60 * 1000;

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function cacheGet<T>(key: string): T | undefined {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

function cacheSet<T>(key: string, value: T): void {
  cache.set(key, { value, expiresAt: Date.now() + TTL_MS });
}

// ── TMDB fetch helper ────────────────────────────────────────────────────────

async function tmdbFetch<T>(path: string): Promise<T> {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE}${path}${sep}api_key=${TMDB_API_KEY}`;

  const cached = cacheGet<T>(url);
  if (cached !== undefined) return cached;

  const r = await fetch(url);
  if (!r.ok) throw new Error(`TMDB ${r.status}: ${r.statusText}`);
  const data = await r.json() as T;
  cacheSet(url, data);
  return data;
}

// ── Public API ───────────────────────────────────────────────────────────────

export function getMovieDetails(id: number | string): Promise<TmdbMedia> {
  return tmdbFetch<TmdbMedia>(`/movie/${id}`);
}

export function getTvDetails(id: number | string): Promise<TmdbMedia> {
  return tmdbFetch<TmdbMedia>(`/tv/${id}`);
}

export function searchMulti(query: string): Promise<TmdbSearchResult> {
  return tmdbFetch<TmdbSearchResult>(
    `/search/multi?query=${encodeURIComponent(query)}`
  );
}

export function posterUrl(path: string | null): string {
  if (!path) return '/placeholder-poster.svg';
  return `${TMDB_IMAGE_BASE}${path}`;
}

export function displayTitle(item: TmdbMedia): string {
  return item.title ?? item.name ?? 'Unknown';
}

export function displayYear(item: TmdbMedia): string {
  const d = item.release_date ?? item.first_air_date ?? '';
  return d ? d.slice(0, 4) : '—';
}

/**
 * Enriches an array of Supabase items with TMDB metadata.
 * All requests are fired concurrently. Failed lookups fall back to null.
 * Results are cached per TMDB ID+type for TTL_MS milliseconds.
 */
export async function enrichItems(
  items: Array<{ tmdb_id: string | number; type: 'movie' | 'tv' }>
): Promise<Array<TmdbMedia | null>> {
  return Promise.all(
    items.map(({ tmdb_id, type }) =>
      (type === 'movie' ? getMovieDetails(tmdb_id) : getTvDetails(tmdb_id)).catch(
        () => null
      )
    )
  );
}
