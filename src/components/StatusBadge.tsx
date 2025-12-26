"use client";

import { useEffect, useState } from "react";

export default function StatusBadge() {
  const [status, setStatus] = useState<"ok" | "degraded" | "down">("ok");
  const [ts, setTs] = useState<string>("");

  async function ping() {
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      if (!res.ok) throw new Error("bad");
      const data = (await res.json()) as { status?: string; time?: string };
      setStatus(data.status === "ok" ? "ok" : "degraded");
      setTs(data.time ?? "");
    } catch {
      setStatus("down");
    }
  }

  useEffect(() => {
    ping();
    const id = setInterval(ping, 15000);
    return () => clearInterval(id);
  }, []);

  const color = status === "ok" ? "bg-emerald-400" : status === "degraded" ? "bg-amber-400" : "bg-rose-400";
  const label = status === "ok" ? "Healthy" : status === "degraded" ? "Degraded" : "Down";

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-40">
      <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-2 py-1 text-xs text-zinc-300 shadow">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} aria-hidden />
        <span className="hidden sm:inline">{label}</span>
        <span className="sr-only">System status: {label}{ts ? ` at ${ts}` : ""}</span>
      </div>
    </div>
  );
}

