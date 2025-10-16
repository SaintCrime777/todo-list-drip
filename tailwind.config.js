/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite/**/*.{js,jsx,ts,tsx}",        // 👈 加這行
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",  // 👈 這行讓 flowbite-react 樣式可生效
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
