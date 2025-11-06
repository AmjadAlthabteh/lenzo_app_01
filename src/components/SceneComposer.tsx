"use client";

import { useEffect, useMemo, useState } from "react";

type Scene = {
  name: string;
  brightness: number; // 0-100
  hue: number; // 0-360
  warmth: "cool" | "neutral" | "warm";
};

const presets: Record<string, Partial<Scene>> = {
  focus: { name: "Focus", brightness: 85, warmth: "cool", hue: 200 },
  relax: { name: "Relax", brightness: 45, warmth: "warm", hue: 35 },
  sunset: { name: "Sunset", brightness: 50, warmth: "warm", hue: 20 },
  daylight: { name: "Daylight", brightness: 90, warmth: "neutral", hue: 210 },
  studio: { name: "Studio", brightness: 70, warmth: "neutral", hue: 260 },
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function SceneComposer() {
  const [prompt, setPrompt] = useState("");
  const [scene, setScene] = useState<Scene>({
    name: "Custom",
    brightness: 60,
    hue: 210,
    warmth: "neutral",
  });
  const [saved, setSaved] = useState<Scene[]>([]);

  useEffect(() => {
    if (!prompt.trim()) return;
    const p = prompt.toLowerCase();
    let next: Scene = { ...scene };
    const b = p.match(/(\d{1,3})\s*%/);
    if (b) next.brightness = clamp(parseInt(b[1], 10), 0, 100);
    if (/(warm|cozy|sunset|gold)/.test(p)) next.warmth = "warm";
    else if (/(cool|focus|icy|blue)/.test(p)) next.warmth = "cool";
    else if (/(neutral|daylight|white)/.test(p)) next.warmth = "neutral";
    if (/sunset|amber|gold/.test(p)) next.hue = 30;
    else if (/forest|green|nature/.test(p)) next.hue = 150;
    else if (/ocean|cyan|sky|blue/.test(p)) next.hue = 200;
    else if (/violet|purple|studio/.test(p)) next.hue = 265;
    for (const key of Object.keys(presets)) {
      if (p.includes(key)) next = { ...next, ...presets[key] } as Scene;
    }
    const nameMatch = p.match(/(?:scene|mood)\s*:\s*([a-z0-9\-\s]{3,40})/);
    next.name = nameMatch ? nameMatch[1].trim().replace(/\s+/g, " ") : next.name;
    setScene(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  const cssVars = useMemo(() => {
    const lightness = 50 + (scene.brightness - 50) * 0.4;
    const base = `hsl(${scene.hue} 80% ${clamp(lightness, 30, 80)}%)`;
    const accent = `hsl(${(scene.hue + 35) % 360} 85% ${clamp(lightness + 10, 35, 90)}%)`;
    return {
      "--sc-base": base,
      "--sc-accent": accent,
    } as React.CSSProperties;
  }, [scene]);

  const saveScene = () => {
    setSaved((list) => [...list, scene]);
    window.dispatchEvent(
      new CustomEvent("luxin-toast", { detail: { text: "Saved scene" } })
    );
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-md border border-white/10 bg-white/5 p-4">
        <label htmlFor="prompt" className="text-sm text-zinc-300">Describe your scene</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. warm sunset, 40% brightness, mood: Golden Hour"
          rows={3}
          className="mt-2 w-full resize-y rounded-md border border-white/10 bg-black/30 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        />

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {Object.keys(presets).map((k) => (
            <button
              key={k}
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-zinc-300 hover:bg-white/10"
              onClick={() => setScene((s) => ({ ...s, ...(presets[k] as Partial<Scene>) } as Scene))}
            >
              {(presets[k]?.name as string) || k}
            </button>
          ))}
          <button
            type="button"
            className="btn-neo rounded-full bg-white/90 px-3 py-1.5 font-medium text-black hover:bg-white active:translate-y-0.5"
            onClick={() => setScene({ name: "Custom", brightness: 60, hue: 210, warmth: "neutral" })}
          >
            Reset
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-zinc-300">
          <div>
            <label htmlFor="b" className="block text-zinc-400">Brightness</label>
            <input id="b" type="range" min={0} max={100} value={scene.brightness}
              onChange={(e) => setScene((s) => ({ ...s, brightness: Number(e.target.value) }))}
              className="w-full" />
            <div className="mt-1 text-zinc-500">{scene.brightness}%</div>
          </div>
          <div>
            <label htmlFor="h" className="block text-zinc-400">Hue</label>
            <input id="h" type="range" min={0} max={360} value={scene.hue}
              onChange={(e) => setScene((s) => ({ ...s, hue: Number(e.target.value) }))}
              className="w-full" />
            <div className="mt-1 text-zinc-500">{scene.hue}°</div>
          </div>
          <div>
            <label htmlFor="w" className="block text-zinc-400">Warmth</label>
            <select id="w" value={scene.warmth}
              onChange={(e) => setScene((s) => ({ ...s, warmth: e.target.value as Scene["warmth"] }))}
              className="w-full rounded-md border border-white/10 bg-black/30 p-2">
              <option value="cool">Cool</option>
              <option value="neutral">Neutral</option>
              <option value="warm">Warm</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-md border border-white/10 bg-black/40 p-0" style={cssVars}>
        <div aria-hidden className="absolute inset-0" style={{
          background:
            "radial-gradient(80% 60% at 20% 20%, var(--sc-accent) 0%, transparent 60%)," +
            "radial-gradient(80% 60% at 80% 80%, var(--sc-base) 0%, transparent 60%)",
          filter: "blur(40px) saturate(120%)",
          opacity: 0.95,
        }} />
        <div className="relative z-10 grid h-full min-h-48 grid-cols-3 p-4 text-sm">
          <div className="col-span-2">
            <p className="text-zinc-400">Preview</p>
            <h3 className="mt-2 text-lg font-medium text-zinc-100">{scene.name}</h3>
            <p className="mt-1 text-zinc-300">{scene.warmth} • {scene.brightness}% • hue {scene.hue}°</p>
          </div>
          <div className="flex items-end justify-end">
            <button
              type="button"
              className="btn-neo rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-black hover:bg-white active:translate-y-0.5"
              onClick={() => window.dispatchEvent(new CustomEvent("luxin-toast", { detail: { text: "Scene applied (mock)" } }))}
            >
              Apply
            </button>
            <button
              type="button"
              className="ml-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10"
              onClick={saveScene}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-white/10 bg-white/5 p-4 sm:col-span-2">
        <p className="text-sm text-zinc-300">Saved scenes</p>
        <ul className="mt-2 grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
          {saved.length === 0 && <li className="text-zinc-500">No scenes saved</li>}
          {saved.map((s, i) => (
            <li key={i} className="flex items-center justify-between rounded border border-white/10 bg-black/30 p-2">
              <span className="text-zinc-200">{s.name}</span>
              <button
                type="button"
                className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-zinc-300 hover:bg-white/10"
                onClick={() => setScene(s)}
              >
                Load
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
