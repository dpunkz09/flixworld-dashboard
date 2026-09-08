module.exports = {
  apps: [
    {
      name: 'flixworld-dashboard',
      script: './dist/server/entry.mjs',
      cwd: '/var/www/jpaworx.com/flixworld-dashboard',

      // Node environment
      interpreter: 'node',

      // Restart policy
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,

      // Cluster mode — set to 'fork' for a single instance,
      // or change instances to the number of CPU cores for load balancing
      exec_mode: 'fork',
      instances: 1,

      // Environment variables (production)
      env_production: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 4321,
        SUPABASE_URL: 'https://hdzvzwoutvvjvxysyltm.supabase.co',
        SUPABASE_ANON_KEY:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkenZ6d291dHZ2anZ4eXN5bHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NzU2MjIsImV4cCI6MjEwNDA1MTYyMn0.vf8BDWfro1feSJRUYiBZBRWVgUaUSVMmqjvFUxn2LkQ',
        TMDB_API_KEY: 'ab73901361c0c24c65f1ff1331704464',
      },

      // Logs
      out_file: '/var/log/pm2/flixworld-dashboard-out.log',
      error_file: '/var/log/pm2/flixworld-dashboard-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
