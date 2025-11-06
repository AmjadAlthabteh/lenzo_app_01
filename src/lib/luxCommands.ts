export type LuxCommandOutcome = {
  handled: boolean;
  message: string;
};

type SetDetail = { room?: string; on?: boolean; brightness?: number; hue?: number };
type EffectDetail = { room?: string; type: "pulse" | "wave" | "off"; speed?: number; amount?: number };

function dispatch<K extends string, D>(name: K, detail?: D) {
  if (typeof window === "undefined") return;
  const evt = detail ? new CustomEvent(name, { detail } as Record<string, unknown>) : new Event(name);
  window.dispatchEvent(evt);
}

export function runLuxCommand(raw: string): LuxCommandOutcome {
  const input = (raw || "").trim();
  if (!/^lux(\b|$)/i.test(input)) {
    return { handled: false, message: "" };
  }
  const t = input.toLowerCase().replace(/^lux\s*/, "");

  if (t === "" || t === "help") {
    return {
      handled: true,
      message:
        [
          "lux help — list commands",
          "lux os|open os — open OS",
          "lux on|off <room|all>",
          "lux set <room|all> brightness <0-100>",
          "lux set <room|all> hue <0-360>",
          "lux effect <room|all> pulse|wave <speed> <amount>",
          "lux effect off <room|all>",
        ].join("\n"),
    };
  }

  if (t === "os" || t === "open os") {
    dispatch("luxai-os-open");
    return { handled: true, message: "Opened OS" };
  }

  const onoff = t.match(/^(on|off)\s+(living|kitchen|bedroom|studio|all)$/);
  if (onoff) {
    const on = onoff[1] === "on";
    const room = onoff[2];
    dispatch<"lux-set", SetDetail>("lux-set", { room, on });
    return { handled: true, message: `${on ? "On" : "Off"} ${room}` };
  }

  const setm = t.match(/^set\s+(living|kitchen|bedroom|studio|all)\s+(brightness|hue)\s+(\d{1,3})$/);
  if (setm) {
    const room = setm[1];
    const key = setm[2] as "brightness" | "hue";
    const val = Math.max(0, Math.min(key === "brightness" ? 100 : 360, Number(setm[3])));
    const payload: SetDetail = { room, [key]: val } as SetDetail;
    dispatch<"lux-set", SetDetail>("lux-set", payload);
    return { handled: true, message: `Set ${room} ${key} ${val}` };
  }

  const eff = t.match(/^effect\s+(living|kitchen|bedroom|studio|all)\s+(pulse|wave)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/);
  if (eff) {
    const room = eff[1];
    const type = eff[2] as "pulse" | "wave";
    const speed = Number(eff[3]);
    const amount = Number(eff[4]);
    dispatch<"lux-effect", EffectDetail>("lux-effect", { room, type, speed, amount });
    return { handled: true, message: `Effect ${type} ${room} speed=${speed} amount=${amount}` };
  }

  const effOff = t.match(/^effect\s+off\s+(living|kitchen|bedroom|studio|all)$/);
  if (effOff) {
    const room = effOff[1];
    dispatch<"lux-effect", EffectDetail>("lux-effect", { room, type: "off" });
    return { handled: true, message: `Effect off ${room}` };
  }

  if (t === "status") {
    return { handled: true, message: "Status available in UI (OS panel)." };
  }

  if (t === "console") {
    dispatch("lux-console-open");
    return { handled: true, message: "Opened console" };
  }

  return { handled: true, message: `Unknown lux command. Try \u2018lux help\u2019.` };
}




