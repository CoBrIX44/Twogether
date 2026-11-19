# 📸 Twogether ♡

> **Capturing moments, together.**  
> A virtual photo booth designed for couples and best friends.

Twogether brings the authentic, joyful nostalgia of physical Japanese & Korean-style photo booths right into your browser. Take a 3-round photo session, compose a classic 3-row × 2-column strip, customize with retro filters, original mascots, washi tape, and captions, and export high-resolution prints in JPG, PNG, and PDF.

---

## 🎬 Demo

<video src="brag-output/brag.mp4" poster="brag-output/brag.jpg" controls playsinline width="100%">
  <a href="brag-output/brag.mp4">Watch the Twogether launch video</a>
</video>

---

## ✨ Features

- **Side-by-Side Dual Viewfinder**: Real-time dual camera panels for couples & best friends.
- **Two Capture Modes**:
  - `Same Frame`: Both partners pose together in the viewfinder.
  - `Take Turns`: Alternate shots round-by-round.
- **Classic Photobooth Countdown**: Large animated 3-2-1 timer, audio beeps, screen flash effect, and mechanical shutter sound.
- **Round-by-Round Flow**: 3 distinct poses with progress dots and pose prompt guides.
- **Review & Retake**: Contact sheet review screen allowing users to retake any individual round before customizing.
- **Classic 3×2 Strip Composer**: Pixel-accurate offscreen `<canvas>` rendering engine generating crisp 1200×2600 px photo strips.
- **Filter Presets**: Natural, B&W Film, Pink Blush, Lavender Mist, Vintage Sepia, Golden Hour, and Cool Twilight (with cross-browser fallback).
- **6 Strip Color Themes**: Blush Dream, Classic White, Lavender Mist, Pastel Mint, Butter Honey, and Midnight Noir.
- **Original Mascot & Sticker Collection**:
  - Original characters: *Boba the Bunny*, *Mochi the Bear*, *Kiki the Cat*, and *Twinkle Star*.
  - Accessories: Pink ribbon bows, retro heart sunglasses, sweet cherries, washi tape, and text badges.
  - Free transform: Drag, rotate, scale, flip horizontally, duplicate, and re-order layers with undo/redo support.
- **Multi-Format Print & Digital Export**:
  - **PNG**: Lossless digital keepsake.
  - **JPG**: High-quality (0.92) photo-album ready.
  - **PDF**: Print-ready with 3 layouts (Strip-only, standard 4"×6" photo paper double-print, or A4 double-print).
- **100% In-Browser Privacy**: Zero photo uploads. All image operations execute strictly on client-side `<canvas>` in volatile memory.

---

## 🎨 Design Tokens

- **Background Blush**: `#FFF7F9`
- **Surface**: `#FFFFFF`
- **Plum Ink Text**: `#3B2A35`
- **Muted**: `#8A7683`
- **Pink Primary Action**: `#F0629A` (Light: `#FF9EC4`)
- **Lavender Accent**: `#C9B6F2` (Deep: `#9A7BE0`)
- **Mint Accent**: `#BFEBD8`
- **Butter Accent**: `#FFE9A8`
- **Typography**: Display: *Fredoka*, Body: *Quicksand*

---

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with CSS Variables
- **State Management**: Zustand (`sessionStore`, `editorStore`)
- **Rendering**: HTML5 Canvas 2D API (`src/lib/render/`)
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Confetti**: canvas-confetti
- **Testing**: Vitest + React Testing Library + Playwright

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start local development server
pnpm dev

# Type check TypeScript
pnpm typecheck

# Run linter
pnpm lint

# Run unit tests
pnpm test

# Build production bundle
pnpm build
```

---

## 🔒 Privacy Guarantee

Photos never leave your device. All rendering is performed in-memory on local canvas contexts and cleared upon session reset or browser tab closure. No analytics capture, track, or transmit your images.

---

## 📜 Licenses

All mascots, stickers, and vector illustrations are original works created for Twogether and dedicated to the public domain under **CC0 1.0 Universal**. See [`public/assets/LICENSES.md`](./public/assets/LICENSES.md).
