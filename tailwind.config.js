/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      animation: {
        blink: 'blink 0.8s step-start infinite',
        flare: 'flare 0.6s ease-out forwards',
      },
      keyframes: {
        blink: {
          '50%': { opacity: 0 },
        },
        flare: {
          '0%': { opacity: 0, transform: 'scale(0.5)' },
          '50%': { opacity: 0.6, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}