Lenso — starter
================

Share the experiences you witness so others can feel like they were there.

Tech stack
----------
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
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
