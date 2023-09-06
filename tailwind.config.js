/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        main: "Cascadia Code Regular",
      },
    },
  },
  plugins: [require('prettier-plugin-tailwindcss')]
}