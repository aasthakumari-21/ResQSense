/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceLight: '#E2E8F0',
        primary: '#3B82F6',
        primaryGlow: 'rgba(59, 130, 246, 0.5)',
        danger: '#EF4444',
        dangerGlow: 'rgba(239, 68, 68, 0.5)',
        warning: '#F59E0B',
        success: '#10B981',
        text: '#0F172A',
        textMuted: '#64748B'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
