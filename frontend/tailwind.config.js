/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ryokan-green': '#2C4A3E',
        'ryokan-red': '#A0522D',
        'ryokan-gold': '#C9A84C',
        'ryokan-bg': '#FAF8F5',
        'ryokan-text': '#2D2012',
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', 'serif'],
        sans: ['"Noto Sans JP"', 'sans-serif'],
        latin: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}

