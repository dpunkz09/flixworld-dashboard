// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

const port = parseInt(process.env.PORT ?? '4321', 10);
const host = process.env.HOST ?? 'localhost';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  server: {
    port,
    host,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: node({
    mode: 'standalone',
  }),
});
