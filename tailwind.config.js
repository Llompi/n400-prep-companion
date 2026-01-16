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
        serif: ['DM Serif Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Semantic color system for consistent, purposeful design
        primary: {
          DEFAULT: '#2563EB', // blue-600: Primary actions, active states
          hover: '#1D4ED8',   // blue-700: Hover states
          light: '#EFF6FF',   // blue-50: Backgrounds, subtle highlights
          dark: '#1E40AF',    // blue-800: Dark mode primary
        },
        neutral: {
          900: '#0F172A', // slate-900: Main headings (highest contrast)
          700: '#334155', // slate-700: Body text (high contrast)
          500: '#64748B', // slate-500: Secondary text (medium contrast, accessible)
          200: '#E2E8F0', // slate-200: Borders
          100: '#F1F5F9', // slate-100: Page backgrounds
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
}
