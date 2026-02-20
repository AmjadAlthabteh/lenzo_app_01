/**
 * API client service layer with typed requests and error handling
 */

import { API } from './constants';
import { ErrorHandler, retryWithBackoff } from './errorHandler';
import { validateEmail, validateCommand } from './validators';

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Scene data structure
 */
export interface SceneData {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  brightness?: number;
  colorTemp?: number;
  rgb?: { r: number; g: number; b: number };
}

/**
 * Request access response
 */
export interface RequestAccessResponse {
  message: string;
  success: boolean;
}

/**
 * Command response
 */
export interface CommandResponse {
  result?: string;
  error?: string;
  success: boolean;
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime?: number;
  version?: string;
}

/**
 * Fetch options with timeout
 */
interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * API Client class
 */
export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl = '', timeout = API.TIMEOUT_MS) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
  }

  /**
   * Enhanced fetch with timeout support
   */
  private async fetchWithTimeout(
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout exceeded');
      }

      throw error;
    }
  }

  /**
   * Generic request handler with error handling and retry logic
   */
  private async request<T>(
    url: string,
    options: FetchOptions = {},
    retry = true
  ): Promise<ApiResponse<T>> {
    const executeRequest = async (): Promise<Response> => {
      return this.fetchWithTimeout(`${this.baseUrl}${url}`, options);
    };

    try {
      const response = retry
        ? await retryWithBackoff(executeRequest, {
            maxRetries: API.RETRY_ATTEMPTS,
            initialDelay: API.RETRY_DELAY_MS,
          })
        : await executeRequest();

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      const errorInfo = ErrorHandler.handle(error, { url, method: options.method });

      return {
        success: false,
        error: errorInfo.userMessage,
        statusCode: 0,
      };
    }
  }

  /**
   * GET request
   */
  private async get<T>(url: string, retry = true): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET' }, retry);
  }

  /**
   * POST request
   */
  private async post<T>(
    url: string,
    body: unknown,
    retry = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
      retry
    );
  }

  /**
   * Fetch all scenes
   */
  async getScenes(): Promise<ApiResponse<SceneData[]>> {
    return this.get<SceneData[]>('/api/scenes');
  }

  /**
   * Request access with email
   */
  async requestAccess(email: string): Promise<ApiResponse<RequestAccessResponse>> {
    // Validate email before sending
    const validation = validateEmail(email);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    return this.post<RequestAccessResponse>('/api/request', { email }, false);
  }

  /**
   * Submit a command
   */
  async submitCommand(command: string): Promise<ApiResponse<CommandResponse>> {
    // Validate command before sending
    const validation = validateCommand(command);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    return this.post<CommandResponse>('/api/command', { command }, false);
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<ApiResponse<HealthResponse>> {
    return this.get<HealthResponse>('/api/health', false);
  }

  /**
   * Custom request for extensibility
   */
  async customRequest<T>(
    url: string,
    options: FetchOptions = {},
    retry = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, options, retry);
  }
}

/**
 * Singleton instance of API client
 */
export const apiClient = new ApiClient();

/**
 * Convenience methods using the singleton
 */
export const api = {
  getScenes: () => apiClient.getScenes(),
  requestAccess: (email: string) => apiClient.requestAccess(email),
  submitCommand: (command: string) => apiClient.submitCommand(command),
  checkHealth: () => apiClient.checkHealth(),
};
