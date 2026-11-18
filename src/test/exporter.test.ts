import { describe, it, expect } from 'vitest';
import { generateFilename } from '@/lib/render/exporter';

describe('Exporter helpers', () => {
  it('generates filename matching standard format', () => {
    const pngName = generateFilename('png');
    expect(pngName).toMatch(/^twogether-\d{8}-\d{6}\.png$/);

    const pdfName = generateFilename('pdf');
    expect(pdfName).toMatch(/^twogether-\d{8}-\d{6}\.pdf$/);

    const jpgName = generateFilename('jpg');
    expect(jpgName).toMatch(/^twogether-\d{8}-\d{6}\.jpg$/);
  });
});
