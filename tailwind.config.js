/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";
import { genBgHoverActiveColor } from "./src/helper/color";
const flowbite = require("flowbite-react/tailwind");

const generateColors = () => {
  const defaultColor = {
    primary: {
      50: "#eafeff",
      100: "#cafcff",
      200: "#9cf7ff",
      300: "#57eeff",
      400: "#0cdbff",
      500: "#00beea",
      600: "#0096c4",
      DEFAULT: "#007095", // base
      800: "#0b5f7f",
      900: "#0e4f6b",
    },
    secondary: {
      50: "#f8fafa",
      100: "#f1f5f6",
      200: "#e6ecee",
      300: "#d1dde1",
      400: "#b6c6cf",
      DEFAULT: "#9aaebb", // base
      600: "#8096a7",
      700: "#6d8294",
      800: "#5b6c7c",
      900: "#4c5a66",
    },
    accent: {
      50: "#ebfeff",
      100: "#cefcff",
      200: "#a2f7ff",
      300: "#63eefd",
      400: "#1cdbf4",
      DEFAULT: "#00b9d4", // base
      600: "#0397b7",
      700: "#0a7994",
      800: "#126178",
      900: "#145065",
    },
    error: {
      50: "#fff1f1",
      100: "#ffe1e1",
      200: "#ffc7c7",
      300: "#ffa0a0",
      DEFAULT: "#ff5252", // base
      500: "#f83b3b",
      600: "#e51d1d",
      700: "#c11414",
      800: "#a01414",
      900: "#841818",
    },
    success: {
      50: "#f3faf3",
      100: "#e3f5e3",
      200: "#c8eac9",
      300: "#9dd89f",
      400: "#6bbd6e",
      DEFAULT: "#4caf50", // base
      600: "#358438",
      700: "#2d6830",
      800: "#275429",
      900: "#224525",
    },
    warning: {
      50: "#ffffea",
      100: "#fffbc5",
      200: "#fff885",
      300: "#ffee46",
      400: "#ffdf1b",
      DEFAULT: "#ffc107", // base
      600: "#e29400",
      700: "#bb6902",
      800: "#985108",
      900: "#7c420b",
    },
  };

  const color = {
    textColor: "#374955",
    ...defaultColor,
  };

  for (let key in defaultColor) {
    if (typeof defaultColor[key] === "object") {
      const getHoverActiveColor = genBgHoverActiveColor(
        defaultColor[key]["DEFAULT"]
      );
      color[`${key}Hover`] = getHoverActiveColor.hoverColor;
      color[`${key}Active`] = getHoverActiveColor.activeColor;
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
