/**
 * Validation utilities for user inputs and data integrity
 */

import {
  COLOR_TEMP,
  BRIGHTNESS,
  COLOR,
  COMMAND,
  PATTERNS,
} from './constants';

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates email address format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return { isValid: false, error: 'Email cannot be empty' };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  if (!PATTERNS.EMAIL.test(trimmedEmail)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}

/**
 * Validates brightness value (0-100)
 */
export function validateBrightness(brightness: number): ValidationResult {
  if (typeof brightness !== 'number' || isNaN(brightness)) {
    return { isValid: false, error: 'Brightness must be a number' };
  }

  if (brightness < BRIGHTNESS.MIN || brightness > BRIGHTNESS.MAX) {
    return {
      isValid: false,
      error: `Brightness must be between ${BRIGHTNESS.MIN} and ${BRIGHTNESS.MAX}`,
    };
  }

  return { isValid: true };
}

/**
 * Validates color temperature in Kelvin
 */
export function validateColorTemp(kelvin: number): ValidationResult {
  if (typeof kelvin !== 'number' || isNaN(kelvin)) {
    return { isValid: false, error: 'Color temperature must be a number' };
  }

  if (kelvin < COLOR_TEMP.MIN || kelvin > COLOR_TEMP.MAX) {
    return {
      isValid: false,
      error: `Color temperature must be between ${COLOR_TEMP.MIN}K and ${COLOR_TEMP.MAX}K`,
    };
  }

  return { isValid: true };
}

/**
 * Validates hue value (0-360)
 */
export function validateHue(hue: number): ValidationResult {
  if (typeof hue !== 'number' || isNaN(hue)) {
    return { isValid: false, error: 'Hue must be a number' };
  }

  if (hue < COLOR.HUE_MIN || hue > COLOR.HUE_MAX) {
    return {
      isValid: false,
      error: `Hue must be between ${COLOR.HUE_MIN} and ${COLOR.HUE_MAX}`,
    };
  }

  return { isValid: true };
}

/**
 * Validates saturation value (0-100)
 */
export function validateSaturation(saturation: number): ValidationResult {
  if (typeof saturation !== 'number' || isNaN(saturation)) {
    return { isValid: false, error: 'Saturation must be a number' };
  }

  if (saturation < COLOR.SATURATION_MIN || saturation > COLOR.SATURATION_MAX) {
    return {
      isValid: false,
      error: `Saturation must be between ${COLOR.SATURATION_MIN} and ${COLOR.SATURATION_MAX}`,
    };
  }

  return { isValid: true };
}

/**
 * Validates RGB color component (0-255)
 */
export function validateRGB(value: number): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: 'RGB value must be a number' };
  }

  if (!Number.isInteger(value)) {
    return { isValid: false, error: 'RGB value must be an integer' };
  }

  if (value < COLOR.RGB_MIN || value > COLOR.RGB_MAX) {
    return {
      isValid: false,
      error: `RGB value must be between ${COLOR.RGB_MIN} and ${COLOR.RGB_MAX}`,
    };
  }

  return { isValid: true };
}

/**
 * Validates hex color format
 */
export function validateHexColor(hex: string): ValidationResult {
  if (!hex || typeof hex !== 'string') {
    return { isValid: false, error: 'Hex color is required' };
  }

  if (!PATTERNS.HEX_COLOR.test(hex)) {
    return {
      isValid: false,
      error: 'Invalid hex color format (expected #RRGGBB)',
    };
  }

  return { isValid: true };
}

/**
 * Validates command string length
 */
export function validateCommand(command: string): ValidationResult {
  if (!command || typeof command !== 'string') {
    return { isValid: false, error: 'Command is required' };
  }

  const trimmedCommand = command.trim();

  if (trimmedCommand.length < COMMAND.MIN_LENGTH) {
    return { isValid: false, error: 'Command cannot be empty' };
  }

  if (trimmedCommand.length > COMMAND.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Command is too long (max ${COMMAND.MAX_LENGTH} characters)`,
    };
  }

  return { isValid: true };
}

/**
 * Validates time format (HH:MM in 24-hour format)
 */
export function validateTime(time: string): ValidationResult {
  if (!time || typeof time !== 'string') {
    return { isValid: false, error: 'Time is required' };
  }

  if (!PATTERNS.TIME_24H.test(time)) {
    return {
      isValid: false,
      error: 'Invalid time format (expected HH:MM in 24-hour format)',
    };
  }

  return { isValid: true };
}

/**
 * Validates device ID format
 */
export function validateDeviceId(deviceId: string): ValidationResult {
  if (!deviceId || typeof deviceId !== 'string') {
    return { isValid: false, error: 'Device ID is required' };
  }

  const trimmedId = deviceId.trim();

  if (trimmedId.length === 0) {
    return { isValid: false, error: 'Device ID cannot be empty' };
  }

  if (trimmedId.length > 100) {
    return { isValid: false, error: 'Device ID is too long' };
  }

  // Allow alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedId)) {
    return {
      isValid: false,
      error: 'Device ID can only contain letters, numbers, hyphens, and underscores',
    };
  }

  return { isValid: true };
}

/**
 * Validates percentage value (0-100)
 */
export function validatePercentage(value: number): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: 'Percentage must be a number' };
  }

  if (value < 0 || value > 100) {
    return { isValid: false, error: 'Percentage must be between 0 and 100' };
  }

  return { isValid: true };
}

/**
 * Validates power usage in watts
 */
export function validatePowerUsage(watts: number): ValidationResult {
  if (typeof watts !== 'number' || isNaN(watts)) {
    return { isValid: false, error: 'Power usage must be a number' };
  }

  if (watts < 0) {
    return { isValid: false, error: 'Power usage cannot be negative' };
  }

  if (watts > 10000) {
    return { isValid: false, error: 'Power usage value is unrealistic' };
  }

  return { isValid: true };
}

/**
 * Helper function to throw if validation fails
 */
export function assertValid(result: ValidationResult): void {
  if (!result.isValid) {
    throw new Error(result.error || 'Validation failed');
  }
}
