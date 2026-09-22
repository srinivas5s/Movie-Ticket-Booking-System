/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#050507',
          DEFAULT: '#09090B',
          900: '#09090B',
          850: '#0E0E12',
          800: '#121215',
          750: '#151519',
          700: '#18181B',
          600: '#27272A',
          500: '#3F3F46',
        },
        metallic: {
          border: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.22)',
          muted: '#A1A1AA',
          light: '#D4D4D8',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glow-subtle': '0 0 15px -3px rgba(255, 255, 255, 0.08)',
        'glow-white': '0 0 20px 2px rgba(255, 255, 255, 0.25)',
        'glow-seat': '0 0 12px 1px rgba(255, 255, 255, 0.4)',
        'inner-dark': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)',
      },
      borderColor: {
        metallic: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
};
