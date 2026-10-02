/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Vibrant Delivery Orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        navy: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#95bfe0',
          400: '#5f9ed1',
          500: '#3980bf',
          600: '#2766a3',
          700: '#215284',
          800: '#1b446c',
          900: '#0f1f38',
          950: '#0a1424', // Deep SRM Navy
        },
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 31, 56, 0.08), 0 2px 6px -1px rgba(15, 31, 56, 0.04)',
        'card-hover': '0 20px 30px -4px rgba(15, 31, 56, 0.12), 0 8px 10px -2px rgba(15, 31, 56, 0.04)',
        'elevated': '0 25px 50px -12px rgba(15, 31, 56, 0.2)',
      },
    },
  },
  plugins: [],
};
