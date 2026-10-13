/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cardio: {
          maroon: '#830000',
          crimson: '#BC0202',
          red: '#FF0000',
          dark: '#0D0202',
          surface: '#1A0505',
          card: '#220606',
          lightBg: '#FFF8F8',
          lightSurface: '#FAF2F2',
          lightBlush: '#F5E6E6',
        },
        risk: {
          low: '#059669',
          lowLight: '#10B981',
          moderate: '#D97706',
          moderateLight: '#F59E0B',
          high: '#BC0202',
          highLight: '#FF0000',
          reduce: '#0D9488',
        }
      },
      boxShadow: {
        'neu-light': '6px 6px 14px rgba(131, 0, 0, 0.08), -6px -6px 14px #ffffff',
        'neu-light-pressed': 'inset 3px 3px 6px rgba(131, 0, 0, 0.1), inset -3px -3px 6px #ffffff',
        'neu-dark': '6px 6px 16px rgba(0, 0, 0, 0.7), -4px -4px 12px rgba(131, 0, 0, 0.25)',
        'neu-dark-pressed': 'inset 3px 3px 6px rgba(0, 0, 0, 0.8), inset -2px -2px 5px rgba(131, 0, 0, 0.3)',
        'liquid-glow': '0 0 35px rgba(188, 2, 2, 0.35)',
        'liquid-glow-lg': '0 0 60px rgba(255, 0, 0, 0.45)',
      },
      animation: {
        'lub-dub': 'lubDub 1.2s ease-in-out infinite',
        'ecg-dash': 'ecgDash 2s linear infinite',
        'draw-heart': 'drawHeart 2.5s ease-out forwards',
        'blob-float': 'blobFloat 12s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        lubDub: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.08)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(1)' },
        },
        ecgDash: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        drawHeart: {
          '0%': { strokeDashoffset: '1500', fillOpacity: '0' },
          '70%': { strokeDashoffset: '0', fillOpacity: '0.1' },
          '100%': { strokeDashoffset: '0', fillOpacity: '0.25' },
        },
        blobFloat: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(25px, -20px) scale(1.08)' },
          '100%': { transform: 'translate(-20px, 15px) scale(0.95)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
