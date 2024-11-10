/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '320px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      colors: {
        teal: '#007E7E',
        darkGrey: '#3A3A3A',
        white: '#FFFFFF',
      },
      fontFamily: {
        Raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
