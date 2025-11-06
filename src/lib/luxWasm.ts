// Minimal Emscripten module surface used by Lux (no-explicit-any)
type LuxWasmModule = {
  _lux_init(): void;
  _lux_step(t: number): void;
  _lux_get_room_rgb(idx: number, outPtr: number): void;
  _malloc(size: number): number;
  HEAPF32: { buffer: ArrayBuffer };
};

export type LuxWasm = {
  ready: boolean;
  module?: LuxWasmModule;
  init(): Promise<void>;
  step(t: number): void;
  getRoomRgb(idx: number): [number, number, number];
};

export function createLuxWasm(): LuxWasm {
  let mod: LuxWasmModule | undefined;
  let rgbPtr = 0;
  return {
    ready: false,
    module: undefined,
    async init() {
      if (typeof window === "undefined") return;
      // Expect lux_core.js at /lux_core.js (built by Emscripten)
      try {
        // Dynamic import so build doesn't choke without the file
        // Avoid static module resolution so TS/Next doesn't require types
        const dynImport = new Function("p", "return import(p)") as (p: string) => Promise<unknown>;
        const imported: unknown = await dynImport("/lux_core.js");
        const factory = (imported as { default: () => Promise<LuxWasmModule> }).default;
        mod = await factory();
        this.module = mod;
        this.ready = true;
        mod._lux_init();
        rgbPtr = mod._malloc(3 * 4);
      } catch (e) {
        console.warn("Lux WASM not available:", e);
        this.ready = false;
      }
    },
    step(t: number) {
      if (!this.ready || !mod) return;
      mod._lux_step(t);
    },
    getRoomRgb(idx: number): [number, number, number] {
      if (!this.ready || !mod) return [0, 0, 0];
      mod._lux_get_room_rgb(idx, rgbPtr);
      const view = new Float32Array(mod.HEAPF32.buffer, rgbPtr, 3);
      return [view[0], view[1], view[2]];
    },
  };
}

// Quick demo helper — call from console if modules exist
export async function runWasmDemo() {
  const lux = createLuxWasm();
  await lux.init();
  if (!lux.ready) {
    window.dispatchEvent(
      new CustomEvent("luxin-toast", {
        detail: { text: "WASM engine not built (see src/engine/README.md)" },
      })
    );
    return;
  }
  // drive a few steps
  let t = 0;
  const id = setInterval(() => {
    t += 0.016;
    lux.step(t);
    const [r, g, b] = lux.getRoomRgb(0);
    console.log("room0 rgb", r, g, b);
    if (t > 0.5) clearInterval(id);
  }, 16);
}
