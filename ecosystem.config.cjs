module.exports = {
  apps: [
    {
      name: 'flixworld-dashboard',
      script: './dist/server/entry.mjs',
      cwd: '/var/www/jpaworx.com/flixworld-dashboard',

      interpreter: 'node',

      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,

      exec_mode: 'fork',
      instances: 1,

      // Secrets are injected at deploy time via environment variables or
      // a .env.production file that is NOT committed to source control.
      // Run:  pm2 start ecosystem.config.cjs --env production
      env_production: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 2332,
        // SUPABASE_URL, SUPABASE_ANON_KEY, TMDB_API_KEY must be set
        // in the server environment before starting the process.
        // e.g. export SUPABASE_URL=... before calling pm2 start, or use
        // a secrets manager / CI pipeline to inject them.
      },
    },
  ],
};
