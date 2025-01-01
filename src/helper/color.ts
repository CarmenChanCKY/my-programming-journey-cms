import { hexRegex } from "./validator";
import { rounding } from "./common";

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

export { genBgHoverActiveColor };
