import { jsPDF } from 'jspdf';
import { ExportOptions } from '@/types';

/**
 * Generates standard timestamped filename: twogether-YYYYMMDD-HHMMSS.ext
 */
export function generateFilename(extension: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');

  return `twogether-${year}${month}${day}-${hours}${mins}${secs}.${extension}`;
}

/**
 * Downloads a blob as a file in the browser
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exports canvas into JPG, PNG, or PDF and triggers direct browser download
 */
export async function exportPhotoStrip(
  canvas: HTMLCanvasElement,
  options: ExportOptions
): Promise<void> {
  const { format, quality = 0.92, pdfLayout = 'strip-only' } = options;

  if (format === 'png') {
    canvas.toBlob(
      (blob) => {
        if (!blob) throw new Error('Failed to create PNG blob');
        triggerFileDownload(blob, generateFilename('png'));
      },
      'image/png'
    );
  } else if (format === 'jpg') {
    canvas.toBlob(
      (blob) => {
        if (!blob) throw new Error('Failed to create JPG blob');
        triggerFileDownload(blob, generateFilename('jpg'));
      },
      'image/jpeg',
      quality
    );
  } else if (format === 'pdf') {
    // Generate high-resolution PDF with jsPDF
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const aspectRatio = canvasHeight / canvasWidth;

    if (pdfLayout === 'strip-only') {
      // Custom dimensions sized strictly to the photo strip
      // 1200 x 2600 px is roughly 4 inches x 8.67 inches = 101.6 mm x 220 mm
      const pdfWidthMm = 100;
      const pdfHeightMm = pdfWidthMm * aspectRatio;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidthMm, pdfHeightMm],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm);
      pdf.save(generateFilename('pdf'));
    } else if (pdfLayout === '4x6-print') {
      // Standard 4x6 inch photo paper print (101.6 mm x 152.4 mm)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [152.4, 101.6],
      });

      // Fit strip on left half or centered
      const stripWidthMm = 90 / aspectRatio;
      const stripHeightMm = 90;
      const xOffset = (152.4 - stripWidthMm * 2 - 10) / 2;

      // Print two copies side by side like real vintage photobooths!
      pdf.addImage(imgData, 'JPEG', xOffset, 5.8, stripWidthMm, stripHeightMm);
      pdf.addImage(imgData, 'JPEG', xOffset + stripWidthMm + 10, 5.8, stripWidthMm, stripHeightMm);

      pdf.save(generateFilename('pdf'));
    } else {
      // Standard A4 portrait sheet (210 x 297 mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const stripHeightMm = 260;
      const stripWidthMm = stripHeightMm / aspectRatio;
      const xOffset = (210 - stripWidthMm * 2 - 15) / 2;

      // Place two printable strips side-by-side on A4
      pdf.addImage(imgData, 'JPEG', xOffset, 18, stripWidthMm, stripHeightMm);
      pdf.addImage(imgData, 'JPEG', xOffset + stripWidthMm + 15, 18, stripWidthMm, stripHeightMm);

      pdf.save(generateFilename('pdf'));
    }
  }
}
