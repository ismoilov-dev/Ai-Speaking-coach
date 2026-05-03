/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'body': ['"DM Sans"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f7f5f2',
          100: '#ede9e3',
          200: '#d9d0c4',
          300: '#c4b49f',
          400: '#a8927a',
          500: '#8d7460',
          600: '#745e4d',
          700: '#5c4a3d',
          800: '#3d3129',
          900: '#201a15',
          950: '#120e0b',
        },
        sage: {
          400: '#7fa688',
          500: '#5d8f6b',
          600: '#467554',
        },
        amber: {
          400: '#f5b942',
          500: '#e8a020',
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.4s ease-out forwards',
        'ripple': 'ripple 1.5s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
