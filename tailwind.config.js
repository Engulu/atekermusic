/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#1a1f2c',
          900: '#0f1219',
        }
      }
    },
  },
  plugins: [],
};
