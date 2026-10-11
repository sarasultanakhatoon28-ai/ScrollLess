/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        doodle: '0 6px 0 rgba(0,0,0,0.16), 0 0 0 3px rgba(0,0,0,0.05)',
        soft: '0 12px 30px rgba(24, 28, 39, 0.12)'
      }
    }
  },
  plugins: []
};
