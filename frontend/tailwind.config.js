/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 5px theme(colors.blue.400), 0 0 10px theme(colors.blue.400), 0 0 15px theme(colors.blue.400)' },
          'to': { boxShadow: '0 0 10px theme(colors.blue.400), 0 0 20px theme(colors.blue.400), 0 0 30px theme(colors.blue.400)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        glass: {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
        }
      }
    },
  },
  plugins: [],
}