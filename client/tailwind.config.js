/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Our primary color - Aztec palette
        aztec: {
          50: '#f5f8f6',
          100: '#ddeae2',
          200: '#bbd4c6',
          300: '#92b6a4',
          400: '#6b9681',
          500: '#517b68',
          600: '#3f6252',
          700: '#355044',
          800: '#2d4238',
          900: '#293832',
          950: '#17241f',
        },
        // Keep primary as an alias to aztec for backward compatibility
        primary: {
          50: '#f5f8f6',
          100: '#ddeae2',
          200: '#bbd4c6',
          300: '#92b6a4',
          400: '#6b9681',
          500: '#517b68',
          600: '#3f6252',
          700: '#355044',
          800: '#2d4238',
          900: '#293832',
          950: '#17241f',
        },
        // Accent colors that work well with our primary
        accent: {
          // A warm cream/sand color
          sand: {
            50: '#fdf8f0',
            100: '#f9ecda',
            200: '#f1d4a8',
            300: '#e8bb76',
            400: '#e0a244',
            500: '#d89932',
            600: '#be7c1a',
            700: '#986215',
            800: '#724911',
            900: '#4c300b',
          },
          // A muted blue-gray
          slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          }
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
