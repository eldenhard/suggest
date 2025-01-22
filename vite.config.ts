import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/suggest_habr/',
  plugins: [vue()],
  // resolve: {
  //   alias: [{ find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) }],
  // },
})
