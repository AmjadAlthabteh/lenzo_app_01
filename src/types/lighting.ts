/**
 * Core type definitions for LuxAI lighting system
 */

import { RGB, HSL, HSV } from "@/lib/colorUtils";

/**
 * Device connection status
 */
export type DeviceStatus = "online" | "offline" | "connecting" | "error";

/**
 * Supported device types
 */
export type DeviceType =
  | "bulb"
  | "strip"
  | "panel"
  | "switch"
  | "sensor"
  | "controller";

/**
 * Lighting device interface
 */
export interface LightDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  manufacturer?: string;
  model?: string;
  firmware?: string;
  capabilities: DeviceCapabilities;
  state: DeviceState;
  room?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Device capabilities
 */
export interface DeviceCapabilities {
  brightness: boolean;
  colorTemp: boolean;
  rgb: boolean;
  effects: boolean;
  minKelvin?: number; // Minimum color temperature
  maxKelvin?: number; // Maximum color temperature
  maxBrightness?: number; // Maximum brightness in lumens
  powerUsage?: number; // Power consumption in watts
}

/**
 * Current device state
 */
export interface DeviceState {
  on: boolean;
  brightness: number; // 0-100
  color?: RGB;
  colorTemp?: number; // Kelvin
  effect?: string;
  transition?: number; // Transition time in ms
}

/**
 * Lighting scene
 */
export interface Scene {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  devices: SceneDevice[];
  schedule?: SceneSchedule;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Device configuration within a scene
 */
export interface SceneDevice {
  deviceId: string;
  state: DeviceState;
  delay?: number; // Delay before applying state (ms)
}

/**
 * Scene scheduling configuration
 */
export interface SceneSchedule {
  enabled: boolean;
  type: "time" | "sunrise" | "sunset" | "circadian";
  time?: string; // Time in HH:MM format
  offset?: number; // Offset in minutes for sunrise/sunset
  days?: number[]; // Days of week (0-6, 0 = Sunday)
  repeat?: boolean;
}

/**
 * Room configuration
 */
export interface Room {
  id: string;
  name: string;
  devices: string[]; // Device IDs
  defaultScene?: string; // Default scene ID
  circadianSettings?: CircadianSettings;
  energySettings?: EnergySettings;
  icon?: string;
  floor?: number;
  area?: number; // Square meters
}

/**
 * Circadian lighting settings
 */
export interface CircadianSettings {
  enabled: boolean;
  latitude?: number;
  longitude?: number;
  minKelvin: number; // Minimum color temperature
  maxKelvin: number; // Maximum color temperature
  minBrightness: number; // Minimum brightness percentage
  maxBrightness: number; // Maximum brightness percentage
  wakeTime?: string; // Wake time in HH:MM
  sleepTime?: string; // Sleep time in HH:MM
}

/**
 * Energy optimization settings
 */
export interface EnergySettings {
  enabled: boolean;
  maxPowerUsage?: number; // Maximum watts
  priorityDevices?: string[]; // Priority device IDs
  dimOnBattery?: boolean;
  autoOffDelay?: number; // Auto-off delay in minutes
}

/**
 * Automation rule
 */
export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  conditions?: AutomationCondition[];
  actions: AutomationAction[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Automation trigger
 */
export interface AutomationTrigger {
  type: "time" | "device" | "sensor" | "scene" | "manual";
  deviceId?: string;
  property?: string;
  value?: unknown;
  operator?: "equals" | "greater" | "less" | "changed";
}

/**
 * Automation condition
 */
export interface AutomationCondition {
  type: "time" | "device" | "sensor";
  deviceId?: string;
  property?: string;
  value?: unknown;
  operator: "equals" | "greater" | "less" | "between";
}

/**
 * Automation action
 */
export interface AutomationAction {
  type: "device" | "scene" | "notification";
  deviceId?: string;
  sceneId?: string;
  state?: Partial<DeviceState>;
  message?: string;
  delay?: number; // Delay in ms
}

/**
 * Telemetry data point
 */
export interface TelemetryData {
  timestamp: Date;
  deviceId: string;
  type: "state" | "power" | "error" | "event";
  data: Record<string, unknown>;
}

/**
 * System preferences
 */
export interface SystemPreferences {
  theme: "light" | "dark" | "auto";
  units: "metric" | "imperial";
  language: string;
  notifications: boolean;
  auroraEffect: boolean;
  telemetry: boolean;
  autoUpdate: boolean;
}
