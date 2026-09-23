module.exports = {
  apps: [
    {
      name: 'albaypasuyo',
      script: './dist/server/entry.mjs',
      interpreter: 'node',
      cwd: '/var/www/jpaworx.com/albay-pasuyo-rider',

      // Environment
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 6234,
        // Set COOKIE_SECURE=true only when serving over HTTPS (e.g. behind Nginx with SSL).
        // Leave as 'false' when serving over plain HTTP â€” otherwise the login cookie
        // will be silently dropped by the browser and you won't be able to log in.
        COOKIE_SECURE: 'true',
        // Uncomment and set a strong random secret before deploying:
        SESSION_SECRET: 'cG/QzIq0/G4gmVTR3IpCB6koXnjVVRO7L/vZYny2lKsP+L6GM3h+Evl6XDEVY6oIfLmzLJek7dd/ptFUYDZxsA=='
      },

      // Restart policy
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 2000,
      min_uptime: '5s',

      // Logging
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: false,
    },
  ],
};
