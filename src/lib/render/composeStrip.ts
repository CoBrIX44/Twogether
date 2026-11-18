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

  // 1. Draw Strip Background
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, template.width, template.height);

  // 2. Draw Decorative Film Sprockets along borders (unless using an ornate template that prefers full bleed)
  if (showSprockets && !template.slotFrameImageUrl) {
    ctx.fillStyle = theme.textColor === '#FFF7F9' ? 'rgba(255,255,255,0.12)' : 'rgba(59,42,53,0.08)';
    const sprocketRadius = 8;
    const sprocketStep = 44;
    const sprocketYStart = 100;
    const sprocketYEnd = template.height - 100;

    for (let y = sprocketYStart; y <= sprocketYEnd; y += sprocketStep) {
      // Left sprocket
      drawRoundedRect(ctx, 16, y, sprocketRadius * 2, sprocketRadius * 2, 4);
      ctx.fill();
      // Right sprocket
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

  // Load slot frame image if template defines one
  let slotFrameImage: HTMLImageElement | null = null;
  if (template.slotFrameImageUrl) {
    try {
      slotFrameImage = await loadImage(template.slotFrameImageUrl);
    } catch (e) {
      console.warn(`Could not load template frame image: ${template.slotFrameImageUrl}`, e);
    }
  }

  // 4. Render Photo Slots
  const frameMap = new Map<string, PhotoSlot>();
  for (const frame of frames) {
    frameMap.set(`${frame.round}-${frame.slot}`, frame);
  }

  for (const slotDef of template.slots) {
    const key = `${slotDef.round}-${slotDef.slot}`;
    const frame = frameMap.get(key);

    ctx.save();

    // Slot border / background card
    const slotRadius = 12;
    drawRoundedRect(ctx, slotDef.x, slotDef.y, slotDef.width, slotDef.height, slotRadius);
    ctx.fillStyle = theme.textColor === '#FFF7F9' ? '#2A1F2D' : '#F3E8EE';
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

    // If template has a custom frame overlay image, draw it over the photo slot!
    if (slotFrameImage) {
      ctx.save();
      // Draw with slight bleed/padding to wrap beautifully
      const framePadding = 8;
      ctx.drawImage(
        slotFrameImage,
        slotDef.x - framePadding,
        slotDef.y - framePadding,
        slotDef.width + framePadding * 2,
        slotDef.height + framePadding * 2
      );
      ctx.restore();
    } else {
      // Default clean photo border
      ctx.save();
      ctx.strokeStyle = theme.borderColor;
      ctx.lineWidth = 3;
      drawRoundedRect(ctx, slotDef.x, slotDef.y, slotDef.width, slotDef.height, slotRadius);
      ctx.stroke();
      ctx.restore();
    }
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
