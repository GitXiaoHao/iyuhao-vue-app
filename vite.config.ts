import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      /** @ 符号指向 src 目录 */
      "@":  resolve(__dirname, "./src")
    }
  },
  build: {
    chunkSizeWarningLimit:1500,
    rollupOptions: {
      output:{
        manualChunks(id) {
          if (id.includes('node_modules')) {

            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/iyuhao': {
        target: 'http://127.0.0.1:8083/iyuhao',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/iyuhao/, '')
      }
    }
  }
})
