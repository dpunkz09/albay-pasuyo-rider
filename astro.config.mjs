import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { config as loadEnv } from 'dotenv';

// Load .env before Astro reads any environment variables
loadEnv();

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    port: parseInt(process.env.PORT ?? '4321'),
    host: true,
  },

	vite: {
		plugins: [tailwindcss()],
	},
});
