/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#38B6FF",
        "secondary": "#1E3E89",
        // Color palette: Deep Clear Ocean
        "first": "#407C87",
        "second": "#A5DBDD",
        "third": "#EEF1F6",
        "fourth": "#D3E1E2"
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
