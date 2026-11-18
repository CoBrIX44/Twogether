import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  FileText,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { useEditorStore } from '@/stores/editorStore';
import { CLASSIC_3X2_TEMPLATE, STRIP_THEMES, TEMPLATE_REGISTRY } from '@/lib/templates';
import { FILTER_PRESETS } from '@/lib/render/filters';
import { flattenStripToCanvas } from '@/lib/render/flattenExport';
import { exportPhotoStrip } from '@/lib/render/exporter';
import { ExportOptions } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const ExportScreen: React.FC = () => {
  const { frames, resetSession, setStep } = useSessionStore();
  const {
    selectedTemplateId,
    selectedFilter,
    selectedThemeId,
    stickers,
    caption,
    dateText,
    resetEditor,
  } = useEditorStore();

  const [flattenedCanvas, setFlattenedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'jpg' | 'pdf'>('png');
  const [pdfLayout, setPdfLayout] = useState<'strip-only' | '4x6-print' | 'a4-sheet'>('strip-only');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [hasExported, setHasExported] = useState<boolean>(false);

  const confettiTriggeredRef = useRef(false);

  const currentTemplate =
    TEMPLATE_REGISTRY.find((t) => t.id === selectedTemplateId) || CLASSIC_3X2_TEMPLATE;
  const currentTheme = STRIP_THEMES.find((t) => t.id === selectedThemeId) || STRIP_THEMES[0];
  const currentFilterPreset = FILTER_PRESETS[selectedFilter] || FILTER_PRESETS.none;

  // Flatten the strip + stickers on mount
  useEffect(() => {
    let isMounted = true;

    const buildExportCanvas = async () => {
      try {
        const canvas = await flattenStripToCanvas({
          template: currentTemplate,
          theme: currentTheme,
          filter: currentFilterPreset,
          frames,
          stickers,
          caption,
          dateText,
        });

        if (isMounted) {
          setFlattenedCanvas(canvas);
          setPreviewDataUrl(canvas.toDataURL('image/jpeg', 0.92));

          // Trigger celebratory confetti once loaded
          if (!confettiTriggeredRef.current) {
            confettiTriggeredRef.current = true;
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#F0629A', '#FF9EC4', '#C9B6F2', '#BFEBD8', '#FFE9A8'],
            });
          }
        }
      } catch (err) {
        console.error('Failed to generate final export canvas:', err);
      }
    };

    buildExportCanvas();
    return () => {
      isMounted = false;
    };
  }, [currentTemplate, currentTheme, currentFilterPreset, frames, stickers, caption, dateText]);

  // Execute download
  const handleDownload = async () => {
    if (!flattenedCanvas) return;
    setIsExporting(true);

    try {
      const options: ExportOptions = {
        format: selectedFormat,
        quality: 0.92,
        pdfLayout: selectedFormat === 'pdf' ? pdfLayout : undefined,
      };

      await exportPhotoStrip(flattenedCanvas, options);
      setHasExported(true);

      // Extra burst of confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#F0629A', '#FF9EC4', '#C9B6F2', '#BFEBD8', '#FFE9A8'],
      });
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Native share sheet if available
  const handleShare = async () => {
    if (!flattenedCanvas || !navigator.share) return;

    try {
      flattenedCanvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'twogether-photostrip.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Our Twogether Photo Strip ♡',
            text: 'Look at the photo booth strip we created on Twogether!',
            files: [file],
          });
        }
      }, 'image/png');
    } catch (err) {
      console.warn('Native share was cancelled or failed:', err);
    }
  };

  const handleStartAnother = () => {
    resetSession();
    resetEditor();
  };

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center pb-12">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-pink/20 text-pink-deep text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your Strip Is Ready!</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-ink">
          Download Your Memory ♡
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1 max-w-md">
          Export high-resolution prints or save to your phone to share with friends.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">
        {/* Left Column: Final Finished Strip Preview */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[340px] bg-surface rounded-card p-3 shadow-booth-hover border-2 border-pink/30 relative">
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Finished Twogether Photo Strip"
                className="w-full h-auto rounded-md shadow-sm"
              />
            ) : (
              <div className="w-full aspect-[12/26] flex items-center justify-center text-xs text-muted">
                Compiling high-res strip...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Export Format Selection & Actions */}
        <div className="md:col-span-6 flex flex-col gap-5">
          <Card className="flex flex-col gap-4">
            <span className="text-sm font-display font-bold text-ink">
              Choose Export Format
            </span>

            {/* Format Selector Pills */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedFormat('png')}
                className={`flex flex-col items-center p-3 rounded-card border-2 transition-all ${
                  selectedFormat === 'png'
                    ? 'border-pink-deep bg-pink/15 text-pink-deep shadow-subtle'
                    : 'border-pink/20 bg-bg text-muted hover:text-ink'
                }`}
              >
                <ImageIcon className="w-5 h-5 mb-1" />
                <span className="text-xs font-display font-bold">PNG</span>
                <span className="text-[10px] opacity-75">Lossless</span>
              </button>

              <button
                onClick={() => setSelectedFormat('jpg')}
                className={`flex flex-col items-center p-3 rounded-card border-2 transition-all ${
                  selectedFormat === 'jpg'
                    ? 'border-pink-deep bg-pink/15 text-pink-deep shadow-subtle'
                    : 'border-pink/20 bg-bg text-muted hover:text-ink'
                }`}
              >
                <ImageIcon className="w-5 h-5 mb-1" />
                <span className="text-xs font-display font-bold">JPG</span>
                <span className="text-[10px] opacity-75">Photo Album</span>
              </button>

              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`flex flex-col items-center p-3 rounded-card border-2 transition-all ${
                  selectedFormat === 'pdf'
                    ? 'border-pink-deep bg-pink/15 text-pink-deep shadow-subtle'
                    : 'border-pink/20 bg-bg text-muted hover:text-ink'
                }`}
              >
                <FileText className="w-5 h-5 mb-1" />
                <span className="text-xs font-display font-bold">PDF</span>
                <span className="text-[10px] opacity-75">Print Ready</span>
              </button>
            </div>

            {/* PDF Layout Options (when PDF is selected) */}
            {selectedFormat === 'pdf' && (
              <div className="p-3 bg-bg rounded-card border border-pink/20 mt-1">
                <span className="text-xs font-display font-semibold text-ink block mb-2">
                  PDF Print Layout
                </span>
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pdf-layout"
                      value="strip-only"
                      checked={pdfLayout === 'strip-only'}
                      onChange={() => setPdfLayout('strip-only')}
                      className="accent-pink-deep"
                    />
                    <span>Custom Strip Dimensions (Exact fit)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pdf-layout"
                      value="4x6-print"
                      checked={pdfLayout === '4x6-print'}
                      onChange={() => setPdfLayout('4x6-print')}
                      className="accent-pink-deep"
                    />
                    <span>Standard 4&quot; × 6&quot; Photo Paper (Two strips side-by-side)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pdf-layout"
                      value="a4-sheet"
                      checked={pdfLayout === 'a4-sheet'}
                      onChange={() => setPdfLayout('a4-sheet')}
                      className="accent-pink-deep"
                    />
                    <span>A4 Document Sheet (Double strip print)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Download Button */}
            <Button
              size="pill-lg"
              leftIcon={<Download className="w-5 h-5" />}
              onClick={handleDownload}
              disabled={!flattenedCanvas || isExporting}
              className="w-full mt-2"
            >
              {isExporting ? 'Preparing File...' : `Download ${selectedFormat.toUpperCase()} ♡`}
            </Button>

            {/* Success message */}
            {hasExported && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-semibold animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>Downloaded successfully! Check your downloads folder.</span>
              </div>
            )}

            {/* Native Mobile Share Button */}
            {canNativeShare && (
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Share2 className="w-4 h-4" />}
                onClick={handleShare}
                className="w-full"
              >
                Share via Mobile Sheet
              </Button>
            )}
          </Card>

          {/* Secondary Actions */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep('editor')}
            >
              Back to Editor
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleStartAnother}
            >
              Make Another Strip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
