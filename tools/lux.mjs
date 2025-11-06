#!/usr/bin/env node
// Simple Lux CLI: sends commands to the running dev server (default http://localhost:3003)

const [, , ...args] = process.argv;
const cmd = args.join(" ").trim();
if (!cmd) {
  console.error("Usage: lux <command>  (e.g., lux open os)");
  process.exit(1);
}

const endpoint = process.env.LUX_URL || "http://localhost:3003/api/command";

(async () => {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("Error:", res.status, t);
      process.exit(2);
    }
    const data = await res.json();
    console.log("Sent:", cmd, "id:", data.id ?? "?");
  } catch (e) {
    console.error("Failed to send command:", e instanceof Error ? e.message : String(e));
    process.exit(2);
  }
})();
