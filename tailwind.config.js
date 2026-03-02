/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6C3FC5",
        secondary: "#3B82F6",
        accent: "#F59E0B",
        surface: "#F8F9FA",
        dark: "#1E1E2E",
      },
    },
  },
  plugins: [],
};
