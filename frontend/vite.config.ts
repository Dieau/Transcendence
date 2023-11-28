import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

const API_HOST_FOR_DEV_PROXY = process.env.API_HOST || `http://localhost:3000`
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, `./src`),
    }
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `@import "./public/styles"`,
      },
    },
  },
  server: {
    proxy: {
      "/graphql": {
        target: API_HOST_FOR_DEV_PROXY,
        changeOrigin: true,
      },
      "/socket.io": {
        target: API_HOST_FOR_DEV_PROXY,
        changeOrigin: true,
      },
      "/auth": {
        target: API_HOST_FOR_DEV_PROXY,
        changeOrigin: true,
      }
    }
  }
})
