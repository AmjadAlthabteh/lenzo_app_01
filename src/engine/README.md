LuxAI Native Engine (C++/WASM)

Overview
- This folder contains a minimal C++ lighting engine you can compile to WebAssembly with Emscripten and load in the UI.
- The engine steps simple effects (pulse/wave) and converts HSV→RGB. The browser UI can call into it each frame.

Prerequisites
- Install Emscripten: https://emscripten.org/docs/getting_started/downloads.html
- Activate env: emsdk install latest && emsdk activate latest && emsdk_env (or use emsdk terminal)

Build (outputs to public/ so the app can fetch it)
```
emcc lux_core.cpp -O3 ^
  -s ENVIRONMENT=web ^
  -s EXPORTED_FUNCTIONS='["_malloc","_free","_lux_init","_lux_set_room","_lux_set_effect","_lux_step","_lux_get_room_rgb"]' ^
  -s MODULARIZE=1 -s EXPORT_ES6=1 -o ../../public/lux_core.js
```

Notes
- The emitted public/lux_core.js will also generate a public/lux_core.wasm. The frontend loader expects these two files at app root /lux_core.js and /lux_core.wasm.
- Use runWasmDemo() from src/lib/luxWasm.ts to do a quick sanity check.
