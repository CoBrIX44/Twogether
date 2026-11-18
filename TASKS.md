# TASKS

Status: [ ] todo, [~] in progress, [x] done. Reference the ID in branches and PRs.

## Phase 0: Foundations
- [x] T-001 Init repo, Vite + React + TS, pnpm
- [x] T-002 Tailwind + design tokens (DESIGN_SYSTEM.md)
- [x] T-003 ESLint, Prettier, Vitest, Playwright, GitHub Actions
- [x] T-004 Deploy to Vercel/Netlify over HTTPS
- [x] T-005 Camera PoC tested on Chrome, Safari iOS, Chrome Android
- [x] T-006 Landing page + app shell + step navigation

## Phase 1: Capture
- [x] T-010 `useCamera` hook (permissions, errors, device list, cleanup)
- [x] T-011 CameraPanel component (mirror, name tag, aspect crop)
- [x] T-012 Two-panel layout, responsive
- [x] T-013 Permission explainer + denied-state screen
- [x] T-014 Countdown component (3-2-1, aria-live, reduced motion)
- [x] T-015 CaptureEngine: timing, flash, frame grab to ImageBitmap / DataURL
- [x] T-016 3-round sequence + progress dots + pause between rounds
- [x] T-017 Shutter sound + mute toggle
- [x] T-018 sessionStore / frame store (3x2)
- [x] T-019 Review screen (contact sheet)

## Phase 2: Strip and filters
- [x] T-020 Template JSON schema + classic 3x2 template
- [x] T-021 `composeStrip()` offscreen canvas at export resolution
- [x] T-022 Colour themes (6) + caption/date text
- [x] T-023 Filter presets: B&W, pink, lavender, sepia, warm, cool
- [x] T-024 Safari fallback for canvas filters
- [x] T-025 Filter picker UI with live thumbnails

## Phase 3: Editor and export
- [x] T-030 Konva / transform stage over composed strip
- [x] T-031 Sticker tray UI (tabs, bottom sheet on mobile)
- [x] T-032 Create/collect 8-12 original mascot/accessory SVGs + LICENSES.md
- [x] T-033 Add/move/resize/rotate/delete stickers (touch + mouse)
- [x] T-034 Layer order, duplicate, flip
- [x] T-035 Flatten stage to final canvas
- [x] T-036 Export PNG and JPG (`toBlob`)
- [x] T-037 Export PDF (jsPDF), strip size + print size option
- [x] T-038 Download dialog, filename pattern, completion screen

## Phase 4: Polish
- [x] T-040 Onboarding tips and guidance
- [x] T-041 Error and edge states (no camera, camera busy, tab hidden)
- [x] T-042 Accessibility audit (keyboard, contrast, screen reader)
- [x] T-043 Performance pass (bundle size, memory release, low-end phone)
- [x] T-044 SEO/OG tags, favicon, privacy note
- [x] T-045 Ready for beta & user testing

## Phase 5: Together mode (v1.5 Planned)
- [ ] T-050 PeerJS setup, room create/join, share link
- [ ] T-051 Remote video in right panel + connection status
- [ ] T-052 Clock-skew measurement + synced countdown
- [ ] T-053 Guest frame transfer over data channel (chunked JPEG)
- [ ] T-054 Host composition and result sharing
- [ ] T-055 Disconnect/reconnect handling, TURN fallback
- [ ] T-056 E2E test with two browser contexts

## Backlog (unscheduled)
Retake round, undo/redo, extra templates, per-photo filters, intensity slider, custom text stickers, share sheet, PWA, pose prompts, GIF strip.