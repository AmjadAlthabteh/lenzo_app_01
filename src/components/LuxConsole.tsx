"use client";

import { useEffect, useRef, useState } from "react";
import { runLuxCommand } from "@/lib/luxCommands";
import { STORAGE_KEYS } from "@/lib/constants";

type Entry = { id: number; text: string; kind: "in" | "out" };

const MAX_HISTORY = 50;

export default function LuxConsole() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [log, setLog] = useState<Entry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load command history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMAND_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.warn("Failed to load command history:", error);
    }
  }, []);

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

    // Add to log
    const id = Date.now() + Math.random();
    setLog((l) => [...l, { id, text, kind: "in" }]);

    // Run command
    const { handled, message } = runLuxCommand(text);
    if (handled && message) setLog((l) => [...l, { id: id + 1, text: message, kind: "out" }]);

    // Add to history (avoid duplicates of last command)
    if (history[0] !== text) {
      const newHistory = [text, ...history].slice(0, MAX_HISTORY);
      setHistory(newHistory);
      try {
        localStorage.setItem(STORAGE_KEYS.COMMAND_HISTORY, JSON.stringify(newHistory));
      } catch (error) {
        console.warn("Failed to save command history:", error);
      }
    }

    // Reset input and history navigation
    setQ("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setQ(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setQ(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setQ("");
      }
    }
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
            onKeyDown={handleKeyDown}
            placeholder="lux … (↑/↓ for history)"
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









