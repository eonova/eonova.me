/* eslint-disable ts/no-require-imports */
import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
import plugin from 'tailwindcss/plugin'

export default {
  darkMode: 'class',
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/pliny/**/*.js',
    './src/layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'nav-link-indicator': 'radial-gradient(44.6% 825% at 50% 50%, rgb(255 133 133) 0%, rgb(255 72 109 / 0) 100%)',
        'nav-link-indicator-dark': 'radial-gradient(44.6% 825% at 50% 50%, rgb(255 28 28) 0%, rgb(255 72 109 / 0) 100%)',
        'email-button': 'linear-gradient(180deg, rgb(210 10 30) 5%, rgb(239 90 90) 100%)',
      },
      boxShadow: {
        'feature-card': '0 -1px 3px 0 rgb(0 0 0 / 0.05)',
        'feature-card-dark': '0 0 0 1px rgb(255 255 255 / 0.06), 0 -1px rgb(255 255 255 / 0.1)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderColor: {
        'primary-500': '#003366', // 自定义颜色值
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'tree-view-content-down': 'tree-view-content-down 0.2s ease-out',
        'tree-view-content-up': 'tree-view-content-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'marquee-left': 'marquee-left var(--duration, 30s) linear infinite',
        'marquee-up': 'marquee-up var(--duration, 30s) linear infinite',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            'a': {
              'color': theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              'code': { color: theme('colors.primary.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            'h3': {
              fontWeight: '600',
            },
            'code': {
              color: theme('colors.indigo.500'),
            },
          },
        },
        invert: {
          css: {
            'a': {
              'color': theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')}`,
              },
              'code': { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },

  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    ({ addBase, theme }) => {
      addBase({
        'a, button': {
          'outlineColor': theme('colors.primary.500'),
          '&:focus-visible': {
            outline: '2px solid',
            borderRadius: theme('borderRadius.DEFAULT'),
            outlineColor: theme('colors.primary.500'),
          },
        },
      })
    },
    animate,
    plugin((api) => {
      api.addBase({
        ':root': {
          '--background': '0 0% 100%',
          '--foreground': '0 0% 3.9%',

          '--card': '0 0% 99.7%',
          '--card-foreground': '0 0% 3.9%',

          '--popover': '0 0% 100%',
          '--popover-foreground': '0 0% 15.1%',

          '--primary': '0 0% 9%',
          '--primary-foreground': '0 0% 98%',

          '--secondary': '0 0% 96.1%',
          '--secondary-foreground': '0 0% 9%',

          '--muted': '0 0% 96.1%',
          '--muted-foreground': '0 0% 45.1%',

          '--accent': '0 0% 94.1%',
          '--accent-foreground': '0 0% 9%',

          '--destructive': '0 84.2% 60.2%',
          '--destructive-foreground': '0 0% 98%',

          '--border': '0 0% 89.8%',
          '--input': '0 0% 89.8%',
          '--ring': '0 0% 63.9%',

          '--radius': '0.5rem',

          '--sidebar-background': '0 0% 98%',
          '--sidebar-foreground': '240 5.3% 26.1%',
          '--sidebar-primary': '240 5.9% 10%',
          '--sidebar-primary-foreground': '0 0% 98%',
          '--sidebar-accent': '240 4.8% 95.9%',
          '--sidebar-accent-foreground': '240 5.9% 10%',
          '--sidebar-border': '220 13% 91%',
          '--sidebar-ring': '217.2 91.2% 59.8%',
        },
        '.dark': {
          '--background': '0 0% 2%',
          '--foreground': '0 0% 100%',

          '--card': '0 0% 4%',
          '--card-foreground': '0 0% 98%',

          '--popover': '0 0% 4%',
          '--popover-foreground': '0 0% 88%',

          '--primary': '0 0% 98%',
          '--primary-foreground': '0 0% 9%',

          '--secondary': '0 0% 12.9%',
          '--secondary-foreground': '0 0% 98%',

          '--muted': '0 0% 12%',
          '--muted-foreground': '0 0% 60%',

          '--accent': '0 0% 15%',
          '--accent-foreground': '0 0% 100%',

          '--destructive': '6 84% 48%',
          '--destructive-foreground': '0 0% 98%',

          '--border': '0 0% 14%',
          '--input': '0 0% 14%',
          '--ring': '0 0% 14.9%',

          '--sidebar-background': '240 5.9% 10%',
          '--sidebar-foreground': '240 4.8% 95.9%',
          '--sidebar-primary': '224.3 76.3% 48%',
          '--sidebar-primary-foreground': '0 0% 100%',
          '--sidebar-accent': '240 3.7% 15.9%',
          '--sidebar-accent-foreground': '240 4.8% 95.9%',
          '--sidebar-border': '240 3.7% 15.9%',
          '--sidebar-ring': '217.2 91.2% 59.8%',
        },
        'html': {
          'scroll-behavior': 'smooth',
        },
        'body': {
          'background-color': 'theme(\'colors.background\')',
          'color': 'theme(\'colors.foreground\')',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
      })
    }),
  ],
} satisfies Config
