"use client";


export default function Dock() {
  
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-zinc-900/70 px-3 py-2 backdrop-blur">
        <button
          type="button"
          aria-label="Open LuxAI OS"
          title="Open LuxAI OS"
          onClick={() => window.dispatchEvent(new Event("luxai-os-open"))}
          className="relative h-9 w-9 overflow-hidden rounded-full border border-white/15 bg-white/90 text-black transition-all hover:bg-white"
        >
          <span className="absolute inset-0 luxin-spinner" aria-hidden />
          <span className="relative z-10 text-[11px] font-semibold">OS</span>
        </button>
        <button
          type="button"
          aria-label="Open Lux CLI"
          title="Open Lux CLI"
          onClick={() => window.dispatchEvent(new Event("lux-console-open"))}
          className="relative h-9 w-9 overflow-hidden rounded-full border border-white/15 bg-white/90 text-black transition-all hover:bg-white"
        >
          <span className="relative z-10 text-[11px] font-semibold">CLI</span>
        </button>
      </div>
    </div>
  );
}





