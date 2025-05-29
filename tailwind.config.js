/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFFDF0',
          100: '#FFFBE0',
          200: '#FFF7C2',
          300: '#FFF2A3',
          400: '#FFEA75',
          500: '#FFCC00', // Primary yellow
          600: '#E6B800',
          700: '#CC9900',
          800: '#A37A00',
          900: '#7A5C00',
        },
        secondary: {
          50: '#F8F8F8',
          100: '#F0F0F0',
          200: '#E6E6E6',
          300: '#D1D1D1',
          400: '#ADADAD',
          500: '#888888',
          600: '#636363',
          700: '#494949',
          800: '#2F2F2F',
          900: '#1A1A1A',
        },
        success: {
          500: '#10B981', // Green
          600: '#0EA579', // Darker shade of green for hover
        },
        warning: {
          500: '#F59E0B', // Orange
        },
        error: {
          500: '#EF4444', // Red
          600: '#DC2626', // Darker red for hover
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      },
    },
  },
  plugins: [],
}