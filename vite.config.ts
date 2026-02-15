import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ui from '@nuxt/ui/vite';
import path from 'path';
import tailwindcssVite from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcssVite(),
    ui({
      ui: {
        colors: {
          primary: 'violet',
          secondary: 'blue',
          neutral: 'gray'
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
            size: 'md'
          }
        },
        button: {
          slots: {
            base: 'cursor-pointer !ring-gray-200 !border-gray-200'
          },
          variants: {
            size: {
              md: {
                base: 'font-normal',
                leadingIcon: 'size-4'
              }
            }
          },
          defaultVariants: {
            size: 'md'
          }
        },
        textarea: {
          defaultVariants: {
            size: 'lg'
          }
        },
        table: {
          defaultVariants: {
            size: 'lg'
          }
        },
        select: {
          base: ['!ring-gray-200 !border-gray-200'],
          defaultVariants: {
            size: 'md',
            selectedIcon: ''
          },
          slots: {
            overlay: 'z-[100]',
            content: 'z-[100]',
            item: [
              'data-[state=checked]:!bg-violet-50 dark:data-[state=checked]:!bg-violet-950/50 data-[state=checked]:!text-black data-[state=checked]:!font-semibold dark:data-[state=checked]:!text-violet-400'
            ],
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
          }
        },
        modal: {
          slots: {
            header: 'min-h-10',
            body: 'pt-0 sm:pt-0',
            title: 'text-lg p-0',
            overlay: 'z-[30] bg-black/50 dark:bg-black/80',
            content: 'z-[30] bg-default flex flex-col focus:outline-none divide-none !ring-0'
          }
        },
        slideover: {
          slots: { overlay: 'z-[100]', content: 'z-[100]' }
        },
        card: {
          defaultVariants: {
            size: 'lg'
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
