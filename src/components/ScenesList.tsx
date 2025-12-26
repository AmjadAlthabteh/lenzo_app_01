"use client";

import { useEffect, useState } from "react";

type Scene = {
  id: string;
  name: string;
  brightness: number; // 0-100
  temperature: number; // K
};

export default function ScenesList() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/scenes", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load scenes");
        const data = (await res.json()) as { scenes?: Scene[] };
        if (!cancelled) setScenes(data.scenes ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyScene = (scene: Scene) => {
    const evt = new CustomEvent("luxin-light-set", {
      detail: { power: true, brightness: scene.brightness, temperature: scene.temperature },
    });
    window.dispatchEvent(evt);
    window.dispatchEvent(new CustomEvent("luxin-toast", { detail: { text: `Applied scene: ${scene.name}` } }));
  };

  if (loading) return <p className="text-xs text-zinc-500">Loading scenes…</p>;
  if (error) return <p className="text-xs text-rose-400">{error}</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {scenes.map((s) => (
        <button
          key={s.id}
          onClick={() => applyScene(s)}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10"
        >
          {s.name}
        </button>
      ))}
      {!scenes.length && (
        <p className="text-xs text-zinc-500">No scenes available.</p>
      )}
    </div>
  );
}

