"use client";

import { useEffect, useMemo, useState } from "react";

type LightState = {
  power: boolean;
  brightness: number; // 0-100
  temperature: number; // 2700-6500 (K)
};

function kelvinToRgb(k: number) {
  // Very rough approximation for UI preview (not photometric)
  // Map 2700K (warm) -> amber-ish, 6500K (cool) -> bluish
  const t = Math.max(2700, Math.min(6500, k));
  const ratio = (t - 2700) / (6500 - 2700);
  const r = Math.round(255 * (1 - ratio * 0.3));
  const g = Math.round(200 + 55 * (1 - Math.abs(ratio - 0.5) * 2));
  const b = Math.round(60 + 140 * ratio);
  return { r, g, b };
}

export default function LightPreview() {
  const [state, setState] = useState<LightState>({
    power: true,
    brightness: 70,
    temperature: 3500,
  });

  // Listen for scene apply events
  useEffect(() => {
    const onSet = (e: Event) => {
      const detail = (e as CustomEvent<Partial<LightState>>).detail || {};
      setState((prev) => ({
        power: detail.power ?? prev.power,
        brightness: detail.brightness ?? prev.brightness,
        temperature: detail.temperature ?? prev.temperature,
      }));
    };
    window.addEventListener("luxin-light-set", onSet as EventListener);
    return () => window.removeEventListener("luxin-light-set", onSet as EventListener);
  }, []);

  const rgb = useMemo(() => kelvinToRgb(state.temperature), [state.temperature]);
  const intensity = state.power ? state.brightness / 100 : 0;
  const lampColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0.1, intensity)})`;

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-100">Demo Light</p>
          <p className="text-xs text-zinc-400">Power, brightness, and color temperature</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setState((s) => ({ ...s, power: !s.power }))}
            className={`focus-ring rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              state.power ? "bg-emerald-400 text-black hover:bg-emerald-300" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
            }`}
            aria-pressed={state.power}
          >
            {state.power ? "On" : "Off"}
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-6">
        <div className="relative mx-auto h-24 w-24 shrink-0 rounded-full border border-white/10 bg-black shadow-inner">
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: `radial-gradient(60% 60% at 50% 40%, ${lampColor}, rgba(0,0,0,0.05))`,
              boxShadow: intensity
                ? `0 0 40px rgba(${rgb.r},${rgb.g},${rgb.b}, ${0.35 * intensity})`
                : "none",
              transition: "all 200ms ease",
            }}
          />
        </div>
        <div className="grid flex-1 gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-zinc-400">Brightness: {state.brightness}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={state.brightness}
              onChange={(e) => setState((s) => ({ ...s, brightness: Number(e.target.value) }))}
              className="w-full accent-cyan-300"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={state.brightness}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-zinc-400">Temperature: {state.temperature}K</span>
            <input
              type="range"
              min={2700}
              max={6500}
              step={100}
              value={state.temperature}
              onChange={(e) => setState((s) => ({ ...s, temperature: Number(e.target.value) }))}
              className="w-full accent-amber-300"
              aria-valuemin={2700}
              aria-valuemax={6500}
              aria-valuenow={state.temperature}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

