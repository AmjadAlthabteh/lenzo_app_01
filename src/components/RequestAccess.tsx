"use client";

import { useState } from "react";

export default function RequestAccess() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    const isValid = /.+@.+\..+/.test(email);
    if (!isValid) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    try {
      setStatus("loading");
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => ({}));
        throw new Error((typeof data === "object" && data && ("error" in (data as Record<string, unknown>)) ? (data as { error?: string }).error : undefined) || "Request failed");
      }
      setStatus("success");
      setMessage("Thank you! We'll be in touch soon.");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error
        ? (err.name === "AbortError" ? "Network timeout. Please try again." : err.message)
        : "Something went wrong. Try again later.";
      setMessage(msg);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-xl flex-col items-stretch gap-3">
      <div className="flex items-center gap-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
          required
          className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-neo whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70 luxin-glow flex items-center gap-2"
        >
          {status === "loading" && <span className="luxin-spinner" aria-hidden />}
          {status === "loading" ? "Sending…" : "Request Access"}
        </button>
      </div>
      <p
        aria-live="polite"
        role={status === "error" ? "alert" : undefined}
        className={
          "min-h-4 text-xs transition-colors " +
          (message ? (status === "error" ? "text-rose-400" : "text-emerald-400") : "text-transparent")
        }
      >
        {message}
      </p>
    </form>
  );
}


