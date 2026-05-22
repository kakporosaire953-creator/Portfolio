// tailwind.config.js – custom color palette for Rosaire portfolio
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#050816",
        "accent-blue": "#00f0ff",
        "accent-orange": "#ff7a00",
        "glass": "rgba(255,255,255,0.08)",
      },
      backgroundImage: (theme) => ({
        "gradient-hero": "linear-gradient(90deg, #00f0ff, #ff7a00)",
      }),
    },
  },
  plugins: [],
};
