import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ui from '@nuxt/ui/vite';
import path from 'path';
import tailwindcssVite from '@tailwindcss/vite';
import inject from '@rollup/plugin-inject';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    vue(),
    inject({
      'window.Quill': ['@rafaeljunioxavier/vue-quill-fix', 'Quill'],
      Quill: ['@rafaeljunioxavier/vue-quill-fix', 'Quill']
    }),
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
        },
        notifications: {
          position: 'top-right'
        },
        formField: {
          slots: {
            label: 'text-md text-gray-500'
          }
        },
        input: {
          slots: {
            root: 'w-full'
          },
          defaultVariants: {
            size: 'lg'
          }
        },
        button: {
          slots: {
            base: 'cursor-pointer'
          },
          defaultVariants: {
            size: 'lg'
          }
        },
        textarea: {
          defaultVariants: {
            size: 'lg'
          }
        },
        table: {
          slots: {
            th: 'whitespace-nowrap'
          },
          defaultVariants: {
            size: 'lg'
          }
        },
        select: {
          slots: {
            content: 'z-[100]'
          },
          defaultVariants: {
            size: 'lg'
          }
        },
        modal: {
          slots: {
            header: 'min-h-10',
            body: 'pt-0 sm:pt-0',
            title: 'text-lg p-0',
            overlay: 'z-[30] bg-black/60',
            content: 'z-[30] bg-default flex flex-col focus:outline-none divide-none !ring-0'
          }
        },
        slideover: {
          slots: { overlay: 'z-[70]', content: 'z-[70]' }
        },
        card: {
          defaultVariants: {
            size: 'lg'
          }
        },
        badge: {
          defaultVariants: {
            size: 'md'
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
