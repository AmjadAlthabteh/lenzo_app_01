"use client";


export default function SearchButton() {
  
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("luxin-cmd-open"))}
      className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-white/10"
      title="Open Command Palette (Ctrl/Cmd+K)"
    >
      Search
    </button>
  );
}





