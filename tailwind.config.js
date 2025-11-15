/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#EC4899',
        accent: '#06B6D4',
        green: '#10B981',
        purple: '#7C3AED',
        pink: '#EC4899',
        blue: '#3B82F6',
        orange: '#F59E0B',
        red: '#EF4444',
      },
      fontFamily: {
        primary: ['Poppins', 'sans-serif'],
        secondary: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


