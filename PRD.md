# PRD: Duo Booth
 
## 1. Problem
People want the fun of a photo booth strip with a partner or friend, without needing a physical booth, and long-distance pairs can't share one at all.
 
## 2. Goals
- G1: Capture a 3-shot, two-person strip with a shared countdown
- G2: Produce a booth-style strip automatically
- G3: Let users personalise (filters, mascots, frame) with an easy editor
- G4: Export in JPG, PNG, PDF with good print quality
- G5: Work on phone and desktop browsers, no account
## 3. Non-goals (v1)
Video/GIF booth, user accounts, cloud galleries, social feed, paid stickers, AR face tracking.
 
## 4. Personas
- **Mia & Arjun (couple, same room)**: want a quick cute strip on one phone.
- **Long-distance pair**: want to take it together in real time.
- **Creator**: wants aesthetic, shareable output.
## 5. Functional requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| FR1 | Request camera permission, show two side-by-side live panels | P0 |
| FR2 | Shutter button starts 3-2-1 countdown, captures a shot, repeats until 3 rounds done | P0 |
| FR3 | Retake a single frame before finishing | P1 |
| FR4 | Compose strip from 6 photos (3 rows x 2) in a template | P0 |
| FR5 | Filters: B&W, pink, lavender, sepia, warm, cool, none (live preview on result) | P0 |
| FR6 | Mascots/stickers: add, drag, resize, rotate, delete, layer | P0 |
| FR7 | Frame/template colour and style options, date/caption text | P1 |
| FR8 | Download JPG, PNG, PDF | P0 |
| FR9 | Remote mode: room code, P2P video, synced countdown | P1 (v1.5) |
| FR10 | Mirror toggle, camera switch (front/back) | P1 |
| FR11 | Share via native share sheet on mobile | P2 |
 
## 6. Non-functional requirements
- Capture-to-strip render under 2 s
- Export resolution at least 1200 x 3600 px (strip), PDF at print-ready 300 dpi sizing option
- Works on latest Chrome, Safari (iOS 16+), Firefox, Edge
- Accessible: keyboard operable controls, visible focus, alt text, reduced-motion respect
- Privacy: no upload by default; remote mode streams are P2P
## 7. Key decisions to confirm
1. Strip layout: 3 rows x 2 columns (each row = same moment from both cams). Default.
2. Filters apply to the whole strip, with optional per-photo override later.
3. Same-device mode ships first, remote mode follows.
## 8. Metrics (privacy-friendly, optional)
Completion rate (open to download), downloads by format, average session time, remote-room success rate.
 
## 9. Risks
- Camera permission denial on iOS Safari
- WebRTC failing behind strict NATs (needs TURN)
- Large canvas memory limits on older phones
- Sticker asset licensing (use original or CC0 art)
 