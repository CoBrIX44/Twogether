# ARCHITECTURE
 
## Overview
Single-page, client-only React app. A session moves through a state machine: `landing -> setup -> capture -> review -> customise -> export`.
 
```
 Camera(s) --> Capture Engine --> Frame Store (6 bitmaps)
                                       |
                                       v
                           Strip Composer (canvas)
                                       |
                 Filters --> Editor (Konva: stickers, text, frame)
                                       |
                                       v
                          Exporter (JPG / PNG / PDF)
```
 
## Folder structure
```
src/
  app/            routes, layout, providers
  features/
    capture/      CameraPanel, Countdown, ShutterButton, useCamera
    session/      state machine, mode (local | remote)
    strip/        templates, composer
    editor/       filter picker, sticker tray, Konva stage
    export/       exporters, format dialog
    remote/       peer connection, room, sync (v1.5)
  lib/
    render/       canvas helpers, filters, composeStrip()
    media/        device enumeration, permissions
  stores/         sessionStore, editorStore
  assets/         mascots, frames, sounds
```
 
## Key modules
- **useCamera(deviceId)**: wraps getUserMedia, handles permissions, errors, mirror, device switch, cleanup of tracks.
- **CaptureEngine**: runs the countdown (3,2,1), triggers flash, grabs a frame from each `<video>` via `drawImage` into an `ImageBitmap`. Uses `performance.now()` timing, not setInterval drift.
- **FrameStore (Zustand)**: array of 3 rounds x 2 slots (left, right), supports retake of one round.
- **Template**: JSON describing strip size, slot rectangles, padding, background, decorations. Composer reads it so adding templates needs no code change.
- **composeStrip(frames, template, filter)**: draws to an offscreen canvas at export resolution; preview uses a scaled copy.
- **Filters**: named presets = canvas filter string (`grayscale(1)`, etc.) + optional colour overlay blend (pink/lavender via `multiply`/`soft-light` overlays) for cross-browser parity.
- **Editor**: Konva stage over the composed strip image; stickers are nodes with transform handles. Export flattens stage + strip to final canvas.
- **Exporter**: PNG/JPG via `toBlob` (JPG quality 0.92), PDF via jsPDF sized to strip (or A4/4x6 print options).
## Remote mode (v1.5)
```
Guest <--WebRTC media--> Host
Guest <--data channel--> Host   (room state, countdown start time, photo transfer)
         ^ signaling via PeerJS server
```
- Host creates room, shares code/link. Guest joins.
- Host presses shutter -> sends `{type:"start", t0: hostTime + 1500ms}`. Both clients run the countdown to the agreed time, offset by measured clock skew (simple ping/pong).
- Each client captures its own local frame at 0 and the guest sends its frame (JPEG blob, chunked) to host. Host composes the strip and can send the final back.
- Frames always captured from the local camera (full quality), never from the compressed remote stream.
## Data and privacy
No server storage. Frames live in memory (ImageBitmap/Blob URLs), revoked on reset. Optional "save session" to IndexedDB is v2.
 
## Performance notes
- Preview at ~720p, export at higher resolution by re-rendering the template, not scaling up
- Use OffscreenCanvas/worker for export if it blocks the UI
- Cap sticker image sizes, use SVG where possible
## Error handling
Permission denied, no camera, camera in use, iOS autoplay rules (`playsInline`, `muted`), tab visibility loss mid-countdown (pause/reset), remote disconnect (fall back to local or retry).
 