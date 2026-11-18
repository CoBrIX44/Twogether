import React, { useState, useEffect } from 'react';
import {
  Undo,
  Redo,
  Copy,
  FlipHorizontal,
  ChevronUp,
  ChevronDown,
  Trash2,
  Sparkles,
  Palette,
  Sticker,
  Type,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { useEditorStore } from '@/stores/editorStore';
import { CLASSIC_3X2_TEMPLATE, STRIP_THEMES } from '@/lib/templates';
import { FILTER_PRESETS } from '@/lib/render/filters';
import { composeStrip } from '@/lib/render/composeStrip';
import { FilterId } from '@/types';
import { StickerStage } from './StickerStage';
import { StickerTray } from './StickerTray';
import { Button } from '@/components/ui/Button';

type EditorTab = 'filters' | 'themes' | 'stickers' | 'text';

export const EditorScreen: React.FC = () => {
  const { frames, setStep } = useSessionStore();
  const {
    selectedFilter,
    setFilter,
    selectedThemeId,
    setTheme,
    caption,
    setCaption,
    dateText,
    setDateText,
    selectedStickerId,
    bringForward,
    sendBackward,
    duplicateSticker,
    flipSticker,
    removeSticker,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState<EditorTab>('stickers');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const currentTheme = STRIP_THEMES.find((t) => t.id === selectedThemeId) || STRIP_THEMES[0];
  const currentFilterPreset = FILTER_PRESETS[selectedFilter] || FILTER_PRESETS.none;

  // Re-generate base strip preview whenever theme, filter, caption, or date changes
  useEffect(() => {
    let isCancelled = false;

    const generatePreview = async () => {
      try {
        const canvas = await composeStrip({
          template: CLASSIC_3X2_TEMPLATE,
          theme: currentTheme,
          filter: currentFilterPreset,
          frames,
          caption,
          dateText,
        });

        if (!isCancelled) {
          setPreviewUrl(canvas.toDataURL('image/jpeg', 0.9));
        }
      } catch (err) {
        console.error('Failed to generate preview canvas:', err);
      }
    };

    generatePreview();
    return () => {
      isCancelled = true;
    };
  }, [currentTheme, currentFilterPreset, frames, caption, dateText]);

  const tabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: 'stickers', label: 'Stickers', icon: <Sticker className="w-4 h-4" /> },
    { id: 'filters', label: 'Filters', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'themes', label: 'Theme', icon: <Palette className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col pb-8">
      {/* Editor Header Bar with Undo/Redo & Layer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3 rounded-card border border-pink/20 shadow-subtle mb-4">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo()}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo()}
            title="Redo"
            aria-label="Redo"
          >
            <Redo className="w-4 h-4" />
          </Button>

          <div className="w-px h-5 bg-pink/20 mx-1" />

          {/* Controls for selected sticker */}
          {selectedStickerId ? (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => duplicateSticker(selectedStickerId)}
                title="Duplicate sticker"
                aria-label="Duplicate sticker"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => flipSticker(selectedStickerId)}
                title="Flip horizontal"
                aria-label="Flip sticker horizontally"
              >
                <FlipHorizontal className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => bringForward(selectedStickerId)}
                title="Bring forward"
                aria-label="Bring sticker forward"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => sendBackward(selectedStickerId)}
                title="Send backward"
                aria-label="Send sticker backward"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSticker(selectedStickerId)}
                title="Delete sticker"
                aria-label="Delete sticker"
                className="text-danger hover:bg-danger/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <span className="text-xs text-muted italic ml-1">
              Select a sticker on the strip to transform it
            </span>
          )}
        </div>

        {/* Navigation Step Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={() => setStep('review')}
          >
            Back
          </Button>
          <Button
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => setStep('export')}
          >
            Finish & Export
          </Button>
        </div>
      </div>

      {/* Main Studio Area (Two columns on desktop: Stage left, Controls right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Strip Stage */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <StickerStage
            previewUrl={previewUrl}
            baseWidth={CLASSIC_3X2_TEMPLATE.width}
            baseHeight={CLASSIC_3X2_TEMPLATE.height}
          />
          <p className="text-[11px] text-muted text-center mt-2">
            Tip: Tap any sticker to move, rotate, resize, or delete it!
          </p>
        </div>

        {/* Right Column: Customization Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Tabs Navigation */}
          <div className="flex items-center bg-surface p-1 rounded-card border border-pink/20 shadow-subtle">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-pill text-xs font-display font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-pink-deep text-white shadow-subtle font-semibold'
                    : 'text-muted hover:text-ink hover:bg-pink/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Stickers & Mascots Tray */}
          {activeTab === 'stickers' && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-display font-semibold text-ink">
                  Stickers & Original Mascots
                </span>
                <span className="text-[11px] text-muted">Tap to place on strip</span>
              </div>
              <StickerTray />
            </div>
          )}

          {/* Tab 2: Filters */}
          {activeTab === 'filters' && (
            <div className="bg-surface rounded-card p-4 border border-pink/20 shadow-subtle">
              <span className="text-xs font-display font-semibold text-ink block mb-3">
                Photo Filter Presets
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.keys(FILTER_PRESETS) as FilterId[]).map((key) => {
                  const preset = FILTER_PRESETS[key];
                  const isSelected = selectedFilter === key;

                  return (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`flex flex-col items-center p-2.5 rounded-card border-2 transition-all ${
                        isSelected
                          ? 'border-pink-deep bg-pink/15 shadow-subtle scale-102'
                          : 'border-pink/20 hover:border-pink-deep/50 bg-bg'
                      }`}
                    >
                      {/* Live thumbnail sample */}
                      <div
                        className="w-16 h-16 rounded-md mb-2 overflow-hidden bg-muted/20 border border-pink/20 flex items-center justify-center text-xs"
                        style={{
                          filter: preset.cssFilter !== 'none' ? preset.cssFilter : undefined,
                        }}
                      >
                        {frames[0]?.dataUrl ? (
                          <img
                            src={frames[0].dataUrl}
                            alt={preset.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>Sample</span>
                        )}
                      </div>
                      <span className="text-xs font-display font-semibold text-ink">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-muted text-center mt-0.5 line-clamp-1">
                        {preset.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Themes */}
          {activeTab === 'themes' && (
            <div className="bg-surface rounded-card p-4 border border-pink/20 shadow-subtle">
              <span className="text-xs font-display font-semibold text-ink block mb-3">
                Strip Frame Colors & Theme
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STRIP_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setTheme(theme.id)}
                      className={`flex items-center gap-3 p-3 rounded-card border-2 transition-all ${
                        isSelected
                          ? 'border-pink-deep bg-pink/15 shadow-subtle scale-102'
                          : 'border-pink/20 hover:border-pink-deep/50 bg-bg'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full border border-black/10 shrink-0 shadow-xs"
                        style={{ backgroundColor: theme.background }}
                      />
                      <div className="text-left">
                        <span className="text-xs font-display font-semibold text-ink block">
                          {theme.name}
                        </span>
                        <span
                          className="text-[10px] font-mono block"
                          style={{ color: theme.accentColor }}
                        >
                          ● Accent
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: Caption & Date Text */}
          {activeTab === 'text' && (
            <div className="bg-surface rounded-card p-4 border border-pink/20 shadow-subtle flex flex-col gap-4">
              <div>
                <label
                  htmlFor="caption-input"
                  className="block text-xs font-display font-semibold text-ink mb-1.5"
                >
                  Strip Caption
                </label>
                <input
                  id="caption-input"
                  type="text"
                  maxLength={36}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. twogether forever ♡"
                  className="w-full px-3.5 py-2.5 rounded-card bg-bg border border-pink/30 text-ink text-sm focus:outline-none focus:border-pink-deep"
                />
                <span className="text-[11px] text-muted mt-1 block">
                  Printed in charming handwriting font at the bottom of the strip.
                </span>
              </div>

              <div>
                <label
                  htmlFor="date-input"
                  className="block text-xs font-display font-semibold text-ink mb-1.5"
                >
                  Date Stamp
                </label>
                <input
                  id="date-input"
                  type="text"
                  maxLength={24}
                  value={dateText}
                  onChange={(e) => setDateText(e.target.value)}
                  placeholder="e.g. NOV 18, 2026"
                  className="w-full px-3.5 py-2.5 rounded-card bg-bg border border-pink/30 text-ink text-sm focus:outline-none focus:border-pink-deep"
                />
              </div>
            </div>
          )}

          {/* Bottom Large Export Action */}
          <div className="mt-2">
            <Button
              size="pill-lg"
              className="w-full shadow-booth"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => setStep('export')}
            >
              Export Strip (JPG, PNG, PDF) ♡
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
