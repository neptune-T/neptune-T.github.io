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
        'peking-red': '#8A0000',
        'klein-blue': '#002FA7',
        'warm-canvas': '#F5F0E8',
        'warm-surface': '#FAF7F1',
        'warm-panel': '#EFE8DC',
        'warm-ink': '#242321',
        'warm-muted': '#6C675F',
        coral: '#CC785C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // ...
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
