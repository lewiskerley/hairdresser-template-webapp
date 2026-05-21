/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'var(--color-accent)',
        'accent-muted': 'var(--color-accent-muted)',
        'site-bg': 'var(--color-bg)',
        'site-bg-card': 'var(--color-bg-card)',
        'site-bg-section': 'var(--color-bg-section)',
        'site-text': 'var(--color-text)',
        'site-text-sub': 'var(--color-text-sub)',
        'site-border': 'var(--color-border)',
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
