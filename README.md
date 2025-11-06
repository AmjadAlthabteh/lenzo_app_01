This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

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
   - DNS Option B (Vercel DNS): switch nameservers to Vercel’s NS, then add the domain

5) Redirect www ? apex
   - Already included `vercel.json` host redirect for `www.luxai.dev` ? `luxai.dev`

6) Verify
   - Visit the preview URL (vercel.app) first
   - Promote to Production and confirm `https://luxai.dev`

7) Local dev tips
   - `.env.local` uses `http://luxai.local:3000` so you can preview locally with a hosts entry.

