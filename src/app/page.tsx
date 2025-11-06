/**
 * TODO Protocol (see docs/TODO.md)
 * - Before modifying this file, review sections 0–4 in docs/TODO.md
 * - Update checklist items with your intent and result notes
 * - Keep diffs minimal and scoped to the active checklist
 */
import Image from "next/image";
import Link from "next/link";
import RequestAccess from "@/components/RequestAccess";
import AuroraToggle from "@/components/AuroraToggle";
import Card3D from "@/components/Card3D";
import SceneComposer from "@/components/SceneComposer";
import CommandPalette from "@/components/CommandPalette";
import OSModal from "@/components/OSModal";
import Dock from "@/components/Dock";
import Toasts from "@/components/Toasts";
import LuxConsole from "@/components/LuxConsole";
import CommandBridge from "@/components/CommandBridge";
import SearchButton from "@/components/SearchButton";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-black text-zinc-200 font-sans">
      {/* top subtle gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-zinc-900/60 via-transparent to-transparent"
      />
      {/* live aurora lighting */}
      <div aria-hidden className="luxin-aurora" />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href="#" className="flex items-center gap-3">
            <Image
              src="/luxin-logomark.svg"
              alt="Luxin"
              width={24}
              height={24}
              priority
              className="opacity-90"
            />
            <span className="text-sm tracking-widest text-zinc-400">LUXAI</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-zinc-400 sm:flex">
            <Link
              href="#features"
              className="link-glow hover:text-zinc-200 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#integrations"
              className="link-glow hover:text-zinc-200 transition-colors"
            >
              Integrations
            </Link>
            <Link
              href="#request"
              className="btn-neo rounded-full bg-white px-4 py-2 text-black transition-colors hover:bg-white/90 luxin-glow"
            >
              Request Access
            </Link>
            <SearchButton />
            <AuroraToggle />
          </nav>
        </div>
      </header>
      {/* Hero */}
      <main>
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <h1 className="luxin-gradient-text text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Luxin — the AI‑powered lighting OS
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-zinc-400 sm:text-lg">
            Automate scenes, adapt to daylight, and optimize energy. Simple
            setup, powerful control, open integrations.
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
            <Link
              href="#request"
              className="btn-neo rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90 luxin-glow"
            >
              Request Access
            </Link>
          </div>
          <ul
            id="features"
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400"
          >
            <li>Autonomous scenes</li>
            <li className="luxin-sep hidden sm:block">•</li>
            <li>Adaptive circadian</li>
            <li className="luxin-sep hidden sm:block">•</li>
            <li>Energy optimization</li>
            <li className="luxin-sep hidden sm:block">•</li>
            <li>Open integrations</li>
          </ul>
        </section>

        {/* Request Access */}
        <section id="request" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-xl font-medium text-zinc-100">
              Get early access
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Leave your email. We’ll invite you soon.
            </p>
            <div className="mt-5">
              <RequestAccess />
            </div>
          </div>
        </section>

        {/* Integrations (simple) */}
        <section id="integrations" className="mx-auto max-w-6xl px-6 pb-24">
          <p className="text-sm text-zinc-500">
            Works with Matter, HomeKit, MQTT, REST, and Graph APIs.
          </p>
        </section>

        {/* Developer CLI & Data */}
        <section id="cli" className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="text-xl font-medium text-zinc-100">
            Developer CLI & Data
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Ship faster with the Luxin CLI, typed schema, and exportable
            telemetry. Automate provisioning, sync scenes across environments,
            and stream lighting metrics to your data stack.
          </p>
          <div className="mt-4 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
            <Card3D className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-zinc-200">CLI</p>
              <p className="mt-1">
                `luxin init`, `luxin deploy`, `luxin scenes push`.
              </p>
            </Card3D>
            <Card3D className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-zinc-200">Data & Telemetry</p>
              <p className="mt-1">
                Realtime events via Webhook, MQTT, or SSE. Daily exports to S3.
              </p>
            </Card3D>
            <Card3D className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-zinc-200">SDK</p>
              <p className="mt-1">
                Typed JS/TS SDK for scenes, devices, and schedules.
              </p>
            </Card3D>
          </div>
        </section>
        {/* AI Tasks (experimental flows; wire to real APIs later) */}
        <section id="ai" className="mx-auto max-w-6xl px-6 pb-24 cv-auto">
          <h2 className="text-xl font-medium text-zinc-100">AI Tasks</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Experiment with LUXAI’s upcoming task flows.
          </p>
          <div className="mt-4 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
            <Card3D className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-zinc-200">Scene Composer</p>
              <p className="mt-1">Describe a vibe; we propose a scene.</p>
              <a
                href="#composer"
                className="btn-neo mt-3 inline-block rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-black hover:bg-white active:translate-y-0.5"
              >
                Try Prompt
              </a>
            </Card3D>
            <Card3D className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-zinc-200">Energy Saver</p>
              <p className="mt-1">Optimize output within comfort windows.</p>
              <button className="btn-neo mt-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-black hover:bg-white active:translate-y-0.5">
                Simulate
              </button>
            </Card3D>
            <Card3D className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-zinc-200">Circadian Tuner</p>
              <p className="mt-1">Auto‑tune per room and latitude.</p>
              <button className="btn-neo mt-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-black hover:bg-white active:translate-y-0.5">
                Preview
              </button>
            </Card3D>
          </div>
        </section>
        {/* Composer preview (client-side mock; replace with backend proposal service) */}
        <section id="composer" className="mx-auto max-w-6xl px-6 pb-24 cv-auto">
          <h2 className="text-xl font-medium text-zinc-100">Compose a Scene</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Use natural language or tune sliders to preview a scene.
          </p>
          <div className="mt-4">
            <SceneComposer />
          </div>
        </section>

        {/* Ideas backlog (non-functional; informs roadmap) */}
        <section id="ideas" className="mx-auto max-w-6xl px-6 pb-24 cv-auto">
          <h2 className="text-xl font-medium text-zinc-100">
            Ideas We’re Exploring
          </h2>
          <ul className="mt-3 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
            <li className="rounded-md border border-white/10 bg-white/5 p-4 transition-transform hover:-translate-y-0.5">
              Auto‑tuned circadian profiles per room and latitude
            </li>
            <li className="rounded-md border border-white/10 bg-white/5 p-4 transition-transform hover:-translate-y-0.5">
              AI scene composer from natural language prompts
            </li>
            <li className="rounded-md border border-white/10 bg-white/5 p-4 transition-transform hover:-translate-y-0.5">
              Adaptive energy saver that respects comfort windows
            </li>
            <li className="rounded-md border border-white/10 bg-white/5 p-4 transition-transform hover:-translate-y-0.5">
              Open spec for portable scenes across vendors
            </li>
          </ul>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-6xl px-6 pb-28">
          <h2 className="text-xl font-medium text-zinc-100">About</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Luxin is built by Amjad Althabeth, founder. We’re on a mission to
            make lighting effortless, adaptive, and energy‑smart — from homes to
            studios. If this resonates, say hello and tell us about your setup.
          </p>
        </section>
      </main>
      {/* Global overlays */}
      <CommandPalette />
      <OSModal />
      <Dock />
      <Toasts />
      <LuxConsole />\r\n      <CommandBridge />

      <footer className="px-6 py-10 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} LuxAI
      </footer>
    </div>
  );
}



