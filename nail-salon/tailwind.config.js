/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FFFFF0',
        gold: '#D4AF37',
        blush: '#FFB6C1',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'], // Or Garamond if preferred
      },
    },
  },
  plugins: [],
}