"use client";
import { runLuxCommand } from "@/lib/luxCommands";

import { useEffect, useMemo, useRef, useState } from "react";

type Item = { label: string; href: string };

const ITEMS: Item[] = [
  { label: "Features", href: "#features" },
  { label: "Integrations", href: "#integrations" },
  { label: "Request Access", href: "#request" },
  { label: "Developer CLI & Data", href: "#cli" },
  { label: "AI Tasks", href: "#ai" },
  { label: "Composer", href: "#composer" },
  { label: "Ideas", href: "#ideas" },
  { label: "About", href: "#about" },
  { label: "Open LuxAI OS", href: "#os" },
];
// Lightweight command palette for in-page navigation and OS opening
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    const onCustom = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("luxin-cmd-open", onCustom as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("luxin-cmd-open", onCustom as EventListener);
    };
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return ITEMS;
    if (t === "os" || t === "open os") return ITEMS.filter((i) => i.href === "#os");
    return ITEMS.filter((i) => i.label.toLowerCase().includes(t));
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-6">
      <div className="w-full max-w-lg overflow-hidden rounded-lg border border-white/15 bg-zinc-900/90 backdrop-blur">
        <div className="flex items-center gap-2 border-b border-white/10 p-3">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const res = runLuxCommand(q);
                if (res.handled) {
                  if (res.message) {
                    window.dispatchEvent(
                      new CustomEvent("luxin-toast", {
                        detail: { text: res.message },
                      })
                    );
                  }
                  setOpen(false);
                }
              }
            }}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-zinc-400">
            esc
          </kbd>
        </div>
        <ul className="max-h-60 overflow-auto p-2 text-sm">
          {results.map((i) => (
            <li key={i.href}>
              <a
                href={i.href}
                onClick={(e) => {
                  if (i.href === "#os") {
                    e.preventDefault();
                    setOpen(false);
                    window.dispatchEvent(new Event("luxai-os-open"));
                  } else {
                    setOpen(false);
                  }
                }}
                className="block rounded-md px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-zinc-100"
              >
                {i.label}
              </a>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-2 text-zinc-500">No matches</li>
          )}
        </ul>
        <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 text-[10px] text-zinc-500">
          <span>Navigate sections</span>
          <span>Press Esc to close</span>
        </div>
      </div>
      <button
        aria-label="Close"
        className="fixed inset-0 -z-10"
        onClick={() => setOpen(false)}
      />
    </div>
  );
}























