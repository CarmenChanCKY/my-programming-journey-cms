import { hexRegex } from "./validator";
import { rounding } from "./common";

// default color list
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
  s = rounding(s * 100);
  l = rounding(l * 100);

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
    updateLValue += 10;
  } else if (isActive) {
    updateLValue -= 8;
  }

  let opacity = a;
  if (opacity > 1) {
    opacity = opacity / 100;
  }

  return `hsl(${h}deg ${s}% ${updateLValue}% / ${opacity})`;
};

const genBgHoverActiveColor = (
  hexString: string,
  hoverOpacity: number = 0.1,
  activeOpacity: number = 0.2
) => {
  const returnProps = {
    bgColor: "",
    hoverColor: "",
    activeColor: "",
  };

  const hslColor = hexToHsl(hexString);
  returnProps.bgColor = hslCSS(hslColor.h, hslColor.s, hslColor.l);

  returnProps.hoverColor = hslCSS(
    hslColor.h,
    hslColor.s,
    hslColor.l,
    hoverOpacity,
    true
  );

  returnProps.activeColor = hslCSS(
    hslColor.h,
    hslColor.s,
    hslColor.l,
    activeOpacity,
    false,
    true
  );

  return returnProps;
};

export { genBgHoverActiveColor, defaultColor, defaultTextColor };
