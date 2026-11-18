# TECH_STACK
 
## Guiding choice
Fully client-side for v1. No backend, no database, free static hosting.
 
## Frontend
| Concern | Choice | Why |
|---|---|---|
| Framework | React 18 + Vite + TypeScript | Fast dev, huge ecosystem |
| Styling | Tailwind CSS + CSS variables for tokens | Quick, consistent theming |
| State | Zustand | Tiny, simple stores for session/editor |
| Animation | Framer Motion (UI), CSS for countdown | Smooth, respects reduced motion |
| Routing | React Router (or single page with steps) | Few screens |
 
## Camera and imaging
- **getUserMedia / MediaStream API** for camera
- **Canvas 2D API** for capture frames, filters, strip composition, export
- **Canvas filters**: `ctx.filter` where supported, with a pixel-manipulation fallback (Safari)
- **Editor layer**: Konva.js (react-konva) for draggable/resizable/rotatable stickers, or Fabric.js as alternative. Recommendation: **Konva**
- **Export**: `canvas.toBlob()` for PNG/JPG, **jsPDF** for PDF
## Remote mode (v1.5)
- **WebRTC** via **PeerJS** (simplest) or raw RTCPeerConnection
- Signaling: PeerJS cloud (free) to start; later Supabase Realtime or a tiny Cloudflare Worker
- STUN: Google public; TURN: Cloudflare/Metered free tier if needed
- Data channel for countdown sync and photo transfer
## Tooling
- pnpm, ESLint, Prettier, TypeScript strict
- Vitest + React Testing Library, Playwright (with fake camera flags)
- Husky + lint-staged (optional)
## Hosting and CI
- Vercel / Netlify / Cloudflare Pages (HTTPS included, required for camera)
- GitHub Actions: lint, typecheck, test, build
## Assets
- Mascots: original SVG (drawn in Figma/Illustrator) or CC0 packs
- Fonts: Google Fonts (e.g. Fredoka, Quicksand), self-hosted for performance
## Alternatives considered
- Next.js: unnecessary, no SSR needs
- Fabric.js: heavier, fine alternative to Konva
- html2canvas for export: rejected, less accurate than direct canvas composition
 