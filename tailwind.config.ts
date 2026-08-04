import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist Sans"', ...defaultTheme.fontFamily.sans],
        mono: ['"Geist Mono"', ...defaultTheme.fontFamily.mono]
      },
      colors: {
        background: {
          base: 'var(--background-base)',
          surface: 'var(--background-surface)',
          hover: 'var(--background-surface-hover)'
        },
        foreground: {
          primary: 'var(--foreground-primary)',
          muted: 'var(--foreground-muted)',
          inverse: 'var(--foreground-inverse)'
        },
        border: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)'
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          foreground: 'var(--color-primary-foreground)'
        },
        success: {
          DEFAULT: 'var(--color-success)',
          bg: 'var(--color-success-bg)',
          border: 'var(--color-success-border)'
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          bg: 'var(--color-warning-bg)',
          border: 'var(--color-warning-border)'
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          bg: 'var(--color-danger-bg)',
          border: 'var(--color-danger-border)'
        }
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        dialog: 'var(--shadow-dialog)'
      },
      opacity: {
        disabled: 'var(--opacity-disabled)'
      },
      transitionDuration: {
        '180': '180ms',
        '220': '220ms',
        '300': '300ms',
        '400': '400ms'
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'fade-out': 'fadeOut 0.2s ease-out forwards',
        'zoom-in': 'zoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in': 'slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
} satisfies Config
