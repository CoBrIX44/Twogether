# DESIGN_SYSTEM
 
## Vibe
Cute, warm, playful, a little retro-photobooth. Soft shapes, pastel colours, friendly mascots. Never cluttered; the camera and the strip are the hero.
 
## Colour tokens
```css
:root {
  --bg: #FFF7F9;          /* cream blush */
  --surface: #FFFFFF;
  --ink: #3B2A35;         /* soft plum-black text */
  --muted: #8A7683;
  --pink: #FF9EC4;
  --pink-deep: #F0629A;   /* primary action */
  --lavender: #C9B6F2;
  --lavender-deep: #9A7BE0;
  --mint: #BFEBD8;
  --butter: #FFE9A8;
  --danger: #E5484D;
  --focus: #7B5CF0;
}
/* Dark UI variant: --bg #1F1620, --surface #2A1F2D, --ink #FBEFF5 */
```
Check contrast: body text 4.5:1 minimum; primary buttons use `--pink-deep` with white text, verify AA.
 
## Typography
- Display: **Fredoka** (rounded, friendly)
- Body: **Quicksand** or **Nunito**
- Scale: 12 / 14 / 16 / 20 / 28 / 40 / 64 (countdown)
## Shape and spacing
- Spacing scale: 4, 8, 12, 16, 24, 32, 48
- Radius: 12 (cards), 999 (pill buttons), 20 (camera panels)
- Shadows: soft, tinted pink (`0 8px 24px rgba(240,98,154,.18)`)
- Photobooth touches: dashed strip borders, film-sprocket accents, curtain motif on landing
## Components
- **Button**: primary (pink-deep), secondary (outline), icon button; large pill shutter button with ring pulse
- **CameraPanel**: rounded frame, name tag, mirror badge, status dot (remote)
- **Countdown**: giant number, scale-and-fade animation, flash overlay
- **FilterChip**: thumbnail + label, selected ring
- **StickerTray**: grid, categories as tabs, bottom sheet on mobile
- **Toolbar**: undo, redo, duplicate, layer up/down, delete
- **Dialog / Toast / Tooltip**
- **Stepper**: Capture, Review, Customise, Export
## Mascots
Small original cast (e.g. a bunny, bear, cat, star blob) in 2-3 expressions each, flat pastel style with thick soft outlines, delivered as SVG. Keep a consistent stroke width.
 
## Motion
- 150-250 ms UI transitions, spring for stickers
- Countdown pop, flash 120 ms, strip "prints out" sliding down
- Honour `prefers-reduced-motion`: swap to fades
## Responsive
Mobile first. Panels stack side by side even on phones (portrait crops, 3:4 each); on very narrow screens allow vertical stacking toggle. Touch targets at least 44 px.
 
## Accessibility
Visible focus ring, aria-live for countdown, labels on every icon button, keyboard shortcuts (Space = shutter), alt text for stickers.
 