import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['sb-5ld3ng1tx244.vercel.run', 'sb-61kaqkvccyni.vercel.run'],
  },
})
