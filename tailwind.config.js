/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0A0B0F',
          raised: '#14161C',
          panel: '#191C24',
          border: '#262A35',
          hair: '#1E212A'
        },
        ink: {
          DEFAULT: '#EDEEF2',
          muted: '#9198A8',
          faint: '#5B6172'
        },
        ember: {
          50: '#FFF4E6',
          200: '#FFCB86',
          400: '#F5A94E',
          500: '#E2913F',
          600: '#C97627',
          glow: '#FFB65C'
        },
        steel: {
          400: '#7FA4F5',
          500: '#5B8DEF',
          600: '#4370D6'
        },
        signal: {
          success: '#3DD68C',
          danger: '#F0555A',
          warn: '#F0B94A'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace']
      },
      boxShadow: {
        ember: '0 0 0 1px rgba(226,145,63,0.35), 0 8px 24px -8px rgba(226,145,63,0.35)',
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 40px -24px rgba(0,0,0,0.6)'
      },
      backgroundImage: {
        'forge-radial': 'radial-gradient(120% 120% at 15% -10%, rgba(226,145,63,0.14) 0%, rgba(10,11,15,0) 55%)',
        'ember-line': 'linear-gradient(90deg, transparent, rgba(226,145,63,0.6), transparent)'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 1 }
        },
        rise: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 1.8s ease-in-out infinite',
        rise: 'rise 0.35s ease-out both'
      }
    }
  },
  plugins: []
};
