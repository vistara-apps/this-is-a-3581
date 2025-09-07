/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 20% 98%)',
        text: 'hsl(220 20% 10%)',
        accent: 'hsl(160 80% 50%)',
        border: 'hsl(220 20% 80%)',
        primary: 'hsl(220 80% 50%)',
        surface: 'hsl(0 0% 100%)',
        emergency: 'hsl(0 80% 50%)',
        warning: 'hsl(45 90% 50%)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 2px 10px hsla(0 0% 0% / 0.08)',
        'modal': '0 8px 32px hsla(0 0% 0% / 0.12)',
      },
      animation: {
        'pulse-red': 'pulse 2s infinite',
        'recording': 'pulse 1s infinite',
      },
    },
  },
  plugins: [],
}