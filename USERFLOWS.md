# USER_FLOWS
 
## Flow 1: Same-device booth (MVP happy path)
1. **Landing**: tagline, big "Start booth" button
2. **Mode select**: Same device / Together online (disabled "coming soon" in MVP)
3. **Camera permission**: friendly explainer, then browser prompt
4. **Setup**: two live panels, mirror toggle, camera picker, tips ("stand close, good light")
5. **Capture**: user taps shutter
   - 3 -> 2 -> 1 countdown, flash, snap
   - Round dots update (1/3)
   - Short pause, repeat until 3/3
6. **Review**: contact sheet of the 6 photos, tap a round to retake (P1), "Looks good" button
7. **Strip preview**: auto-composed strip appears with a small reveal animation
8. **Customise**: tabs for Filters / Frame / Stickers / Text
   - Pick filter, see it live
   - Pick colour theme
   - Add mascot, drag/resize/rotate
   - Add caption/date
9. **Export**: choose JPG / PNG / PDF, quality, then Download
10. **Done**: confetti, "Make another" / "Start over" (clears frames from memory)
## Flow 2: Together online (v1.5)
1. Choose "Together online"
2. Host: "Create room" -> code + shareable link
3. Guest: opens link or enters code -> grants camera
4. Both see two panels (own + partner), connection indicator
5. Host presses shutter; both see synced countdown; 3 rounds
6. Host sees the composed strip; guest sees it too (view-only or shared edit in v2)
7. Either can download their copy
Edge: guest leaves mid-session -> pause, offer wait or switch to same-device mode.
## Flow 3: Permission denied
Camera blocked -> explain how to enable in browser settings (with per-browser tips) -> "Try again" button.
 
## Flow 4: Interrupted session
Tab backgrounded or screen locked mid-countdown -> countdown cancels, shots kept, resume at current round.
 
## Flow 5: Mobile editing
Sticker tray as bottom sheet, canvas fills the screen, handles sized for fingers, pinch to resize.
 
## Screen list
Landing, Mode select, Permission, Capture, Review, Customise, Export, Error states, (Room lobby for remote).
 
## Navigation rules
Back never loses captured photos without confirmation. "Start over" asks to confirm.
 