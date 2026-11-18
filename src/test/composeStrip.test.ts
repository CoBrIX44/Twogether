import { describe, it, expect } from 'vitest';
import { calculateCoverCrop, composeStrip } from '@/lib/render/composeStrip';
import { CLASSIC_3X2_TEMPLATE, STRIP_THEMES } from '@/lib/templates';
import { FILTER_PRESETS } from '@/lib/render/filters';

describe('composeStrip & image geometry', () => {
  it('correctly calculates cover crop for wider image', () => {
    // 16:9 image into 3:4 target
    const crop = calculateCoverCrop(1920, 1080, 540, 720);
    expect(crop.sHeight).toBe(1080);
    // target aspect is 540/720 = 0.75; crop width = 1080 * 0.75 = 810
    expect(crop.sWidth).toBe(810);
    expect(crop.sx).toBe((1920 - 810) / 2);
    expect(crop.sy).toBe(0);
  });

  it('correctly calculates cover crop for taller image', () => {
    // 1:2 image into 3:4 target
    const crop = calculateCoverCrop(500, 1000, 540, 720);
    expect(crop.sWidth).toBe(500);
    // target aspect is 0.75; crop height = 500 / 0.75 = 666.66...
    expect(crop.sx).toBe(0);
    expect(crop.sHeight).toBeCloseTo(666.66, 1);
  });

  it('validates 3x2 classic template geometry', () => {
    expect(CLASSIC_3X2_TEMPLATE.slots).toHaveLength(6);
    expect(CLASSIC_3X2_TEMPLATE.width).toBe(1200);
    expect(CLASSIC_3X2_TEMPLATE.height).toBe(2600);

    // Each row should have 2 slots with identical Y
    const row0 = CLASSIC_3X2_TEMPLATE.slots.filter((s) => s.round === 0);
    expect(row0).toHaveLength(2);
    expect(row0[0].y).toBe(row0[1].y);
    expect(row0[0].x).toBeLessThan(row0[1].x);
  });

  it('generates an offscreen canvas with correct dimensions', async () => {
    const canvas = await composeStrip({
      template: CLASSIC_3X2_TEMPLATE,
      theme: STRIP_THEMES[0],
      filter: FILTER_PRESETS.none,
      frames: [],
      caption: 'Testing ♡',
      dateText: 'NOV 18, 2026',
    });

    expect(canvas).toBeDefined();
    expect(canvas.width).toBe(CLASSIC_3X2_TEMPLATE.width);
    expect(canvas.height).toBe(CLASSIC_3X2_TEMPLATE.height);
  });
});
