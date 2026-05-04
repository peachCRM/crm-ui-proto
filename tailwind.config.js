/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  variants: {
    extend: {
      textColor: ['placeholder']
    }
  },
  plugins: [
    (await import('@tailwindcss/forms')).default,
    (await import('@tailwindcss/typography')).default
  ]
};
