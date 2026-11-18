import { FilterId, FilterPreset } from '@/types';

export const FILTER_PRESETS: Record<FilterId, FilterPreset> = {
  none: {
    id: 'none',
    name: 'Natural',
    cssFilter: 'none',
    description: 'Clean camera capture without filters',
  },
  bw: {
    id: 'bw',
    name: 'B&W Film',
    cssFilter: 'grayscale(100%) contrast(118%) brightness(102%)',
    description: 'Classic monochrome booth look',
  },
  'pink-blush': {
    id: 'pink-blush',
    name: 'Pink Blush',
    cssFilter: 'contrast(105%) saturate(115%) brightness(104%)',
    overlayColor: 'rgba(255, 158, 196, 0.22)',
    overlayBlendMode: 'soft-light',
    description: 'Soft rosy dreamy glow',
  },
  'lavender-dream': {
    id: 'lavender-dream',
    name: 'Lavender Mist',
    cssFilter: 'contrast(106%) saturate(120%) brightness(102%)',
    overlayColor: 'rgba(201, 182, 242, 0.24)',
    overlayBlendMode: 'soft-light',
    description: 'Pastel purple fairy aesthetic',
  },
  sepia: {
    id: 'sepia',
    name: 'Vintage Sepia',
    cssFilter: 'sepia(65%) contrast(110%) brightness(96%)',
    description: 'Warm nostalgic 90s film mood',
  },
  warm: {
    id: 'warm',
    name: 'Golden Hour',
    cssFilter: 'sepia(20%) saturate(125%) contrast(106%) brightness(103%)',
    overlayColor: 'rgba(255, 233, 168, 0.18)',
    overlayBlendMode: 'screen',
    description: 'Sunlit warmth and glowing skin',
  },
  cool: {
    id: 'cool',
    name: 'Cool Twilight',
    cssFilter: 'saturate(90%) contrast(110%) hue-rotate(15deg)',
    overlayColor: 'rgba(191, 235, 216, 0.20)',
    overlayBlendMode: 'color-dodge',
    description: 'Fresh crisp indie vibe',
  },
};

/**
 * Applies a filter preset to a 2D canvas context.
 * Checks for native ctx.filter support, falling back to pixel manipulation if unsupported (older Safari).
 */
export function applyFilterToContext(
  ctx: CanvasRenderingContext2D,
  preset: FilterPreset,
  width: number,
  height: number,
  drawBaseImage: () => void
): void {
  // Check if ctx.filter is supported in current environment
  const supportsCanvasFilter = typeof ctx.filter === 'string';

  if (supportsCanvasFilter && preset.cssFilter !== 'none') {
    ctx.filter = preset.cssFilter;
  }

  // Draw base image
  drawBaseImage();

  // Reset filter
  if (supportsCanvasFilter) {
    ctx.filter = 'none';
  }

  // Fallback for Safari/browsers lacking ctx.filter or for monochrome/sepia pixel fallback
  if (!supportsCanvasFilter && preset.id !== 'none') {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (preset.id === 'bw') {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        // contrast boost
        const contrasted = Math.min(255, Math.max(0, (gray - 128) * 1.18 + 128));
        data[i] = contrasted;
        data[i + 1] = contrasted;
        data[i + 2] = contrasted;
      } else if (preset.id === 'sepia') {
        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Color overlay blend if specified
  if (preset.overlayColor) {
    ctx.save();
    ctx.globalCompositeOperation = preset.overlayBlendMode || 'soft-light';
    ctx.fillStyle = preset.overlayColor;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
