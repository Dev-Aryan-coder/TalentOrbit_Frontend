/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Instrument Serif', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'Instrument Serif', 'serif']
      },
      colors: {
        brand: {
          cyan: '#92dbe0',
          blue: '#0b7bff',
          indigo: '#3865cf',
          dark: '#050811'
        }
      }
    },
  },
  plugins: [],
}
