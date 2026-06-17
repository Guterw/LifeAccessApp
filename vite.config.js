import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'LifeAccess',
        short_name: 'LifeAccess',
        description: 'Seu sistema operacional pessoal: idiomas, fitness, finanças e tarefas em um só lugar.',
        theme_color: '#111827',
        background_color: '#111827',
        display: 'standalone',
        start_url: '/LifeAccessApp/',
        scope: '/LifeAccessApp/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: '/LifeAccessApp/',
})