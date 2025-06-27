import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), VitePWA({
    registerType: 'autoUpdate',
    navigateFallback: '/index.html',
    globPatterns: ['**/*.{js, css, html}'],
    manifest: {
      name: 'Flash Forge',
      short_name: 'Flash Forge',
      start_url: '/',
      display: 'standalone',
      background_color: '#4B5563',
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  })],
})
