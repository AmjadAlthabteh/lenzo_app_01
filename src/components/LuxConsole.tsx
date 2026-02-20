"use client";

import { useEffect, useRef, useState } from "react";
import { runLuxCommand } from "@/lib/luxCommands";

type Entry = { id: number; text: string; kind: "in" | "out" };

export default function LuxConsole() {  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [log, setLog] = useState<Entry[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`") setOpen((v) => !v);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("lux-console-open", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("lux-console-open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  const submit = () => {
    const text = q.trim();
    if (!text) return;
    const id = Date.now() + Math.random();
    setLog((l) => [...l, { id, text, kind: "in" }]);
    const { handled, message } = runLuxCommand(text);
    if (handled && message) setLog((l) => [...l, { id: id + 1, text: message, kind: "out" }]);
    setQ("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-white/15 bg-zinc-950/90 backdrop-blur">
        <div className="max-h-64 overflow-auto p-3 text-xs">
          {log.length === 0 && (
            <div className="text-zinc-500">Type \u2018lux help\u2019 to get started.</div>
          )}
          {log.map((e) => (
            <div key={e.id} className={e.kind === "in" ? "text-zinc-300" : "text-emerald-300"}>
              {e.kind === "in" ? "> " : "< "}{e.text}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-white/10 p-2">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="lux â€¦"
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={submit}
            className="rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/20"
          >
            Run
          </button>
          {log.length > 0 && (
            <button
              type="button"
              onClick={() => setLog([])}
              className="rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/20"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}









