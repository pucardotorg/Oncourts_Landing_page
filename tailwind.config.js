/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        teal: "#007E7E",
        darkGrey: "#3A3A3A",
        white: "#FFFFFF",
        footerBg: "#3A3A3A",
        tealBg: "#007E7E1A",
        tealShadow: "oklch(77.7% 0.152 181.912)",
        peach: "#FFEDD5",
        darkBrown: "#9A3412",
        pistachio: " #DCFCE7",
        darkGreen: "#166534",
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
        noto: ["Noto Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        libre: ['"Libre Baskerville"', 'serif'],
      },
    },
  },
  plugins: [],
};
