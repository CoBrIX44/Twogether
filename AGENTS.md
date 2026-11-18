# AGENTS.md
 
Instructions for AI coding agents (Claude Code, Codex, Cursor, etc.) working on Duo Booth.
 
## Read first
PROJECT.md, SCOPE.md, TECH_STACK.md, ARCHITECTURE.md, then the relevant task in TASKS.md.
 
## Commands
```bash
pnpm install
pnpm dev          # local dev server
pnpm build        # production build
pnpm test         # unit tests (Vitest)
pnpm test:e2e     # Playwright
pnpm lint && pnpm typecheck
```
 
## Rules
1. Stay inside SCOPE.md. If a request isn't in scope, add it to the backlog and ask.
2. TypeScript strict mode. No `any` unless commented why.
3. Photos are private: never send image data to a server or third party. No analytics that capture images.
4. All image work happens on `<canvas>`; keep rendering logic in `src/lib/render/`, not inside components.
5. Keep components small; state lives in the Zustand stores, not scattered `useState` for shared data.
6. Use design tokens from DESIGN_SYSTEM.md; no hard-coded colours.
7. Every feature needs tests per TESTING_STRATEGY.md and must meet DEFINITION_OF_DONE.md.
8. Mobile first: test at 375px width before desktop.
9. Respect accessibility: labels, focus states, `prefers-reduced-motion`.
10. Only original or CC0 assets. Record the source in `public/assets/LICENSES.md`.
## Conventions
- Files: `kebab-case`, components `PascalCase.tsx`
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`)
- One task per branch/PR, referencing the TASKS.md ID
## Don't
- Don't add a backend for v1
- Don't add heavy dependencies without noting bundle-size impact
- Don't change the strip layout spec without updating FEATURES.md and ARCHITECTURE.md
## When unsure
Prefer the simplest approach that satisfies the PRD, and leave a short note in the PR.
 