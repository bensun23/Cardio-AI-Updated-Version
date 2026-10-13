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
        base: {
          light: '#E8EEF7',
          dark: '#0F1424',
          cardLight: '#F0F5FD',
          cardDark: '#141B30',
          surfaceLight: '#DEE7F4',
          surfaceDark: '#0A0E1A',
        },
        primary: {
          DEFAULT: '#4F7CFF',
          hover: '#3D6CF0',
          light: '#7298FF',
          dark: '#3058D6',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C4BE8',
          light: '#A78BFA',
        },
        risk: {
          high: '#FF5D8F',
          highLight: '#FF7A9F',
          moderate: '#F5B83D',
          moderateLight: '#FBC968',
          low: '#22C7A9',
          lowLight: '#4DE0C5',
          reduce: '#4F7CFF',
        },
        text: {
          mainLight: '#162038',
          mutedLight: '#506280',
          mainDark: '#F1F5F9',
          mutedDark: '#8899B5',
        }
      },
      boxShadow: {
        // Light mode neumorphic shadows derived from #E8EEF7
        'neu-light': '7px 7px 16px rgba(80, 110, 160, 0.22), -7px -7px 16px #ffffff',
        'neu-light-sm': '4px 4px 10px rgba(80, 110, 160, 0.18), -4px -4px 10px #ffffff',
        'neu-light-pressed': 'inset 3px 3px 6px rgba(80, 110, 160, 0.25), inset -3px -3px 6px #ffffff',
        // Dark mode neumorphic shadows derived from #0F1424
        'neu-dark': '7px 7px 18px rgba(3, 5, 12, 0.85), -4px -4px 14px rgba(40, 52, 90, 0.35)',
        'neu-dark-sm': '4px 4px 10px rgba(3, 5, 12, 0.8), -3px -3px 8px rgba(40, 52, 90, 0.28)',
        'neu-dark-pressed': 'inset 3px 3px 6px rgba(3, 5, 12, 0.9), inset -2px -2px 6px rgba(40, 52, 90, 0.3)',
        // Glow accents
        'glow-primary': '0 0 30px rgba(79, 124, 255, 0.35)',
        'glow-secondary': '0 0 30px rgba(139, 92, 246, 0.35)',
        'glow-high': '0 0 35px rgba(255, 93, 143, 0.45)',
        'glow-mod': '0 0 35px rgba(245, 184, 61, 0.45)',
        'glow-low': '0 0 35px rgba(34, 199, 169, 0.45)',
      },
      animation: {
        'lub-dub': 'lubDub 1.25s cubic-bezier(0.25, 1, 0.5, 1) infinite',
        'ecg-dash': 'ecgDash 2s linear infinite',
        'blob-float': 'blobFloat 14s ease-in-out infinite alternate',
        'orbit-1': 'orbit 6s linear infinite',
        'orbit-2': 'orbit 10s linear infinite reverse',
        'orbit-3': 'orbit 14s linear infinite',
        'ripple': 'ripple 1.25s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'shine': 'shine 3s ease-in-out infinite',
      },
      keyframes: {
        lubDub: {
          '0%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.06)' },
          '28%': { transform: 'scale(1.02)' },
          '42%': { transform: 'scale(1.05)' },
          '65%, 100%': { transform: 'scale(1)' },
        },
        ecgDash: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        blobFloat: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -25px) scale(1.1)' },
          '100%': { transform: 'translate(-25px, 20px) scale(0.92)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.85)', opacity: '0.8' },
          '50%': { transform: 'scale(1.4)', opacity: '0.2' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '20%, 100%': { transform: 'translateX(200%)' },
        }
      }
    },
  },
  plugins: [],
}
