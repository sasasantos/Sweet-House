import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['5173-iu70zetq0zhmwe7bgc4u4-dbb78286.manus.computer']
  },
  build: {
    outDir: 'dist',
    minify: 'terser'
  }
})
