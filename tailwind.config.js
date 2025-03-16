/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";
import { defaultColor, defaultTextColor } from "./src/helper/color";
const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    flowbite.content(),
  ],
  theme: {
    screens: {
      xs: { max: "475px" },
      sm: { max: "640px" },
      md: { max: "960px" },
      lg: { max: "1280px" },
      xl: { min: "1281px" },
    },
    extend: {
      colors: {
        textColor: defaultTextColor,
        ...defaultColor,
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        html: { fontSize: "18px" },
      });
    }),
    require("flowbite/plugin"),
    flowbite.plugin(),
  ],
};
