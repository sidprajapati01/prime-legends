/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      colors: {
        neonGold: '#FFD700',
        gold: '#D4AF37',
        neonBlue: '#00E5FF',
        neonCyan: '#00FFF0',
        orangeRed: '#FF4D2E',
        darkBg: '#0A0A0A',
        darkCard: '#111111',
        darkBorder: '#1F1F1F',
      },
      fontFamily: {
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.5)',
        'glow-blue': '0 0 20px rgba(0, 229, 255, 0.5)',
        'glow-red': '0 0 20px rgba(255, 77, 46, 0.5)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(255,215,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.05) 1px, transparent 1px)",
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(255,215,0,0.5)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 40px rgba(255,215,0,0.8)' },
        },
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100px' },
        },
      },
    },
  },
  plugins: [],
}