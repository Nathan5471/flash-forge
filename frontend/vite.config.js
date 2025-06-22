import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      runtimeChaching: [
        {
          urlPattern: /^\/downloads\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'downloads-pages',
            expiration: {
              maxEntries: 30,
            },
            fallbackURL: '/downloads',
          },
        },
      ],
    },
    manifest: {
      name: 'Flash Forge',
      short_name: 'Flash Forge',
      start_url: '/',
      display: 'standalone',
      background_color: '#4B5563',
    }
  })],
})
