// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone',
  }),
  security: {
    // En Plesk la petición pasa por un proxy y Astro confunde http con https,
    // así que desactivamos esta revisión (la cookie del admin ya es sameSite strict)
    checkOrigin: false,
  },
});