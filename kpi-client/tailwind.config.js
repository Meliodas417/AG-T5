/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
      },
      colors: {
        bittersweet: '#ff5a5f',
        night: '#0a100d',
        snow: '#fcf7f8',
        'celtic-blue': '#226ce0',
      },
      backgroundColor: {
        primary: '#fcf7f8',
        secondary: '#226ce0',
        accent: '#ff5a5f',
        dark: '#0a100d',
      },
      textColor: {
        primary: '#0a100d',
        secondary: '#226ce0',
        accent: '#ff5a5f',
        light: '#fcf7f8',
      },
    },
  },
  plugins: [],
}
