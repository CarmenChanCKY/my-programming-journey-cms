/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";
import {
  genBgHoverActiveColor,
  defaultColor,
  defaultTextColor,
} from "./src/helper/color";
const flowbite = require("flowbite-react/tailwind");

const generateColors = () => {
  const color = {
    textColor: defaultTextColor,
    ...defaultColor,
  };

  for (let key in defaultColor) {
    if (typeof defaultColor[key] === "object") {
      const getHoverActiveColor = genBgHoverActiveColor(
        defaultColor[key]["DEFAULT"],
        1,
        1
      );

      color[`${key}Hover`] = getHoverActiveColor.hoverColor;
      color[`${key}Active`] = getHoverActiveColor.activeColor;

      const getOpacityHoverActiveColor = genBgHoverActiveColor(
        defaultColor[key]["DEFAULT"]
      );
      color[`${key}OpacityHover`] = getOpacityHoverActiveColor.hoverColor;
      color[`${key}OpacityActive`] = getOpacityHoverActiveColor.activeColor;
    }
  }

  return color;
};

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
      colors: generateColors(),
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
