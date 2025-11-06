"use client";

import { useEffect, useState } from "react";

type Toast = { id: number; text: string };

export default function Toasts() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<{ text: string }>).detail;
      if (!detail?.text) return;
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, text: detail.text }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3000);
    };
    window.addEventListener("luxin-toast", onToast as EventListener);
    return () => window.removeEventListener("luxin-toast", onToast as EventListener);
  }, []);

  if (!items.length) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 space-y-2">
      {items.map((t) => (
        <div key={t.id} className="pointer-events-auto rounded-md border border-white/15 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-100 shadow">
          {t.text}
        </div>
      ))}
    </div>
  );
}
