import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  env: {
    VITE_APP_TOKEN: 'valor_do_seu_token'
  }
})
