import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Quiet editorial palette — warm paper, ink, one coral accent
        paper: '#F6F4EE',
        ink: '#23211C',
        muted: '#6F695C',
        faint: '#9C947F',
        line: 'rgba(35, 33, 28, 0.10)',
        dpaper: '#161310',
        dink: '#EAE2D4',
        dmuted: '#A79B8B',
        dfaint: '#7D7466',
        dline: 'rgba(243, 232, 220, 0.10)',
        coral: '#CC785C',
        // Legacy tokens kept for backward compatibility
        'peking-red': '#8A0000',
        'klein-blue': '#002FA7',
        'warm-canvas': '#F5F0E8',
        'warm-surface': '#FAF7F1',
        'warm-panel': '#EFE8DC',
        'warm-ink': '#242321',
        'warm-muted': '#6C675F',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"IBM Plex Serif"', '"Noto Serif SC"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
