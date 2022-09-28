module.exports = {
  mode: 'jit',
  // important: true,
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './client/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      animation: {
        enter: 'enter 200ms ease-out',
        'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
        leave: 'leave 150ms ease-in forwards',
      },
      keyframes: {
        enter: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        leave: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0.9)', opacity: 0 },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        lite: {
          primary: '#2453FF',
          secondary: '#F6D860',
          accent: '#37CDBE',
          neutral: '#001135',
          error: '#df1b41',
          'neutral-content': '#FFFFFF',
          'primary-content': '#FFFFFF',
          'base-100': '#FFFFFF',
          'base-200': '#E7F0F8',
          'base-300': '#F5F5F5',
          'base-content': '#445579',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
