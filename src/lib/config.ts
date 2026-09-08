function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const SUPABASE_URL = requireEnv('SUPABASE_URL');
export const SUPABASE_ANON_KEY = requireEnv('SUPABASE_ANON_KEY');
export const TMDB_API_KEY = requireEnv('TMDB_API_KEY');

export const TMDB_BASE = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';
