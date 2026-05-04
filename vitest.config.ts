import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import ui from '@nuxt/ui/vite';
import tailwindcssVite from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    vue(),
    tailwindcssVite(),
    ui({
      theme: {
        colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error']
      },
      ui: {
        colors: {
          primary: 'blue',
          secondary: 'emerald',
          neutral: 'zinc'
        }
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/utils/vitest-setup.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    env: {
      VITE_API: 'http://127.0.0.1:3051/v1'
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
