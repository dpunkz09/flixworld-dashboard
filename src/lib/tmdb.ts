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

function tmdbFetch<T>(path: string): Promise<T> {
  const sep = path.includes('?') ? '&' : '?';
  return fetch(`${TMDB_BASE}${path}${sep}api_key=${TMDB_API_KEY}`)
    .then((r) => {
      if (!r.ok) throw new Error(`TMDB ${r.status}`);
      return r.json() as Promise<T>;
    });
}

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
 * Gracefully falls back to null for failed lookups.
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
