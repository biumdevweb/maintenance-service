import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Colori basati su psychology research per B2B italiano
      colors: {
        // Primary Navy Blue - Autorità e fiducia
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#4a6fa5',
          700: '#1E3A8A', // Navy Blue principale
          800: '#1a365d',
          900: '#153e75',
          950: '#0f172a'
        },
        // Secondary Sky Blue - Innovazione tecnologia
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49'
        },
        // Accent Action Orange - CTA urgency
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#EA580C', // Action Orange principale
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407'
        },
        // Neutral Premium Gray - Professionalità
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151', // Premium Gray principale
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        },
        // Success colors per trust signals
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        }
      },
      
      // Typography basata su research B2B
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        body: ['Lato', ...fontFamily.sans],
        mono: ['Roboto Mono', ...fontFamily.mono]
      },
      
      // Font sizes ottimizzati per leggibilità B2B
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        // Hero sizes specifici
        'hero': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-sm': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }]
      },
      
      // Spacing ottimizzato per mobile-first
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem'
      },
      
      // Animation durations basate su UX research
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '450': '450ms'
      },
      
      // Border radius per design system B2B
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      
      // Box shadows per professional appearance
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)',
        'cta': '0 4px 14px 0 rgba(234, 88, 12, 0.3)',
        'cta-hover': '0 8px 25px 0 rgba(234, 88, 12, 0.4)'
      },
      
      // Gradient basati su palette colors
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #1E3A8A 0%, #1a365d 100%)',
        'gradient-sky': 'linear-gradient(135deg, #00A8E8 0%, #0284c7 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1E3A8A 0%, #00A8E8 100%)',
        'gradient-cta': 'linear-gradient(135deg, #EA580C 0%, #f97316 100%)'
      },
      
      // Aspect ratios per immagini professionali
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/1': '2 / 1',
        '16/9': '16 / 9'
      },
      
      // Container queries per responsive design
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      }
    }
  },
  plugins: [
    // Plugin per typography optimization
    require('@tailwindcss/typography'),
    // Plugin per forms styling
    require('@tailwindcss/forms'),
    // Plugin per aspect ratio
    require('@tailwindcss/aspect-ratio'),
    // Plugin per container queries
    require('@tailwindcss/container-queries')
  ]
}