import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode || '', process.cwd())

  const port = Number(env.VITE_TEST_PORT)

  return {
    plugins: [vue()],
    server: {
      port: port
    },
    preview: {
      port: port
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
