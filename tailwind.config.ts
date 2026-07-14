import type { Config } from 'tailwindcss';

// ---------------------------------------------------------------------------
// DESIGN TOKENS — "Modern Minimalist / Executive"
// Palette is a cool paper-and-ink base with a single restrained signal-blue
// accent (a nod to Omar's networking background — routing tables, status
// lights — used sparingly, never decoratively).
// ---------------------------------------------------------------------------
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF8',    // page background
        surface: '#F1F0EC',  // cards, alternating sections
        line: '#E2E0D9',     // hairline borders/dividers
        ink: '#14161C',      // primary text
        muted: '#63666F',    // secondary text
        accent: {
          DEFAULT: '#2F5CFF', // signal blue — CTAs, focus, active state
          soft: '#EAF0FF',    // accent tint for chips/backgrounds
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // A deliberate, slightly asymmetric type scale rather than a
        // default 1.25 modular ramp.
        'display-xl': ['clamp(3rem, 6vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(3rem, 7vw, 6.5rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.75rem, 2.6vw, 2.5rem)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
      },
      maxWidth: {
        content: '72rem',
        prose: '38rem',
      },
      transitionTimingFunction: {
        exec: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.15' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        blink: 'blink 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
