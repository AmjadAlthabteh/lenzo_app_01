"use client";

import { useEffect, useState } from "react";

export default function AuroraToggle() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("luxin-aurora") : null;
      return saved ? saved === "on" : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.remove("aurora-disabled");
    } else {
      root.classList.add("aurora-disabled");
    }
    try {
      localStorage.setItem("luxin-aurora", enabled ? "on" : "off");
    } catch {}
  }, [enabled]);

  return (
    <button
      type="button"
      onClick={() => setEnabled((v) => !v)}
      className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-white/10 focus-ring"
      aria-pressed={enabled}
      title="Toggle background lighting effect"
    >
      Aurora: {enabled ? "On" : "Off"}
    </button>
  );
}
