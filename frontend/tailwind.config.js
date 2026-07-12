/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#F8FAFC', mist: '#EEF3F8', line: '#E2E8F0',
        ink: '#0F172A', body: '#475569', muted: '#64748B',
        steel: { DEFAULT: '#1E70B0', dark: '#175D94', light: '#4EA8DE' },
      },
      fontFamily: {
        head: ['"Outfit Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
    },
  },
}