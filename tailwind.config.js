/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/assets/**/*",
    "./src/styles/**/*",
    "./src/utils/**/*",
    "./src/services/**/*",
    "./src/constants/**/*",
    "./src/scripts/**/*"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};