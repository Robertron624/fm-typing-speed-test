import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${path.resolve(process.cwd(), 'src/styles/variables.scss')}" as *;`
      }
    }
  }
})
