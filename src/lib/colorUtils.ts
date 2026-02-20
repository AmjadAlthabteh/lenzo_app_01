/**
 * Color utility functions for lighting operations
 * Provides conversions between RGB, HSL, HSV, and color temperature
 */

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

/**
 * Convert RGB to HSL color space
 * @param rgb RGB color object
 * @returns HSL color object
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const l = (max + min) / 2;

  if (diff === 0) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

  let h = 0;
  if (max === r) {
    h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    h = ((b - r) / diff + 2) / 6;
  } else {
    h = ((r - g) / diff + 4) / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB color space
 * @param hsl HSL color object
 * @returns RGB color object
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hueToRgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, h) * 255),
    b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  };
}

/**
 * Convert RGB to HSV color space
 * @param rgb RGB color object
 * @returns HSV color object
 */
export function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const v = max;

  if (diff === 0) {
    return { h: 0, s: 0, v: Math.round(v * 100) };
  }

  const s = max === 0 ? 0 : diff / max;

  let h = 0;
  if (max === r) {
    h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    h = ((b - r) / diff + 2) / 6;
  } else {
    h = ((r - g) / diff + 4) / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

/**
 * Convert HSV to RGB color space
 * @param hsv HSV color object
 * @returns RGB color object
 */
export function hsvToRgb(hsv: HSV): RGB {
  const h = hsv.h / 360;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0,
    g = 0,
    b = 0;

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Convert color temperature (Kelvin) to RGB
 * Based on Tanner Helland's algorithm
 * @param kelvin Color temperature in Kelvin (1000-40000)
 * @returns RGB color object
 */
export function kelvinToRgb(kelvin: number): RGB {
  const temp = Math.max(1000, Math.min(40000, kelvin)) / 100;

  let r, g, b;

  // Red
  if (temp <= 66) {
    r = 255;
  } else {
    r = temp - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    r = Math.max(0, Math.min(255, r));
  }

  // Green
  if (temp <= 66) {
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
  } else {
    g = temp - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);
  }
  g = Math.max(0, Math.min(255, g));

  // Blue
  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = temp - 10;
    b = 138.5177312231 * Math.log(b) - 305.0447927307;
    b = Math.max(0, Math.min(255, b));
  }

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

/**
 * Convert RGB to hex color string
 * @param rgb RGB color object
 * @returns Hex color string (e.g., "#ff5733")
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Convert hex color string to RGB
 * @param hex Hex color string (e.g., "#ff5733", "ff5733", or "#fff")
 * @returns RGB color object
 * @throws Error if hex string is invalid
 */
export function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");

  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(clean)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  // Handle short form (#fff -> #ffffff)
  const expanded = clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean;

  const r = parseInt(expanded.substring(0, 2), 16);
  const g = parseInt(expanded.substring(2, 4), 16);
  const b = parseInt(expanded.substring(4, 6), 16);
  return { r, g, b };
}

/**
 * Calculate brightness/luminance of an RGB color
 * Uses perceived brightness formula
 * @param rgb RGB color object
 * @returns Brightness value (0-255)
 */
export function calculateBrightness(rgb: RGB): number {
  return Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
}

/**
 * Check if a color is considered "light" (brightness > 128)
 * @param rgb RGB color object
 * @returns True if color is light
 */
export function isLightColor(rgb: RGB): boolean {
  return calculateBrightness(rgb) > 128;
}

/**
 * Calculate estimated power consumption for a light
 * @param maxWattage Maximum power consumption of the device in watts
 * @param brightnessPercent Current brightness level (0-100)
 * @param rgb Optional RGB color (affects power draw for RGB LEDs)
 * @returns Estimated power consumption in watts
 */
export function calculatePowerUsage(
  maxWattage: number,
  brightnessPercent: number,
  rgb?: RGB
): number {
  const brightnessRatio = Math.max(0, Math.min(100, brightnessPercent)) / 100;
  let powerUsage = maxWattage * brightnessRatio;

  // RGB LEDs typically use more power for bright colors
  if (rgb) {
    const brightness = calculateBrightness(rgb);
    const colorFactor = 1 + (brightness / 255) * 0.15; // Up to 15% more for bright colors
    powerUsage *= colorFactor;
  }

  return Math.round(powerUsage * 100) / 100;
}
