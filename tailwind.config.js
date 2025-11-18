/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kairos-dark': '#1C132E',
        'kairos-purple': '#2A1E4C',
        'kairos-gold': '#E9C46A',
        'kairos-light': '#F8F5F1',
        'kairos-border': '#DAD0E7',
        'kairos-pink': '#EFD7DA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Crimson Pro', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom right, #DAD0E7, #F8F5F1, #2A1E4C)',
        'gradient-landing': 'linear-gradient(to bottom right, #DAD0E7, #EFD7DA, #2A1E4C)',
        'gradient-button': 'linear-gradient(to right, #E9C46A, #2A1E4C)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-medium': 'float-medium 6s ease-in-out infinite',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(-3deg)' },
        },
      },
    },
  },
  plugins: [],
}
