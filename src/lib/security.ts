/**
 * Security utilities for input sanitization and protection
 */

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potentially dangerous HTML tags and scripts
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*>/gi, '')
    .replace(/<link\b[^<]*>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '');

  return sanitized.trim();
}

/**
 * Sanitizes HTML to allow only safe tags
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  // Allow only safe tags
  const allowedTags = ['b', 'i', 'em', 'strong', 'u', 'p', 'br', 'span'];
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

  return html.replace(tagRegex, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      return match;
    }
    return '';
  });
}

/**
 * Escapes HTML special characters
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Sanitizes email to prevent email header injection
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  // Remove newlines, carriage returns, and null bytes that could be used for header injection
  return email
    .replace(/[\r\n\0]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Sanitizes command input to prevent command injection
 */
export function sanitizeCommand(command: string): string {
  if (typeof command !== 'string') {
    return '';
  }

  // Remove potentially dangerous characters for command injection
  // Allow only alphanumeric, spaces, and safe punctuation
  const sanitized = command.replace(/[;&|`$(){}[\]<>]/g, '');

  return sanitized.trim();
}

/**
 * Validates and sanitizes URL
 */
export function sanitizeUrl(url: string): string | null {
  if (typeof url !== 'string') {
    return null;
  }

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Generates a random token for CSRF protection
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates CORS origin
 */
export function validateOrigin(origin: string, allowedOrigins: string[]): boolean {
  if (!origin || typeof origin !== 'string') {
    return false;
  }

  return allowedOrigins.includes(origin) || allowedOrigins.includes('*');
}

/**
 * Rate limiter for preventing abuse
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Checks if a request should be allowed
   */
  check(identifier: string): boolean {
    const now = Date.now();
    const requestTimes = this.requests.get(identifier) || [];

    // Remove old requests outside the time window
    const validRequests = requestTimes.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false; // Rate limit exceeded
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  /**
   * Gets remaining requests for an identifier
   */
  getRemaining(identifier: string): number {
    const now = Date.now();
    const requestTimes = this.requests.get(identifier) || [];
    const validRequests = requestTimes.filter((time) => now - time < this.windowMs);

    return Math.max(0, this.maxRequests - validRequests.length);
  }

  /**
   * Resets rate limit for an identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Clears all rate limit data
   */
  clear(): void {
    this.requests.clear();
  }
}

/**
 * Content Security Policy header generator
 */
export function generateCspHeader(options: {
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  connectSrc?: string[];
  fontSrc?: string[];
}): string {
  const {
    scriptSrc = ["'self'", "'unsafe-inline'"],
    styleSrc = ["'self'", "'unsafe-inline'"],
    imgSrc = ["'self'", 'data:', 'https:'],
    connectSrc = ["'self'"],
    fontSrc = ["'self'", 'data:'],
  } = options;

  const directives = [
    `default-src 'self'`,
    `script-src ${scriptSrc.join(' ')}`,
    `style-src ${styleSrc.join(' ')}`,
    `img-src ${imgSrc.join(' ')}`,
    `connect-src ${connectSrc.join(' ')}`,
    `font-src ${fontSrc.join(' ')}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ];

  return directives.join('; ');
}

/**
 * Validates file upload security
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSizeMb?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSizeMb = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'] } = options;

  // Check file size
  const maxSizeBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMb}MB limit`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  // Check file name for suspicious content
  if (/[;<>&|`$]/.test(file.name)) {
    return {
      valid: false,
      error: 'File name contains invalid characters',
    };
  }

  return { valid: true };
}

/**
 * Hashes sensitive data (for logging or storage)
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
