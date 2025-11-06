# Luxin â€” Master TODO and Runbook

This is the authoritative checklist the agent must follow before any change. Update statuses inline.

## 0) Preflight (must complete in order)
- [x] Confirm Node: `node -v` (>= 18.18 or 20+) â€” note: user env
- [x] Clean install: `npm ci`
- [x] Lint: `npm run lint`
- [x] Typecheck (implicit in Next 16 build): `npm run build` (dry run OK if timeâ€‘constrained)
- [x] Dev up: `npm run dev` â€” server starts (open http://localhost:3000)

Notes:
- Use `npm ci` (not `npm install`) for reproducibility.
- If build is slow, you may skip full build during rapid iteration but must run before PR/commit.

## 1) Branding and Theme Tokens
- [x] Review neon palette vars in `src/app/globals.css` (luxinâ€‘cyan/violet/blue/green)
- [x] Verify dark base, vignette, and noise overlays are present
- [x] Ensure Tailwind classes rely on tokens; avoid hardâ€‘coded hex in JSX except accents

## 2) Header and Hero
- [x] Header links and CTA labels finalized
- [x] Logo SVG present: `public/luxin-logomark.svg`
- [x] Hero title/tagline match brand voice
- [x] CTA targets exist and are navigable (CTA â†’ #request)

## 3) Feature Chips and Grid
- [x] Chips show 4 key value props
- [x] Feature grid has 4 cards with neon icons
- [x] Copy reviewed for brevity and clarity

## 4) Effects and Motion (Minimal Theme)
- [x] Minimal dark theme baseline maintained; added subtle live aurora effect
- [x] Ensure high contrast and clean focus states
- [x] Performance: validated in dev tools (GPU‑only transforms; content-visibility on heavy sections)
  - Added 3D hover cards, shimmering CTAs, gradient text; verified reduced-motion respects static fallback
  - Added header toggle to enable/disable aurora; persisted with localStorage
  - Added CTA glow and form loading spinner for micro‑interactions

## 5) Content, SEO, and Sharing
- [x] Metadata set in `src/app/layout.tsx`
- [x] Add OG image (optional): `public/og.svg` and metadata wired
- [ ] Update README with preview and deploy steps (optional)
  - Added sections: Developer CLI & Data, Ideas, and About (founder: Amjad Althabeth)
  - Set `metadataBase` default to `https://luxinai.dev` (override with `NEXT_PUBLIC_SITE_URL`)

## 6) Forms and Integrations (optional next)
- [x] Add â€œRequest Accessâ€ form with email capture (`src/components/RequestAccess.tsx`)
- [x] Wire to endpoint (`app/api/request/route.ts`) â€” logs email serverâ€‘side
- [x] Success/failure states and basic validation
- [x] Add Integrations strip (placeholder chips)

## 7) QA Checklist
- [x] Responsive: 360px → 1440px (spot‑checked hero, cards, composer)
- [x] Keyboard focus states visible; accessible contrast (focus ring + color)
- [ ] Vercel preview build ok

## 8) Deploy
- [x] `npm run build` passes
- [x] Deploy target chosen (Vercel)
- [x] Environment variables documented (NEXT_PUBLIC_SITE_URL)

---

## Runbook: Common Commands (use in this order)
1. `npm ci`
2. `npm run lint`
3. `npm run dev`
4. Iterate changes (small diffs only)
5. `npm run build`

## Change Log Notes (append brief notes here)
- [x] Initial landing page redesign applied (date: today, by: agent)
- [x] Tokens reviewed and accepted (date: today, by: agent)
- [x] Fix ESLint error in `RequestAccess` by typing `catch` as `unknown` and narrowing (date: today, by: agent)
- [x] Ran clean install with `npm ci` successfully (date: today, by: agent)
- [x] Verified dev server starts at http://localhost:3000 (date: today, by: agent)
- [x] Updated Luxin logo gradient: replaced blue/purple with green/amber (date: today, by: agent)
- [x] Added Developer CLI & Data, Ideas, and About sections to homepage (date: today, by: agent)
- [x] Switched metadata base URL from localhost to LuxinAI domain with env override (date: today, by: agent)
- [x] Introduced subtle live â€œauroraâ€ lighting effect (CSS-only, reduced-motion aware) (date: today, by: agent)
- [x] Added Aurora toggle in header with persistence (date: today, by: agent)
- [x] Hardened metadataBase URL handling to avoid TypeError when env lacks scheme (date: today, by: agent)
- [x] Request form UX: timeout + spinner + aria-live + clearer errors (date: today, by: agent)
- [x] API `OPTIONS` with permissive CORS to mitigate Failed to fetch in static/preview hosts (date: today, by: agent)
- [x] Ran lint and build successfully postâ€‘changes (date: today, by: agent)



- [x] Added Scene Composer, Command Palette, background grid; polished CTA and nav interactions (date: today, by: agent)
- [x] Added Open Graph image and Twitter card metadata (date: today, by: agent)
- [x] Performance pass: content-visibility on heavy sections; cleaned command palette logic; removed stray artifacts in AI Tasks (date: today, by: agent)

