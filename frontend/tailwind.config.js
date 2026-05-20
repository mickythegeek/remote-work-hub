/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-base': '#F8F9FA',
        'bg-surface': '#F8F9FA',
        'bg-nav': '#F8F9FA',

        // Brand
        navy: '#2c6fa6',
        'navy-light': '#1A3C5E',
        'accent-blue': '#1B4FD8',

        // Text
        'text-primary': '#0D1117',
        'text-secondary': '#4B5563',
        'text-muted': '#9CA3AF',
        'text-on-navy': '#FFFFFF',

        // Semantic
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',

        // Chips / borders
        'chip-bg': '#E5E7EB',
        'chip-text': '#374151',
        'chip-tag': '#27AE60',
        'border-subtle': '#E5E7EB',
        'border-strong': '#D1D5DB',
      },

      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },

      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        full: '9999px',
      },

      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
        nav: '0 1px 0 #E5E7EB',
      },

      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '32px',
        xl: '64px',
      },

      maxWidth: {
        container: '1200px',
      },

      gap: {
        grid: '24px',
      },
    },
  },

  corePlugins: {
    preflight: false,
  },
  plugins: [],
};