import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// const port = import.meta.env.API_PORT || 8800;
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.API_PORT || 8800}`,
        changeOrigin: true,
        secure: false,
      }
    },
  },
})
