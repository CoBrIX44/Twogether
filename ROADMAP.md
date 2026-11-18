# ROADMAP
 
Build the whole local pipeline first (capture to export), then add remote play. Timeline assumes one student developer, part-time; adjust as needed.
 
## Phase 0: Foundations (week 1)
- Pick name, set up repo, Vite + React + TS + Tailwind, lint/test/CI
- Design tokens, fonts, basic layout, landing page
- Camera proof of concept (getUserMedia on desktop + iOS Safari + Android Chrome)
**Exit:** live camera shows in the deployed site over HTTPS.
## Phase 1: Capture (weeks 2-3)
- Two-panel capture UI, mirror, camera switch
- Countdown 3-2-1, flash, sound, 3 rounds, progress dots
- Frame store, review screen
**Exit:** user captures 6 frames reliably on phone and desktop.
## Phase 2: Strip and filters (weeks 3-4)
- Template JSON + composeStrip()
- Colour themes, caption/date
- 6 filters with live previews (cross-browser fallback)
**Exit:** strip auto-generates with chosen filter and theme.
## Phase 3: Editor and export (weeks 5-6)
- Konva stage, sticker tray, 8-12 original mascots
- Drag/resize/rotate/delete/layer/flip
- JPG, PNG, PDF export
**Exit: MVP (v1.0)**, shareable with friends, passes DEFINITION_OF_DONE.
## Phase 4: Polish and launch (week 7)
- Onboarding tooltips, error states, accessibility pass, performance pass
- Open Graph image, favicon, privacy note, analytics-free feedback form
- Soft launch to friends and classmates, collect feedback
## Phase 5: Together mode (weeks 8-11) - v1.5
- PeerJS room create/join, link sharing
- Synced countdown with clock-skew handling
- Photo transfer from guest to host, composition on host
- Reconnect handling, TURN fallback test
**Exit:** two people on different networks complete a strip.
## Phase 6: Extras (later)
Extra templates, undo/redo, retake round, per-photo filters, intensity slider, custom text stickers, share sheet, PWA, seasonal sticker packs, GIF/boomerang strip, user-uploaded stickers.
 
## Risks to watch
- iOS Safari camera quirks (do early, in Phase 0)
- Canvas filter support on Safari
- WebRTC NAT traversal
- Artwork production time for mascots (start drawing in Phase 1)
 