# TESTING_STRATEGY
 
## Pyramid
1. **Unit (Vitest)**: pure logic
2. **Component (React Testing Library)**: UI behaviour
3. **E2E (Playwright)**: full flows with a fake camera
4. **Manual device testing**: real phones and browsers
5. **Visual regression (optional)**: strip render snapshots
## Unit tests
- Countdown timing logic (uses fake timers)
- CaptureEngine round sequencing (3 rounds, 2 slots, retake replaces correct slot)
- Template parsing and slot geometry
- `composeStrip()` output dimensions and slot placement (compare against snapshot pixels at key points)
- Filter presets map to expected canvas filter strings
- Sticker transform math (resize, rotate, bounds)
- Filename generator, export format selection
- Remote: clock-skew calculation, message schema validation (v1.5)
## Component tests
- Permission denied screen shows instructions and retry
- Shutter disabled until both panels ready
- Countdown announces via aria-live, honours reduced motion
- Filter picker selects one at a time
- Sticker tray adds a sticker to the stage
## E2E (Playwright)
Run Chromium with `--use-fake-device-for-media-stream --use-fake-ui-for-media-stream` and a looping test video.
- Happy path: start -> capture 3 rounds -> customise -> download PNG/JPG/PDF (assert file exists, type, dimensions)
- Permission denied path
- Mobile viewport (375x812) run of the happy path
- Refresh mid-flow behaviour
- Remote (v1.5): two browser contexts join a room, synced countdown within 300 ms, strip generated
## Manual device matrix
| Device | Browser |
|---|---|
| iPhone (iOS 16+) | Safari, Chrome |
| Android mid-range | Chrome |
| Windows laptop | Chrome, Edge, Firefox |
| macOS | Safari, Chrome |
| iPad | Safari |
Check: camera start, front/back switch, countdown smoothness, capture quality, sticker touch gestures, export download behaviour (iOS save-to-photos), memory on long sessions.
 
## Non-functional checks
- **Performance**: Lighthouse mobile score target 90+, strip render under 2 s, no memory growth across 5 consecutive sessions
- **Accessibility**: axe checks in CI, keyboard-only run, screen reader spot check
- **Privacy**: verify in DevTools Network tab that no image data is sent anywhere in local mode
- **Export quality**: visual check at 100% zoom; PDF opens in common viewers and prints at correct size
## CI gates
Lint, typecheck, unit + component tests, build, Playwright smoke test on every PR. Full device matrix before each release.
 