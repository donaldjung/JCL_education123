/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mainframe: {
          darker: '#050508',
          dark: '#0a0a0f',
          terminal: '#0d1117',
          amber: '#ffb000',
          green: '#00ff88',
        },
        accent: {
          cyan: '#00d4ff',
          orange: '#ff6b35',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px rgba(255, 176, 0, 0.5)' },
          '100%': { textShadow: '0 0 20px rgba(255, 176, 0, 0.8), 0 0 30px rgba(255, 176, 0, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
