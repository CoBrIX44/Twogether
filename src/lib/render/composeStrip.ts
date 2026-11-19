import { PhotoSlot, StripTheme, FilterPreset, StripTemplateConfig } from '@/types';
import { applyFilterToContext } from './filters';

export interface ComposeStripOptions {
  template: StripTemplateConfig;
  theme: StripTheme;
  filter: FilterPreset;
  frames: PhotoSlot[];
  caption?: string;
  dateText?: string;
  showSprockets?: boolean;
}

/**
 * Loads an image from a URL or data URL into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Calculates aspect-cover dimensions for drawing an image into a target rectangle
 */
export function calculateCoverCrop(
  imgWidth: number,
  imgHeight: number,
  targetWidth: number,
  targetHeight: number
): { sx: number; sy: number; sWidth: number; sHeight: number } {
  const imgAspect = imgWidth / imgHeight;
  const targetAspect = targetWidth / targetHeight;

  let sWidth = imgWidth;
  let sHeight = imgHeight;
  let sx = 0;
  let sy = 0;

  if (imgAspect > targetAspect) {
    // Image is wider than target: crop left & right
    sWidth = imgHeight * targetAspect;
    sx = (imgWidth - sWidth) / 2;
  } else {
    // Image is taller than target: crop top & bottom
    sHeight = imgWidth / targetAspect;
    sy = (imgHeight - sHeight) / 2;
  }

  return { sx, sy, sWidth, sHeight };
}

/**
 * Helper to draw rounded rectangle
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Helper to draw 9-slice frame border around the canvas
 */
function draw9Slice(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
  bTop: number,
  bRight: number,
  bBottom: number,
  bLeft: number,
  drawWTop: number,
  drawWRight: number,
  drawWBottom: number,
  drawWLeft: number
) {
  const sw = img.width;
  const sh = img.height;
  const sCenterW = Math.max(1, sw - bLeft - bRight);
  const sCenterH = Math.max(1, sh - bTop - bBottom);
  const dCenterW = Math.max(1, targetW - drawWLeft - drawWRight);
  const dCenterH = Math.max(1, targetH - drawWTop - drawWBottom);

  // 4 corners
  ctx.drawImage(img, 0, 0, bLeft, bTop, 0, 0, drawWLeft, drawWTop);
  ctx.drawImage(img, sw - bRight, 0, bRight, bTop, targetW - drawWRight, 0, drawWRight, drawWTop);
  ctx.drawImage(img, 0, sh - bBottom, bLeft, bBottom, 0, targetH - drawWBottom, drawWLeft, drawWBottom);
  ctx.drawImage(img, sw - bRight, sh - bBottom, bRight, bBottom, targetW - drawWRight, targetH - drawWBottom, drawWRight, drawWBottom);

  // 4 edges
  ctx.drawImage(img, bLeft, 0, sCenterW, bTop, drawWLeft, 0, dCenterW, drawWTop);
  ctx.drawImage(img, bLeft, sh - bBottom, sCenterW, bBottom, drawWLeft, targetH - drawWBottom, dCenterW, drawWBottom);
  ctx.drawImage(img, 0, bTop, bLeft, sCenterH, 0, drawWTop, drawWLeft, dCenterH);
  ctx.drawImage(img, sw - bRight, bTop, bRight, sCenterH, targetW - drawWRight, drawWTop, drawWRight, dCenterH);
}

/**
 * Composes a full high-resolution 3x2 photo strip on an offscreen canvas.
 */
export async function composeStrip(options: ComposeStripOptions): Promise<HTMLCanvasElement> {
  const {
    template,
    theme,
    filter,
    frames,
    caption = 'twogether ♡',
    dateText = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase(),
    showSprockets = true,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = template.width;
  canvas.height = template.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Failed to get 2D canvas context for strip composition');
  }

  // 1. Draw Strip Base Background
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, template.width, template.height);

  // 2. If a custom strip frame is selected, draw the frame around the STRIP
  if (template.stripFrameImageUrl) {
    try {
      const frameImg = await loadImage(template.stripFrameImageUrl);
      const slices = template.frameSlices || {
        bTop: Math.floor(frameImg.height * 0.15),
        bBottom: Math.floor(frameImg.height * 0.22),
        bLeft: Math.floor(frameImg.width * 0.15),
        bRight: Math.floor(frameImg.width * 0.15),
        dTop: 160,
        dBottom: 240,
        dLeft: 80,
        dRight: 80,
      };

      draw9Slice(
        ctx,
        frameImg,
        template.width,
        template.height,
        slices.bTop,
        slices.bRight,
        slices.bBottom,
        slices.bLeft,
        slices.dTop,
        slices.dRight,
        slices.dBottom,
        slices.dLeft
      );
    } catch (err) {
      console.warn(`Could not render strip frame image: ${template.stripFrameImageUrl}`, err);
    }
  } else if (showSprockets) {
    // Default White Strip film sprockets
    ctx.fillStyle = theme.textColor === '#FFF7F9' ? 'rgba(255,255,255,0.12)' : 'rgba(59,42,53,0.06)';
    const sprocketRadius = 8;
    const sprocketStep = 44;
    const sprocketYStart = 100;
    const sprocketYEnd = template.height - 100;

    for (let y = sprocketYStart; y <= sprocketYEnd; y += sprocketStep) {
      drawRoundedRect(ctx, 16, y, sprocketRadius * 2, sprocketRadius * 2, 4);
      ctx.fill();
      drawRoundedRect(ctx, template.width - 16 - sprocketRadius * 2, y, sprocketRadius * 2, sprocketRadius * 2, 4);
      ctx.fill();
    }
  }

  // 3. Draw Header
  ctx.save();
  ctx.fillStyle = theme.textColor;
  ctx.font = '700 44px "Fredoka", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TWOGETHER  ♡', template.width / 2, 85);

  // Subtitle / decorative stars
  ctx.fillStyle = theme.accentColor;
  ctx.font = '600 20px "Quicksand", system-ui, sans-serif';
  ctx.fillText('✧   PHOTO BOOTH SESSION   ✧', template.width / 2, 130);
  ctx.restore();

  // 4. Render Photo Slots cleanly onto the strip
  const frameMap = new Map<string, PhotoSlot>();
  for (const frame of frames) {
    frameMap.set(`${frame.round}-${frame.slot}`, frame);
  }

  for (const slotDef of template.slots) {
    const key = `${slotDef.round}-${slotDef.slot}`;
    const frame = frameMap.get(key);

    ctx.save();

    // Slot border / background card
    const slotRadius = 10;
    drawRoundedRect(ctx, slotDef.x, slotDef.y, slotDef.width, slotDef.height, slotRadius);
    ctx.fillStyle = '#F8FAFC';
    ctx.fill();

    // Clip to rounded slot
    ctx.clip();

    if (frame && frame.dataUrl) {
      try {
        const img = await loadImage(frame.dataUrl);
        const crop = calculateCoverCrop(img.width, img.height, slotDef.width, slotDef.height);

        // Offscreen canvas for the individual photo to apply filters cleanly
        const photoCanvas = document.createElement('canvas');
        photoCanvas.width = slotDef.width;
        photoCanvas.height = slotDef.height;
        const pCtx = photoCanvas.getContext('2d', { willReadFrequently: true });

        if (pCtx) {
          applyFilterToContext(pCtx, filter, slotDef.width, slotDef.height, () => {
            pCtx.drawImage(
              img,
              crop.sx,
              crop.sy,
              crop.sWidth,
              crop.sHeight,
              0,
              0,
              slotDef.width,
              slotDef.height
            );
          });
          ctx.drawImage(photoCanvas, slotDef.x, slotDef.y);
        }
      } catch (e) {
        console.error(`Failed to render frame for slot ${key}:`, e);
      }
    } else {
      // Empty placeholder
      ctx.fillStyle = theme.textColor;
      ctx.font = '500 24px "Quicksand", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `Round ${slotDef.round + 1} - Person ${slotDef.slot + 1}`,
        slotDef.x + slotDef.width / 2,
        slotDef.y + slotDef.height / 2
      );
    }

    ctx.restore();

    // Crisp photo slot border
    ctx.save();
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 2.5;
    drawRoundedRect(ctx, slotDef.x, slotDef.y, slotDef.width, slotDef.height, slotRadius);
    ctx.stroke();
    ctx.restore();
  }

  // 5. Draw Full Strip Overlay if template defines one
  if (template.overlayImageUrl) {
    try {
      const overlayImg = await loadImage(template.overlayImageUrl);
      ctx.drawImage(overlayImg, 0, 0, template.width, template.height);
    } catch (e) {
      console.warn(`Could not load overlay image: ${template.overlayImageUrl}`, e);
    }
  }

  // 6. Draw Footer (Caption & Date)
  const footerCenterY = template.height - template.footerHeight / 2 + 10;

  // Thin separator dashed line above footer
  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(template.padding, template.height - template.footerHeight);
  ctx.lineTo(template.width - template.padding, template.height - template.footerHeight);
  ctx.stroke();
  ctx.restore();

  // Caption text
  ctx.save();
  ctx.fillStyle = theme.textColor;
  ctx.font = '600 36px "Fredoka", cursive, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(caption, template.width / 2, footerCenterY - 26);

  // Date and small heart stamp
  ctx.fillStyle = theme.accentColor;
  ctx.font = '700 20px "Quicksand", sans-serif';
  ctx.fillText(`★  ${dateText}  ★`, template.width / 2, footerCenterY + 28);
  ctx.restore();

  return canvas;
}
