import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendOrigin = process.env.BACKEND_ORIGIN || 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': backendOrigin,
      '/health': backendOrigin,
    },
  },
})
