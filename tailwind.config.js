/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'ultrawide': '1920px',
      },
      colors: {
        primary: '#3B82F6',
        'primary-light': '#e0e7ff',
        'primary-dark': '#1e40af',
        'gray-light': '#f9f9f9',
        'gray-border': '#eee',
        'text-muted': '#999',
        'text-secondary': '#666',
        'error-light': '#fef2f2',
        'error-border': '#fecaca',
        'error-text': '#991b1b',
        'success-light': '#f0fdf4',
        'success-border': '#86efac',
        'success-text': '#166534',
        'success-green': '#22c55e',
        'error-red': '#ef4444',
        'status-blue': '#3b82f6',
      },
      spacing: {
        'clamp-sm': 'clamp(12px, 3vw, 20px)',
        'clamp-md': 'clamp(15px, 5vw, 30px)',
        'clamp-lg': 'clamp(25px, 5vw, 40px)',
      },
      fontSize: {
        'clamp-xs': 'clamp(0.65rem, 2vw, 0.8rem)',
        'clamp-sm': 'clamp(0.75rem, 2vw, 0.85rem)',
        'clamp-base': 'clamp(0.8rem, 2vw, 0.9rem)',
        'clamp-lg': 'clamp(0.95rem, 3vw, 1.1rem)',
        'clamp-xl': 'clamp(1.1rem, 4vw, 1.3rem)',
        'clamp-2xl': 'clamp(1.4rem, 5vw, 2rem)',
      },
    },
  },
  plugins: [],
};
