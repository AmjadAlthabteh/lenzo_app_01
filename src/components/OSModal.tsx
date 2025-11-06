"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RoomKey = "Living" | "Kitchen" | "Bedroom" | "Studio";
type RoomState = { on: boolean; brightness: number; hue: number };
type EffectState = { type: "off" | "pulse" | "wave"; speed: number; amount: number; start: number };

const DEFAULT_ROOMS: Record<RoomKey, RoomState> = {
  Living: { on: true, brightness: 70, hue: 30 },
  Kitchen: { on: true, brightness: 85, hue: 210 },
  Bedroom: { on: false, brightness: 35, hue: 265 },
  Studio: { on: true, brightness: 60, hue: 150 },
};

export default function OSModal() {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<Record<RoomKey, RoomState>>(DEFAULT_ROOMS);
  const [effects, setEffects] = useState<Record<RoomKey, EffectState>>({
    Living: { type: "off", speed: 1, amount: 0, start: 0 },
    Kitchen: { type: "off", speed: 1, amount: 0, start: 0 },
    Bedroom: { type: "off", speed: 1, amount: 0, start: 0 },
    Studio: { type: "off", speed: 1, amount: 0, start: 0 },
  });
  const [tick, setTick] = useState(0);
  const raf = useRef<number | null>(null);

  

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const toKey = (name?: string): RoomKey | "all" | null => {
      if (!name) return null;
      const n = name.toLowerCase();
      if (n === "all") return "all";
      if (n.startsWith("liv")) return "Living";
      if (n.startsWith("kit")) return "Kitchen";
      if (n.startsWith("bed")) return "Bedroom";
      if (n.startsWith("stu")) return "Studio";
      return null;
    };
    const onSet = (e: Event) => {
      const d = (e as CustomEvent<{ room?: string; on?: boolean; brightness?: number; hue?: number }>).detail;
      if (!d) return;
      const key = toKey(d.room) ?? "all";
      setRooms((r) => {
        const next = { ...r } as Record<RoomKey, RoomState>;
        const apply = (k: RoomKey) => {
          const cur = next[k];
          next[k] = {
            on: typeof d.on === "boolean" ? d.on : cur.on,
            brightness: typeof d.brightness === "number" ? Math.max(0, Math.min(100, d.brightness)) : cur.brightness,
            hue: typeof d.hue === "number" ? Math.max(0, Math.min(360, d.hue)) : cur.hue,
          };
        };
        if (key === "all") (Object.keys(next) as RoomKey[]).forEach(apply); else apply(key);
        return next;
      });
    };
    const onEffect = (e: Event) => {
      const d = (e as CustomEvent<{ room?: string; type: "pulse" | "wave" | "off"; speed?: number; amount?: number }>).detail;
      if (!d) return;
      const key = toKey(d.room) ?? "all";
      setEffects((map) => {
        const next = { ...map } as Record<RoomKey, EffectState>;
        const apply = (k: RoomKey) => {
          next[k] = { type: d.type, speed: d.speed ?? 1, amount: d.amount ?? 0.5, start: 0 };
        };
        if (key === "all") (Object.keys(next) as RoomKey[]).forEach(apply); else apply(key);
        return next;
      });
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };

    window.addEventListener("luxai-os-open", onOpen as EventListener);
    window.addEventListener("lux-set", onSet as EventListener);
    window.addEventListener("lux-effect", onEffect as EventListener);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("luxai-os-open", onOpen as EventListener);
      window.removeEventListener("lux-set", onSet as EventListener);
      window.removeEventListener("lux-effect", onEffect as EventListener);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  

  useEffect(() => {
    const hasEffect = Object.values(effects).some((e) => e.type !== "off");
    if (!hasEffect) { if (raf.current) cancelAnimationFrame(raf.current); raf.current = null; return; }
    let mounted = true;
    const loop = () => { if (!mounted) return; setTick((t) => (t + 1) % 1000000); raf.current = requestAnimationFrame(loop); };
    raf.current = requestAnimationFrame(loop);
    return () => { mounted = false; if (raf.current) cancelAnimationFrame(raf.current); };
  }, [effects]);

  const roomKeys = useMemo(() => Object.keys(rooms) as RoomKey[], [rooms]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 top-10 mx-auto flex max-w-6xl flex-col overflow-hidden rounded-t-2xl border border-white/15 bg-zinc-950/90 backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <p className="text-sm text-zinc-400">LuxAI OS — Lighting Console</p>
          <button type="button" className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-zinc-300 hover:bg-white/10" onClick={() => setOpen(false)}>Close</button>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {roomKeys.map((key, idx) => {
            const state = rooms[key];
            const eff = effects[key];
            const nowSeconds = tick * 0.016;
            const phase = (nowSeconds) * (eff.speed || 1) + idx * 0.6;
            const mod = eff.type === "off" ? 0 : eff.type === "pulse" ? Math.sin(phase * Math.PI * 2) * eff.amount : Math.sin(phase) * eff.amount;
            const b = state.brightness + mod * 20;
            const h = state.hue + (eff.type === "wave" ? mod * 20 : 0);
            const hueClamped = Math.max(0, Math.min(360, h));
            const base = `hsl(${hueClamped} 80% ${40 + (b - 50) * 0.4}%)`;
            const accent = `hsl(${(hueClamped + 35) % 360} 85% ${50 + (b - 50) * 0.4}%)`;
            return (
              <div key={key} className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/40 p-0">
                <div aria-hidden className="absolute inset-0 opacity-80" style={{
                  background:
                    `radial-gradient(70% 60% at 20% 20%, ${accent} 0%, transparent 60%),` +
                    `radial-gradient(70% 60% at 80% 80%, ${base} 0%, transparent 60%)`,
                  filter: "blur(40px) saturate(120%)",
                }} />
                <div className="relative z-10 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-zinc-100">{key}</p>
                    <button type="button" className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-zinc-100 hover:bg-white/20" onClick={() => setRooms((r) => ({ ...r, [key]: { ...r[key], on: !r[key].on } }))}>{state.on ? "On" : "Off"}</button>
                  </div>
                  <div className="mt-3 text-zinc-300">
                    <label className="block text-xs text-zinc-400">Brightness</label>
                    <input type="range" min={0} max={100} value={state.brightness} onChange={(e) => setRooms((r) => ({ ...r, [key]: { ...r[key], brightness: Number(e.target.value) } }))} className="w-full" />
                    <div className="mt-1 text-xs text-zinc-400">{Math.round(b)}%</div>
                  </div>
                  <div className="mt-3 text-zinc-300">
                    <label className="block text-xs text-zinc-400">Hue</label>
                    <input type="range" min={0} max={360} value={state.hue} onChange={(e) => setRooms((r) => ({ ...r, [key]: { ...r[key], hue: Number(e.target.value) } }))} className="w-full" />
                    <div className="mt-1 text-xs text-zinc-400">{Math.round(h)}°</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}








