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
        brand: {
          bg: '#070A12',
          'bg-secondary': '#0D111C',
          card: '#111827',
          'card-elevated': '#151D2E',
          primary: '#7C3AED',
          secondary: '#06B6D4',
          text: '#F8FAFC',
          'text-secondary': '#94A3B8',
          'text-muted': '#64748B',
          border: '#1E293B',
          input: '#0B1220',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};