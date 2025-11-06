# AGENTS.md — Luxin Repo Agent Guide

Scope: Entire repository.

This file defines how agents must work in this repo. Follow these steps before writing code.

## Protocol
- Always read and follow `docs/TODO.md` before any changes.
- Update checkboxes in `docs/TODO.md` to reflect progress with concise notes.
- Keep diffs minimal and scoped. Do not refactor unrelated code.
- Prefer Tailwind utility classes and `globals.css` tokens over ad‑hoc styles.
- Validate with the Runbook commands in the order given.

## Required Order of Operations
1) Preflight: environment, install, lint, typecheck. See `docs/TODO.md`.
2) Plan: update the active section checklist with the intended steps.
3) Implement: make focused changes, referencing the plan items.
4) Validate: run lint/build and visual check instructions.
5) Document: update `docs/TODO.md` status and note any follow‑ups.

## Code Style
- Use TypeScript strictness from `tsconfig.json`.
- Prefer server components in App Router unless client interactivity is needed.
- Keep CSS in `src/app/globals.css` using variables and Tailwind v4 `@theme`.
- Components live under `src/` with PascalCase filenames.

## Definition of Done
- All items in the active checklist are checked or deferred with rationale.
- `npm run lint` passes with no new warnings.
- `npm run build` completes.
- Visual QA reviewed against design notes in `docs/TODO.md`.

