/**
 * Centralized error handling and logging system
 */

/**
 * Error categories for classification
 */
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  DEVICE = 'DEVICE',
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSION = 'PERMISSION',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Structured error information
 */
export interface ErrorInfo {
  category: ErrorCategory;
  message: string;
  userMessage: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  stack?: string;
  originalError?: Error;
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Error logging configuration
 */
interface ErrorLogEntry {
  severity: ErrorSeverity;
  category: ErrorCategory;
  message: string;
  userMessage: string;
  timestamp: string;
  context?: Record<string, unknown>;
  stack?: string;
}

/**
 * Error handler class
 */
export class ErrorHandler {
  private static logs: ErrorLogEntry[] = [];
  private static maxLogs = 100;

  /**
   * Categorizes an error based on its characteristics
   */
  static categorize(error: Error | unknown): ErrorCategory {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('validation') || message.includes('invalid')) {
        return ErrorCategory.VALIDATION;
      }
      if (
        message.includes('network') ||
        message.includes('fetch') ||
        message.includes('connection')
      ) {
        return ErrorCategory.NETWORK;
      }
      if (message.includes('timeout')) {
        return ErrorCategory.TIMEOUT;
      }
      if (message.includes('device') || message.includes('hardware')) {
        return ErrorCategory.DEVICE;
      }
      if (
        message.includes('auth') ||
        message.includes('unauthorized') ||
        message.includes('login')
      ) {
        return ErrorCategory.AUTHENTICATION;
      }
      if (message.includes('permission') || message.includes('forbidden')) {
        return ErrorCategory.PERMISSION;
      }
    }

    return ErrorCategory.UNKNOWN;
  }

  /**
   * Converts technical error to user-friendly message
   */
  static getUserMessage(category: ErrorCategory, error: Error | unknown): string {
    const errorMessage = error instanceof Error ? error.message : String(error);

    switch (category) {
      case ErrorCategory.VALIDATION:
        return errorMessage; // Validation messages are already user-friendly
      case ErrorCategory.NETWORK:
        return 'Unable to connect to the server. Please check your internet connection.';
      case ErrorCategory.TIMEOUT:
        return 'The request took too long. Please try again.';
      case ErrorCategory.DEVICE:
        return 'Device communication error. Please check device connection.';
      case ErrorCategory.AUTHENTICATION:
        return 'Authentication failed. Please log in again.';
      case ErrorCategory.PERMISSION:
        return "You don't have permission to perform this action.";
      case ErrorCategory.UNKNOWN:
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Determines error severity
   */
  static getSeverity(category: ErrorCategory): ErrorSeverity {
    switch (category) {
      case ErrorCategory.VALIDATION:
        return ErrorSeverity.LOW;
      case ErrorCategory.NETWORK:
      case ErrorCategory.TIMEOUT:
        return ErrorSeverity.MEDIUM;
      case ErrorCategory.DEVICE:
      case ErrorCategory.PERMISSION:
        return ErrorSeverity.MEDIUM;
      case ErrorCategory.AUTHENTICATION:
        return ErrorSeverity.HIGH;
      case ErrorCategory.UNKNOWN:
      default:
        return ErrorSeverity.MEDIUM;
    }
  }

  /**
   * Handles and logs an error
   */
  static handle(
    error: Error | unknown,
    context?: Record<string, unknown>
  ): ErrorInfo {
    const category = this.categorize(error);
    const message = error instanceof Error ? error.message : String(error);
    const userMessage = this.getUserMessage(category, error);
    const severity = this.getSeverity(category);
    const stack = error instanceof Error ? error.stack : undefined;

    const errorInfo: ErrorInfo = {
      category,
      message,
      userMessage,
      timestamp: new Date(),
      context,
      stack,
      originalError: error instanceof Error ? error : undefined,
    };

    // Log to console
    this.logToConsole(severity, errorInfo);

    // Store in memory (limited size)
    this.addToLog(severity, errorInfo);

    return errorInfo;
  }

  /**
   * Logs error to console with appropriate level
   */
  private static logToConsole(severity: ErrorSeverity, errorInfo: ErrorInfo): void {
    const logMessage = `[${severity}] [${errorInfo.category}] ${errorInfo.message}`;

    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        console.error(logMessage, {
          userMessage: errorInfo.userMessage,
          context: errorInfo.context,
          stack: errorInfo.stack,
        });
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(logMessage, {
          userMessage: errorInfo.userMessage,
          context: errorInfo.context,
        });
        break;
      case ErrorSeverity.LOW:
      default:
        console.log(logMessage, {
          userMessage: errorInfo.userMessage,
          context: errorInfo.context,
        });
        break;
    }
  }

  /**
   * Adds error to in-memory log
   */
  private static addToLog(severity: ErrorSeverity, errorInfo: ErrorInfo): void {
    const logEntry: ErrorLogEntry = {
      severity,
      category: errorInfo.category,
      message: errorInfo.message,
      userMessage: errorInfo.userMessage,
      timestamp: errorInfo.timestamp.toISOString(),
      context: errorInfo.context,
      stack: errorInfo.stack,
    };

    this.logs.unshift(logEntry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  /**
   * Retrieves recent error logs
   */
  static getLogs(limit?: number): ErrorLogEntry[] {
    return limit ? this.logs.slice(0, limit) : [...this.logs];
  }

  /**
   * Clears all error logs
   */
  static clearLogs(): void {
    this.logs = [];
  }

  /**
   * Gets error statistics
   */
  static getStats(): {
    total: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
  } {
    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    this.logs.forEach((log) => {
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;
      bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;
    });

    return {
      total: this.logs.length,
      byCategory,
      bySeverity,
    };
  }
}

/**
 * Retry helper for failed operations
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        break;
      }

      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Increase delay for next attempt (with max limit)
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError!;
}

/**
 * Helper to create error recovery suggestions
 */
export function getRecoverySuggestions(category: ErrorCategory): string[] {
  switch (category) {
    case ErrorCategory.NETWORK:
      return [
        'Check your internet connection',
        'Try refreshing the page',
        'Verify the server is accessible',
      ];
    case ErrorCategory.TIMEOUT:
      return [
        'Try again with a simpler request',
        'Check your network speed',
        'Wait a moment and retry',
      ];
    case ErrorCategory.DEVICE:
      return [
        'Check device power and connection',
        'Restart the device',
        'Verify device is in range',
      ];
    case ErrorCategory.VALIDATION:
      return [
        'Check your input values',
        'Review the format requirements',
        'Ensure all required fields are filled',
      ];
    case ErrorCategory.AUTHENTICATION:
      return ['Log out and log back in', 'Clear your browser cache', 'Reset your password'];
    case ErrorCategory.PERMISSION:
      return [
        'Contact your administrator',
        'Verify your account permissions',
        'Request access to this feature',
      ];
    default:
      return ['Try again later', 'Contact support if the problem persists'];
  }
}
