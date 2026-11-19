import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Trash2, RotateCw } from 'lucide-react';
import { PlacedSticker } from '@/types';
import { STICKER_CATALOGUE } from '@/lib/stickers/catalogue';
import { useEditorStore } from '@/stores/editorStore';

interface StickerStageProps {
  previewUrl: string | null;
  baseWidth: number;
  baseHeight: number;
}

export const StickerStage: React.FC<StickerStageProps> = ({
  previewUrl,
  baseWidth,
  baseHeight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    stickers,
    selectedStickerId,
    selectSticker,
    updateSticker,
    removeSticker,
  } = useEditorStore();

  const [scale, setScale] = useState<number>(0.28);
  const isDraggingRef = useRef(false);
  const isTransformingRef = useRef<'move' | 'rotate' | 'scale' | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; initialStickerX: number; initialStickerY: number; initialScale: number; initialRotation: number }>({
    x: 0,
    y: 0,
    initialStickerX: 0,
    initialStickerY: 0,
    initialScale: 1,
    initialRotation: 0,
  });

  // Calculate responsive scale based on container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const renderedWidth = containerRef.current.clientWidth;
        setScale(renderedWidth / baseWidth);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [baseWidth]);

  // Handle stage pointer down (deselect if clicking background)
  const handleStagePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.sticker-node')) return;
    selectSticker(null);
  };

  // Start moving a sticker
  const handleStickerPointerDown = (e: React.PointerEvent, sticker: PlacedSticker) => {
    e.stopPropagation();
    selectSticker(sticker.id);
    isDraggingRef.current = true;
    isTransformingRef.current = 'move';

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialStickerX: sticker.x,
      initialStickerY: sticker.y,
      initialScale: sticker.scaleX,
      initialRotation: sticker.rotation,
    };
  };

  // Start rotating a sticker
  const handleRotatePointerDown = (e: React.PointerEvent, sticker: PlacedSticker) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    isTransformingRef.current = 'rotate';

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialStickerX: sticker.x,
      initialStickerY: sticker.y,
      initialScale: sticker.scaleX,
      initialRotation: sticker.rotation,
    };
  };

  // Start scaling a sticker
  const handleScalePointerDown = (e: React.PointerEvent, sticker: PlacedSticker) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    isTransformingRef.current = 'scale';

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialStickerX: sticker.x,
      initialStickerY: sticker.y,
      initialScale: sticker.scaleX,
      initialRotation: sticker.rotation,
    };
  };

  // Global pointer move during drag/transform
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDraggingRef.current || !selectedStickerId || !isTransformingRef.current) return;
      const sticker = stickers.find((s) => s.id === selectedStickerId);
      if (!sticker) return;

      const deltaX = (e.clientX - dragStartRef.current.x) / scale;
      const deltaY = (e.clientY - dragStartRef.current.y) / scale;

      if (isTransformingRef.current === 'move') {
        const newX = Math.max(50, Math.min(baseWidth - 50, dragStartRef.current.initialStickerX + deltaX));
        const newY = Math.max(50, Math.min(baseHeight - 50, dragStartRef.current.initialStickerY + deltaY));
        updateSticker(selectedStickerId, { x: newX, y: newY });
      } else if (isTransformingRef.current === 'scale') {
        // Distance delta determines scale
        const factor = 1 + deltaX * 0.005;
        const newScale = Math.max(0.4, Math.min(3.0, dragStartRef.current.initialScale * factor));
        updateSticker(selectedStickerId, {
          scaleX: sticker.isFlipped ? -newScale : newScale,
          scaleY: newScale,
        });
      } else if (isTransformingRef.current === 'rotate') {
        const newRotation = (dragStartRef.current.initialRotation + deltaX * 0.6) % 360;
        updateSticker(selectedStickerId, { rotation: newRotation });
      }
    },
    [baseHeight, baseWidth, scale, selectedStickerId, stickers, updateSticker]
  );

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    isTransformingRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return (
    <div className="flex justify-center w-full">
      <div
        ref={containerRef}
        onPointerDown={handleStagePointerDown}
        style={{
          width: '100%',
          maxWidth: '380px',
          aspectRatio: `${baseWidth} / ${baseHeight}`,
        }}
        className="relative bg-surface rounded-card shadow-booth-hover border-2 border-pink/30 overflow-hidden select-none touch-none"
      >
        {/* Rendered Base Strip Preview */}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Custom photo strip preview"
            className="w-full h-full block object-cover pointer-events-none select-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted">
            Generating strip preview...
          </div>
        )}

        {/* Stickers Interactive Overlay */}
        {stickers.map((sticker) => {
          const asset = STICKER_CATALOGUE.find((s) => s.id === sticker.assetId);
          if (!asset) return null;

          const isSelected = sticker.id === selectedStickerId;
          const left = sticker.x * scale;
          const top = sticker.y * scale;
          const w = asset.defaultWidth * scale * Math.abs(sticker.scaleX);
          const h = asset.defaultHeight * scale * sticker.scaleY;

          return (
            <div
              key={sticker.id}
              className={`sticker-node absolute cursor-move transition-shadow ${
                isSelected ? 'ring-2 ring-pink-deep ring-offset-2 rounded-lg' : ''
              }`}
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${w}px`,
                height: `${h}px`,
                transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scaleX(${
                  sticker.isFlipped ? -1 : 1
                })`,
                zIndex: sticker.zIndex,
              }}
              onPointerDown={(e) => handleStickerPointerDown(e, sticker)}
            >
              {/* Sticker Graphic */}
              {asset.imageUrl ? (
                <img
                  src={asset.imageUrl}
                  alt={asset.name}
                  className="w-full h-full object-contain drop-shadow-md pointer-events-none select-none"
                  draggable={false}
                />
              ) : (
                <div
                  className="w-full h-full drop-shadow-md pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: asset.svg || '' }}
                />
              )}

              {/* Selection Transform Handles (when selected) */}
              {isSelected && (
                <>
                  {/* Top Rotate Handle */}
                  <div
                    onPointerDown={(e) => handleRotatePointerDown(e, sticker)}
                    title="Drag to rotate"
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-pink-deep text-white flex items-center justify-center cursor-grab shadow-subtle hover:scale-110 transition-transform"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </div>

                  {/* Bottom-right Scale Handle */}
                  <div
                    onPointerDown={(e) => handleScalePointerDown(e, sticker)}
                    title="Drag to resize"
                    className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-pink-deep text-white flex items-center justify-center cursor-nwse-resize shadow-subtle hover:scale-110 transition-transform"
                  >
                    <span className="w-2 h-2 bg-white rounded-full" />
                  </div>

                  {/* Top-right Quick Delete Handle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSticker(sticker.id);
                    }}
                    title="Delete sticker"
                    className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-danger text-white flex items-center justify-center cursor-pointer shadow-subtle hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
