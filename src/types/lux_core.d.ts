declare module "/lux_core.js" {
  type LuxWasmModule = {
    _lux_init(): void;
    _lux_step(t: number): void;
    _lux_get_room_rgb(idx: number, outPtr: number): void;
    _malloc(size: number): number;
    HEAPF32: { buffer: ArrayBuffer };
  };
  const factory: () => Promise<LuxWasmModule>;
  export default factory;
}

