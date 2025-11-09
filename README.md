Lenso
=====

AI-powered platform for sharing photos and videos anonymously. Upload moments and let AI handle organization, tagging, and moderation automatically.

Tech stack
----------
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS  <- css
- Edge API route for AI (OpenAI) — summarize + moderation
- NextAuth (GitHub + Guest) with Prisma adapter
- Prisma + SQLite for local dev
- SSE real-time feed updates
- AI Task Manager pipeline gating posts
- VS Code recommendations and sane defaults

Getting started
---------------
1) Prereqs: Node.js 18+ and npm
2) Install deps: `npm install`
3) Copy env: `cp .env.example .env.local` and set:
   - `OPENAI_API_KEY`
   - Optional GitHub OAuth: `GITHUB_ID`, `GITHUB_SECRET`
   - `DATABASE_URL="file:./dev.db"` (SQLite default)
   - Optional S3: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET`
4) Generate Prisma client: `npm run prisma:generate`
5) Push DB schema: `npm run db:push`
6) Run dev server: `npm run dev`
7) Open `http://localhost:3000`

Project structure
-----------------
- `app/` — App Router pages and API routes
  - `page.tsx` — Landing page
  - `feed/page.tsx` — Mock feed
  - `upload/page.tsx` — Upload form with AI and publish
  - `api/ai/summarize/route.ts` — Calls OpenAI to summarize + tag
  - `api/ai/moderate/route.ts` — OpenAI moderation
  - `api/posts` — list posts
  - `api/posts/create` — create post (moderation + broadcast)
  - `api/rt/stream` — SSE stream for real-time updates
  - `api/upload/s3` — presigned S3 upload
- `components/` — UI building blocks
- `app/globals.css` — Tailwind + base styles
 - `lib/aiTaskManager.ts` — AI gating pipeline (moderation → summarize/tags)

AI setup
--------
- Create an OpenAI API key and set it in `.env.local`.
- The summarize route uses `gpt-4o-mini` by default; change the model if needed.

Next steps
----------
- Media storage: integrate S3 pre-signed uploads or UploadThing.
- Profiles: add profile editor and handles.
- Real-time: persist to a message bus (Pusher/Ably) for multi-instance.
- Moderation: expand to image/video when storage is wired.
- UI polish: consider shadcn/ui and dedicated upload component.
- Strict mode: extend AI Task Manager to handle media moderation when storage is ready.

Local .dev domain (optional)
----------------------------
If you want to use `https://lenso.dev` locally:

1) Hosts entry (run editor as Administrator):
   - File: `C:\\Windows\\System32\\drivers\\etc\\hosts`
   - Add: `127.0.0.1 lenso.dev`
2) TLS certs (mkcert):
   - Install mkcert: `choco install mkcert` (or `scoop install mkcert`)
   - Trust CA: `mkcert -install`
   - Make certs: `mkcert lenso.dev` (creates `lenso.dev.pem` and `lenso.dev-key.pem`)
3) HTTPS proxy (choose one):
   - local-ssl-proxy: `npx local-ssl-proxy --source 443 --target 3000 --cert .\\lenso.dev.pem --key .\\lenso.dev-key.pem`
   - or Caddy:
     Caddyfile:
     lenso.dev {\n       tls .\\lenso.dev.pem .\\lenso.dev-key.pem\n       reverse_proxy localhost:3000\n     }
4) Env:
   - Set `NEXT_PUBLIC_BASE_URL=https://lenso.dev`
   - Set `NEXTAUTH_URL=https://lenso.dev`
5) Run:
   - `npm run dev` then visit `https://lenso.dev`

Features
--------
- Anonymous photo/video sharing - no profiles, no followers
- AI-powered smart summaries and auto hashtag generation
- Automatic content moderation using OpenAI
- Real-time feed updates with Server-Sent Events
- Modern glassmorphism UI with Tailwind CSS
- Cloud storage integration with S3
