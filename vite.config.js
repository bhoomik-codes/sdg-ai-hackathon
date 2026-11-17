import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
const projectRoot = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@demo-data': resolve(projectRoot, mode === 'demo' ? 'src/demoData.js' : 'src/emptyData.js'),
    },
  },
  plugins: [react(), tailwindcss()],
}))
