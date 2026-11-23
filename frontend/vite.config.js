import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// proxy /products ke API Express (port 3000) supaya gak CORS saat dev
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/products': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
