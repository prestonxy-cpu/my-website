import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the built site works from any subdirectory on GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
  },
})
