/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        accent: 'var(--accent)',
        textMain: 'var(--textMain)',
        textMuted: 'var(--textMuted)',
        cardBg: 'var(--card-bg)',
        cardBorder: 'var(--card-border)',
        footerText: 'var(--footer-text)',
        navbarBg: 'var(--navbar-bg)',
        inputBg: 'var(--input-bg)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
