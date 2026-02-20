/**
 * Application-wide constants and configuration values
 */

/**
 * Color temperature ranges (in Kelvin)
 */
export const COLOR_TEMP = {
  MIN: 2700,
  MAX: 6500,
  DEFAULT: 4000,
  WARM: 3000,
  NEUTRAL: 4000,
  COOL: 5500,
} as const;

/**
 * Brightness level constraints (0-100%)
 */
export const BRIGHTNESS = {
  MIN: 0,
  MAX: 100,
  DEFAULT: 80,
  DIM: 20,
  MEDIUM: 50,
  BRIGHT: 100,
} as const;

/**
 * Color value constraints
 */
export const COLOR = {
  HUE_MIN: 0,
  HUE_MAX: 360,
  SATURATION_MIN: 0,
  SATURATION_MAX: 100,
  VALUE_MIN: 0,
  VALUE_MAX: 100,
  RGB_MIN: 0,
  RGB_MAX: 255,
} as const;

/**
 * Command system constraints
 */
export const COMMAND = {
  MAX_LENGTH: 1000,
  MIN_LENGTH: 1,
  TIMEOUT_MS: 5000,
} as const;

/**
 * API configuration
 */
export const API = {
  TIMEOUT_MS: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

/**
 * Toast notification durations (in milliseconds)
 */
export const TOAST = {
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 5000,
  INFO_DURATION: 4000,
  WARNING_DURATION: 4500,
} as const;

/**
 * Device capability defaults
 */
export const DEVICE_DEFAULTS = {
  BRIGHTNESS: true,
  COLOR_TEMP: true,
  RGB: false,
  EFFECTS: false,
  MAX_BRIGHTNESS_LUMENS: 800,
  POWER_USAGE_WATTS: 10,
} as const;

/**
 * Scene presets with standardized configurations
 */
export const SCENE_PRESETS = {
  FOCUS: {
    name: 'Focus',
    description: 'High brightness, cool white for concentration',
    brightness: BRIGHTNESS.BRIGHT,
    colorTemp: COLOR_TEMP.COOL,
    icon: '🎯',
  },
  RELAX: {
    name: 'Relax',
    description: 'Warm, dim lighting for relaxation',
    brightness: BRIGHTNESS.DIM,
    colorTemp: COLOR_TEMP.WARM,
    icon: '🌅',
  },
  ENERGIZE: {
    name: 'Energize',
    description: 'Bright, cool light to boost energy',
    brightness: BRIGHTNESS.BRIGHT,
    colorTemp: COLOR_TEMP.COOL,
    icon: '⚡',
  },
  SLEEP: {
    name: 'Sleep',
    description: 'Very warm, minimal brightness for bedtime',
    brightness: 10,
    colorTemp: COLOR_TEMP.MIN,
    icon: '😴',
  },
  READING: {
    name: 'Reading',
    description: 'Comfortable brightness and neutral temperature',
    brightness: BRIGHTNESS.MEDIUM,
    colorTemp: COLOR_TEMP.NEUTRAL,
    icon: '📚',
  },
  MOVIE: {
    name: 'Movie',
    description: 'Dim ambient lighting for watching content',
    brightness: BRIGHTNESS.DIM,
    colorTemp: COLOR_TEMP.WARM,
    icon: '🎬',
  },
} as const;

/**
 * Energy optimization thresholds
 */
export const ENERGY = {
  MAX_POWER_USAGE_WATTS: 100,
  AUTO_OFF_DELAY_MINUTES: 30,
  DIM_ON_BATTERY_PERCENT: 50,
} as const;

/**
 * Circadian rhythm defaults
 */
export const CIRCADIAN = {
  MIN_KELVIN: COLOR_TEMP.WARM,
  MAX_KELVIN: COLOR_TEMP.COOL,
  MIN_BRIGHTNESS: BRIGHTNESS.DIM,
  MAX_BRIGHTNESS: BRIGHTNESS.BRIGHT,
  DEFAULT_WAKE_TIME: '07:00',
  DEFAULT_SLEEP_TIME: '22:00',
} as const;

/**
 * Animation and transition defaults
 */
export const ANIMATION = {
  TRANSITION_DURATION_MS: 300,
  FADE_DURATION_MS: 500,
  SCENE_TRANSITION_MS: 1000,
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  COMMAND_HISTORY: 'luxin-cmd-history',
  THEME_PREFERENCE: 'luxin-theme',
  AURORA_ENABLED: 'luxin-aurora-enabled',
  USER_PREFERENCES: 'luxin-preferences',
  DEVICE_CACHE: 'luxin-device-cache',
} as const;

/**
 * Event names for custom events
 */
export const EVENTS = {
  TOAST_SHOW: 'luxin-toast',
  LIGHT_SET: 'luxin-light-set',
  LUX_SET: 'lux-set',
  CONSOLE_OPEN: 'luxin-console-open',
  CONSOLE_CLOSE: 'luxin-console-close',
  SCENE_ACTIVATED: 'luxin-scene-activated',
  DEVICE_UPDATED: 'luxin-device-updated',
} as const;

/**
 * Validation patterns
 */
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  HEX_COLOR: /^#[0-9A-Fa-f]{6}$/,
  TIME_24H: /^([01]\d|2[0-3]):([0-5]\d)$/,
} as const;
