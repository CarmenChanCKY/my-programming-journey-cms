import { hexRegex } from "./validator";
import { rounding } from "./common";

// default color list
const defaultColor = {
  primary: {
    50: "#f5f7fa",
    100: "#eaeef4",
    200: "#cfd9e8",
    300: "#a6bbd3",
    400: "#7595bb",
    500: "#5479a3",
    600: "#3d5a80", // base
    700: "#354d6f",
    800: "#2f435d",
    900: "#2b3a4f",
  },
  secondary: {
    50: "#f4f8fb",
    100: "#e8eff6",
    200: "#cbdfec",
    300: "#98c1d9", // base
    400: "#6aa6c6",
    500: "#478bb0",
    600: "#357094",
    700: "#2c5978",
    800: "#284c64",
    900: "#254155",
  },
  accent: {
    50: "#fdf5ef",
    100: "#fbe8d9",
    200: "#f7d4bc", // base
    300: "#f0ac81",
    400: "#e8804f",
    500: "#e35f2c",
    600: "#d44822",
    700: "#b0351e",
    800: "#8d2d1f",
    900: "#72271c",
  },
  error: {
    50: "#fff1f1",
    100: "#ffe1e1",
    200: "#ffc7c7",
    300: "#ffa0a0",
    400: "#ff5252", // base
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
    500: "#4caf50", // base
    600: "#358438",
    700: "#2d6830",
    800: "#275429",
    900: "#224525",
  },
};

// default text color
const defaultTextColor = "#374955";

// translate hex to hsl
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
};

// translate hex to rgb
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  let r = 0;
  let g = 0;
  let b = 0;

  if (new RegExp(hexRegex).test(hex)) {
    hex = hex.replace("#", "");

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
  }

  return { r, g, b };
};

// translate rgb to hsl
const rgbToHsl = (
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } => {
  // https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4#%E5%BE%9ERGB%E5%88%B0HSL%E6%88%96HSV%E7%9A%84%E8%BD%89%E6%8F%9B
  // https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/#rgb-to-hsl

  // convert the value of r, g, b to 0-1
  const largestRGB = 255;
  r /= largestRGB;
  g /= largestRGB;
  b /= largestRGB;

  const maxRGB = Math.max(r, g, b);
  const minRGB = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  let l = (maxRGB + minRGB) / 2;

  if (l > 0 && l <= 0.5) {
    s = (maxRGB - minRGB) / (maxRGB + minRGB);
  } else if (l > 0.5) {
    s = (maxRGB - minRGB) / (2 - (maxRGB + minRGB));
  }

  if (maxRGB === r) {
    h = 60 * ((g - b) / (maxRGB - minRGB));
    if (g < b) {
      h += 360;
    }
  } else if (maxRGB === g) {
    h = 60 * ((b - r) / (maxRGB - minRGB)) + 120;
  } else if (maxRGB === b) {
    h = 60 * ((r - g) / (maxRGB - minRGB)) + 240;
  }

  h = rounding(h);
  s = rounding(s * 100, 1);
  l = rounding(l * 100, 1);

  return { h, s, l };
};

const hslCSS = (
  h: number,
  s: number,
  l: number,
  a: number = 1,
  isHover: boolean = false,
  isActive: boolean = false
): string => {
  let updateLValue = l;
  if (isHover) {
    updateLValue -= 10;
  } else if (isActive) {
    updateLValue -= 8;
  }

  let opacity = a;
  if (opacity > 1) {
    opacity = opacity / 100;
  }

  return `hsl(${h}deg ${s}% ${updateLValue}% / ${opacity})`;
};

const colorList: Array<string> = [
  "primary",
  "secondary",
  "accent",
  "success",
  "error",
  "gray",
];

const getNormalButtonColorTheme = (
  outline: boolean = false,
  plain: boolean = false
): { [key: string]: string } => {
  const resultColorList: { [key: string]: string } = {};

  const commonTheme = "border border-transparent";
  const plainTheme = "enabled:hover:bg-opacity-10 enabled:active:bg-opacity-20";

  for (let i = 0; i < colorList.length; i++) {
    const color = colorList[i];
    let theme = "";

    if (outline) {
      // in flowbite-react, if the button is set to outline, it will combine both normal and outline style
      // set the normal style to empty
    } else if (plain) {
      // flowbite-react does not provide plain text button
      // create the plain text style by replacing normal style
      theme = plainTheme;
      switch (color) {
        case "secondary":
          theme = `${theme} text-secondary-400 enabled:hover:bg-secondary-400 enabled:active:bg-secondary-500`;
          break;
        case "accent":
          theme = `${theme} text-accent-300 enabled:hover:bg-accent-300 enabled:active:bg-accent-400`;
          break;
        case "error":
          theme = `${theme} text-error-400 enabled:hover:bg-error-400 enabled:active:bg-error-500`;
          break;
        case "success":
          theme = `${theme} text-success-400 enabled:hover:bg-success-400 enabled:active:bg-success-500`;
          break;
        case "gray":
          theme = `${theme} text-gray-400 enabled:hover:bg-gray-400 enabled:active:bg-success-500`;
          break;
        default:
          // default: primary
          theme = `${theme} text-primary-500 enabled:hover:bg-primary-600 enabled:active:bg-primary-600`;
          break;
      }
    } else {
      theme = commonTheme;
      switch (color) {
        case "secondary":
          theme = `${theme} bg-secondary-500 text-white enabled:hover:bg-secondary-600 enabled:active:bg-secondary-700`;
          break;
        case "accent":
          theme = `${theme} bg-accent-300 text-white enabled:hover:bg-accent-400 enabled:active:bg-accent-500`;
          break;
        case "error":
          theme = `${theme} bg-error-400 text-white enabled:hover:bg-error-500 enabled:active:bg-error-600`;
          break;
        case "success":
          theme = `${theme} bg-success-400 text-white enabled:hover:bg-success-500 enabled:active:bg-success-600`;
          break;
        case "gray":
          theme = `${theme} bg-gray-400 text-white enabled:hover:bg-gray-500 enabled:active:bg-gray-600`;
          break;
        default:
          // default: primary
          theme = `${theme} bg-primary-500 text-white enabled:hover:bg-primary-600 enabled:active:bg-primary-700`;
          break;
      }
    }

    resultColorList[color] = theme;
  }

  return resultColorList;
};

const getOutlineButtonColorTheme = (): { [key: string]: string } => {
  const resultColorList: { [key: string]: string } = {};

  const commonTheme =
    "border enabled:hover:bg-opacity-10 enabled:active:bg-opacity-20";

  for (let i = 0; i < colorList.length; i++) {
    const color = colorList[i];

    let theme = commonTheme;
    switch (color) {
      case "secondary":
        theme = `${theme} border-secondary-400 text-secondary-400 enabled:hover:bg-secondary-400`;
        break;
      case "accent":
        theme = `${theme} border-accent-300 text-accent-300 enabled:hover:bg-accent-300`;
        break;
      case "error":
        theme = `${theme} border-error-300 text-error-300 enabled:hover:bg-error-300`;
        break;
      case "success":
        theme = `${theme} border-success-400 text-success-400 enabled:hover:bg-success-400`;
        break;
      case "gray":
        theme = `${theme} border-gray-400 text-gray-400 enabled:hover:bg-gray-400`;
        break;
      default:
        // default: primary
        theme = `${theme} border-primary-600 text-primary-600 enabled:hover:bg-primary-600`;
        break;
    }

    resultColorList[color] = theme;
  }

  return resultColorList;
};

export {
  defaultColor,
  defaultTextColor,
  getNormalButtonColorTheme,
  getOutlineButtonColorTheme,
};
