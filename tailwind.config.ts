import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ink': {
          50: '#f7f6f4',
          100: '#eae8e3',
          200: '#d5d1c8',
          300: '#b9b3a5',
          400: '#9a9182',
          500: '#7f7668',
          600: '#6a6258',
          700: '#58514a',
          800: '#4a453f',
          900: '#403c37',
          950: '#221f1c',
        },
        'paper': {
          50: '#fdfcfa',
          100: '#f9f6f1',
          200: '#f3ede3',
          300: '#e8dece',
          400: '#d9c9ae',
          500: '#c9b491',
          600: '#b89d75',
          700: '#a08560',
          800: '#836c51',
          900: '#6b5944',
          950: '#392e22',
        },
        'accent': {
          50: '#fdf4f3',
          100: '#fce8e6',
          200: '#f9d4d1',
          300: '#f4b4ad',
          400: '#ec897d',
          500: '#e05f51',
          600: '#cc4536',
          700: '#ab3829',
          800: '#8d3126',
          900: '#762f26',
          950: '#40140f',
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Source Sans 3', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config

