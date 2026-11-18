/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        pink: {
          light: 'var(--pink)',
          DEFAULT: 'var(--pink)',
          deep: 'var(--pink-deep)',
        },
        lavender: {
          light: 'var(--lavender)',
          DEFAULT: 'var(--lavender)',
          deep: 'var(--lavender-deep)',
        },
        mint: 'var(--mint)',
        butter: 'var(--butter)',
        danger: 'var(--danger)',
        focus: 'var(--focus)',
      },
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        body: ['Quicksand', 'Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'panel': '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'booth': '0 8px 24px rgba(240, 98, 154, 0.18)',
        'booth-hover': '0 12px 32px rgba(240, 98, 154, 0.28)',
        'subtle': '0 2px 8px rgba(59, 42, 53, 0.06)',
      },
      animation: {
        'flash': 'flash 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        flash: {
          '0%': { opacity: '0' },
          '40%': { opacity: '0.95' },
          '100%': { opacity: '0' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(240, 98, 154, 0.6)' },
          '70%': { boxShadow: '0 0 0 14px rgba(240, 98, 154, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(240, 98, 154, 0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
