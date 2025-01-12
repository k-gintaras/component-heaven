/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/demo/src/**/*.{html,ts}", // Demo project
    "./projects/shared-components/src/**/*.{html,ts}", // Shared components
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
