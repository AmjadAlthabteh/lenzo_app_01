/**
 * Type-safe event bus for inter-component communication
 */

import { EVENTS } from './constants';

/**
 * Event payload types for each event
 */
export interface EventPayloads {
  [EVENTS.TOAST_SHOW]: {
    text: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  };
  [EVENTS.LIGHT_SET]: {
    deviceId: string;
    brightness?: number;
    colorTemp?: number;
    rgb?: { r: number; g: number; b: number };
  };
  [EVENTS.LUX_SET]: {
    command: string;
    params?: Record<string, unknown>;
  };
  [EVENTS.CONSOLE_OPEN]: Record<string, never>;
  [EVENTS.CONSOLE_CLOSE]: Record<string, never>;
  [EVENTS.SCENE_ACTIVATED]: {
    sceneId: string;
    sceneName: string;
  };
  [EVENTS.DEVICE_UPDATED]: {
    deviceId: string;
    changes: Record<string, unknown>;
  };
}

/**
 * Event names type
 */
export type EventName = keyof EventPayloads;

/**
 * Event listener callback type
 */
export type EventListener<T extends EventName> = (payload: EventPayloads[T]) => void;

/**
 * Event bus class for managing typed events
 */
class EventBus {
  private listeners: Map<string, Set<EventListener<EventName>>> = new Map();

  /**
   * Subscribe to an event
   */
  on<T extends EventName>(eventName: T, callback: EventListener<T>): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    const listeners = this.listeners.get(eventName)!;
    listeners.add(callback as EventListener<EventName>);

    // Return unsubscribe function
    return () => {
      listeners.delete(callback as EventListener<EventName>);
      if (listeners.size === 0) {
        this.listeners.delete(eventName);
      }
    };
  }

  /**
   * Subscribe to an event (one-time only)
   */
  once<T extends EventName>(eventName: T, callback: EventListener<T>): () => void {
    const unsubscribe = this.on(eventName, (payload) => {
      unsubscribe();
      callback(payload);
    });

    return unsubscribe;
  }

  /**
   * Emit an event with payload
   */
  emit<T extends EventName>(eventName: T, payload: EventPayloads[T]): void {
    const listeners = this.listeners.get(eventName);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(payload as EventPayloads[EventName]);
        } catch (error) {
          console.error(`Error in event listener for ${eventName}:`, error);
        }
      });
    }

    // Also dispatch as native CustomEvent for backward compatibility
    this.emitNativeEvent(eventName, payload);
  }

  /**
   * Emit native CustomEvent for backward compatibility
   */
  private emitNativeEvent<T extends EventName>(
    eventName: T,
    payload: EventPayloads[T]
  ): void {
    if (typeof window !== 'undefined') {
      const customEvent = new CustomEvent(eventName, {
        detail: payload,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(customEvent);
    }
  }

  /**
   * Remove all listeners for an event
   */
  off<T extends EventName>(eventName: T): void {
    this.listeners.delete(eventName);
  }

  /**
   * Remove all listeners
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Get listener count for an event
   */
  listenerCount(eventName: EventName): number {
    return this.listeners.get(eventName)?.size || 0;
  }

  /**
   * Get all active event names
   */
  getEventNames(): EventName[] {
    return Array.from(this.listeners.keys()) as EventName[];
  }
}

/**
 * Singleton event bus instance
 */
export const eventBus = new EventBus();

/**
 * Convenience methods for common events
 */
export const events = {
  /**
   * Show a toast notification
   */
  showToast: (text: string, type?: 'success' | 'error' | 'info' | 'warning') => {
    eventBus.emit(EVENTS.TOAST_SHOW, { text, type });
  },

  /**
   * Set light device state
   */
  setLight: (
    deviceId: string,
    options: {
      brightness?: number;
      colorTemp?: number;
      rgb?: { r: number; g: number; b: number };
    }
  ) => {
    eventBus.emit(EVENTS.LIGHT_SET, { deviceId, ...options });
  },

  /**
   * Execute Lux command
   */
  luxCommand: (command: string, params?: Record<string, unknown>) => {
    eventBus.emit(EVENTS.LUX_SET, { command, params });
  },

  /**
   * Open Lux console
   */
  openConsole: () => {
    eventBus.emit(EVENTS.CONSOLE_OPEN, {});
  },

  /**
   * Close Lux console
   */
  closeConsole: () => {
    eventBus.emit(EVENTS.CONSOLE_CLOSE, {});
  },

  /**
   * Activate a scene
   */
  activateScene: (sceneId: string, sceneName: string) => {
    eventBus.emit(EVENTS.SCENE_ACTIVATED, { sceneId, sceneName });
  },

  /**
   * Notify device update
   */
  deviceUpdated: (deviceId: string, changes: Record<string, unknown>) => {
    eventBus.emit(EVENTS.DEVICE_UPDATED, { deviceId, changes });
  },
};

/**
 * React hook for subscribing to events
 */
export function useEventBus<T extends EventName>(
  eventName: T,
  callback: EventListener<T>,
  dependencies: unknown[] = []
): void {
  if (typeof window !== 'undefined' && typeof require !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { useEffect } = require('react');

      useEffect(() => {
        return eventBus.on(eventName, callback);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [eventName, ...dependencies]);
    } catch {
      // React not available, skip hook functionality
    }
  }
}
