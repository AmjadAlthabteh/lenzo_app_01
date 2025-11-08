# LuxAI — AI-Powered Lighting OS

LuxAI (Luxin) is an AI-powered lighting operating system that brings autonomous scenes, adaptive circadian lighting, energy optimization, and open integrations to smart lighting systems.

## Features

- **Autonomous Scenes** — Automate lighting scenes based on context and preferences
- **Adaptive Circadian** — Auto-tune lighting per room and latitude for optimal circadian rhythm
- **Energy Optimization** — Optimize output within comfort windows to save energy
- **Open Integrations** — Works with Matter, HomeKit, MQTT, REST, and Graph APIs
- **Developer CLI** — Ship faster with typed schema, exportable telemetry, and automation tools

## Tech Stack

This project is built with:
- [Next.js 16](https://nextjs.org) - React framework
- [React 19](https://react.dev) - UI library
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com) - Styling
- [Geist Font](https://vercel.com/font) - Typography

## Getting Started

First, install dependencies:

```bash
npm ci
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Development

```bash
npm run dev       # Start dev server
npm run dev:3003  # Start dev server on port 3003
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run lux       # Run Luxin CLI tool
```

## Project Structure

```
lighting-os/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── layout.tsx    # Root layout with metadata
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles and theme tokens
│   ├── components/       # React components
│   ├── lib/              # Utilities and libraries
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── docs/                 # Documentation
└── tools/                # Build and dev tools
```

## Code Guidelines

Before making changes, please review:
- `AGENTS.md` — Agent workflow and code standards
- `docs/TODO.md` — Project checklist and runbook
- Use TypeScript strict mode
- Prefer Tailwind utilities over custom CSS
- Keep components in `src/components/` with PascalCase filenames
- Follow the preflight → plan → implement → validate → document workflow

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy (Vercel)

1) Push this repo to GitHub
   - git init
   - git add -A && git commit -m "LuxAI frontend"
   - Create a repo on GitHub and push: `git remote add origin <url>` then `git push -u origin main`

2) Import in Vercel
   - New Project ? Import GitHub repo
   - Framework: Next.js (auto)
   - Build command: `next build` (auto)
   - Output: `.vercel/output` (auto)

3) Env vars
   - Production ? `NEXT_PUBLIC_SITE_URL = https://luxai.dev`
   - Preview (optional) ? `NEXT_PUBLIC_SITE_URL = https://<project>-<hash>.vercel.app`

4) Domain (luxai.dev)
   - Project ? Settings ? Domains ? Add `luxai.dev`
   - DNS Option A (keep registrar DNS):
     - `@` (apex) A ? `76.76.21.21`
     - `www` CNAME ? `cname.vercel-dns.com`
     - In Vercel, set `www.luxai.dev` to redirect to apex
   - DNS Option B (Vercel DNS): switch nameservers to Vercel�s NS, then add the domain

5) Redirect www ? apex
   - Already included `vercel.json` host redirect for `www.luxai.dev` ? `luxai.dev`

6) Verify
   - Visit the preview URL (vercel.app) first
   - Promote to Production and confirm `https://luxai.dev`

7) Local dev tips
   - `.env.local` uses `http://luxai.local:3000` so you can preview locally with a hosts entry.

