/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        showroom: {
          bg: '#FAF9F5',
          card: '#FFFFFF',
          ivory: '#F4F1EA',
          sand: '#ECE7DE',
          sandDark: '#DCD4C5',
          border: '#E3DDD3',
          borderDark: '#CCC4B4',
          charcoal: '#171615',
          charcoalLight: '#302E2B',
          muted: '#736F68',
          bronze: '#9E6B38',
          bronzeHover: '#855627',
          terracotta: '#A85A42',
          olive: '#636653',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        architectural: '0.18em',
        widest: '0.25em',
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(0, 0, 0, 0.04)',
        card: '0 10px 30px rgba(25, 24, 23, 0.06)',
        lift: '0 20px 40px rgba(25, 24, 23, 0.12)',
        glow: '0 0 30px rgba(158, 107, 56, 0.15)',
      },
      aspectRatio: {
        '4/5': '4 / 5',
        '3/4': '3 / 4',
        '16/10': '16 / 10',
      },
      borderRadius: {
        none: '0px',
        sm: '5px',
        DEFAULT: '5px',
        md: '5px',
        lg: '5px',
        xl: '5px',
        '2xl': '5px',
        '3xl': '5px',
        '5px': '5px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
