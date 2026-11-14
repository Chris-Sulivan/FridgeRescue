import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],
    server: {
      // The browser calls /api/... and Vite forwards it to the Express server,
      // so the backend does not need CORS in development.
      proxy: {
        '/api': env.VITE_API_TARGET || 'http://localhost:5000',
      },
    },
  }
})
