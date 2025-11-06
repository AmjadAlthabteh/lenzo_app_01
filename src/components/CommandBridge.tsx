"use client";

import { useEffect, useRef } from "react";
import { runLuxCommand } from "@/lib/luxCommands";

export default function CommandBridge() {
  const lastId = useRef<number>(0);

  useEffect(() => {
    let timer: number | undefined;
    const tick = async () => {
      try {
        const res = await fetch("/api/command", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { id: number; cmd: string };
          if (data.id && data.id !== lastId.current && data.cmd) {
            lastId.current = data.id;
            const out = runLuxCommand(data.cmd);
            if (out.handled && out.message) {
              window.dispatchEvent(new CustomEvent("luxin-toast", { detail: { text: out.message } }));
            }
          }
        }
      } catch {}
      timer = window.setTimeout(tick, 1000);
    };
    tick();
    return () => { if (timer) window.clearTimeout(timer); };
  }, []);

  return null;
}
