import { PlacedSticker, StripTheme, FilterPreset, PhotoSlot, StripTemplateConfig } from '@/types';
import { composeStrip, loadImage } from './composeStrip';
import { STICKER_CATALOGUE, svgToDataUrl } from '@/lib/stickers/catalogue';

export interface FlattenExportOptions {
  template: StripTemplateConfig;
  theme: StripTheme;
  filter: FilterPreset;
  frames: PhotoSlot[];
  stickers: PlacedSticker[];
  caption: string;
  dateText: string;
}

/**
 * Generates the final flattened high-resolution canvas with strip + all placed stickers.
 */
export async function flattenStripToCanvas(options: FlattenExportOptions): Promise<HTMLCanvasElement> {
  const { template, theme, filter, frames, stickers, caption, dateText } = options;

  // 1. Compose base high-res strip
  const baseCanvas = await composeStrip({
    template,
    theme,
    filter,
    frames,
    caption,
    dateText,
  });

  const ctx = baseCanvas.getContext('2d');
  if (!ctx) return baseCanvas;

  // 2. Sort stickers by zIndex
  const sortedStickers = [...stickers].sort((a, b) => a.zIndex - b.zIndex);

  // 3. Draw each sticker
  for (const sticker of sortedStickers) {
    const asset = STICKER_CATALOGUE.find((s) => s.id === sticker.assetId);
    if (!asset) continue;

    try {
      const dataUrl = svgToDataUrl(asset.svg);
      const img = await loadImage(dataUrl);

      ctx.save();
      // Translate to sticker center
      ctx.translate(sticker.x, sticker.y);
      ctx.rotate((sticker.rotation * Math.PI) / 180);
      ctx.scale(sticker.scaleX, sticker.scaleY);

      const w = asset.defaultWidth;
      const h = asset.defaultHeight;

      // Draw centered at (0, 0)
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    } catch (err) {
      console.error(`Failed to draw sticker ${sticker.assetId}:`, err);
    }
  }

  return baseCanvas;
}
