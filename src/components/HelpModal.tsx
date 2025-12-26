"use client";

import { useEffect, useState } from "react";

export default function HelpModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Help and keyboard shortcuts"
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
    >
      <div className="w-full max-w-lg rounded-lg border border-white/10 bg-zinc-950/95 p-4 text-sm text-zinc-200 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Help & Shortcuts</h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-1 text-xs text-zinc-400 hover:bg-white/5"
          >
            Esc
          </button>
        </div>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <li className="rounded-md border border-white/10 bg-white/5 p-3">
            <p className="text-zinc-100">Open Command Palette</p>
            <p className="text-xs text-zinc-400">Press K or /</p>
          </li>
          <li className="rounded-md border border-white/10 bg-white/5 p-3">
            <p className="text-zinc-100">Toggle Aurora Effect</p>
            <p className="text-xs text-zinc-400">Use header toggle</p>
          </li>
          <li className="rounded-md border border-white/10 bg-white/5 p-3">
            <p className="text-zinc-100">Open Help</p>
            <p className="text-xs text-zinc-400">Press ?</p>
          </li>
          <li className="rounded-md border border-white/10 bg-white/5 p-3">
            <p className="text-zinc-100">Focus Request Form</p>
            <p className="text-xs text-zinc-400">Press F</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

