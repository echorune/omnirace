/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tropic: {
          abyss: '#030B12',
          deep: '#061522',
          surface: '#0A2030',
          elevated: '#0F2C42',
          glass: 'rgba(10, 32, 48, 0.72)',
          border: 'rgba(0, 245, 212, 0.15)',
          borderHighlight: 'rgba(0, 245, 212, 0.35)',
          cyan: '#00F5D4',
          cyanGlow: '#00F5D4',
          aqua: '#00BBF9',
          coral: '#FF5E7E',
          hibiscus: '#FF70A6',
          sunset: '#FF9966',
          sand: '#FFD166',
          emerald: '#10B981',
          orchid: '#8338EC',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 245, 212, 0.3)',
        'glow-coral': '0 0 20px -3px rgba(255, 94, 126, 0.35)',
        'glow-sand': '0 0 20px -3px rgba(255, 209, 102, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 10, 20, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'wave-flow': 'wave 8s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
