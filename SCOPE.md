# SCOPE
 
## In scope: MVP (v1)
- Same-device capture, two side-by-side camera panels (or one camera split into two person slots)
- 3-2-1 countdown, 3 rounds, flash effect, shutter sound (mutable)
- Auto-composed strip (3 rows x 2 columns)
- 6 filters + none
- 8-12 original mascots/stickers, drag/resize/rotate/delete
- 4-6 strip colour themes, optional caption + date
- Export JPG, PNG, PDF
- Responsive, mobile-first UI
- Fully client-side, no backend
## In scope: v1.5
- Remote Together mode (room code, WebRTC, synced countdown)
- Retake individual frame
- Per-photo filters
- Native share sheet
- More templates (2x2 grid, polaroid, heart frame)
## Out of scope (for now)
- User accounts, login, cloud storage, galleries
- Video/GIF/boom booth
- AR face-tracked accessories
- Payments, premium packs
- Group of more than 2 people
- Native mobile apps
- Server-side image processing
- Moderation/social features
## Assumptions
- Users have a camera and a modern browser
- HTTPS is available (required for camera access)
- Stickers are original or CC0
## Constraints
- Solo developer, student project timeline
- Free-tier hosting (Vercel/Netlify/Cloudflare Pages)
- Free STUN; TURN only if remote mode proves unreliable
## Change control
Anything not listed under "In scope" goes to the backlog in TASKS.md before being built.
 