import React, { useState } from 'react';
import { STICKER_CATALOGUE, StickerItem } from '@/lib/stickers/catalogue';
import { useEditorStore } from '@/stores/editorStore';

type CategoryFilter = 'all' | 'mascots' | 'hearts-stars' | 'accessories' | 'washi-tape' | 'text-badges';

export const StickerTray: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const { addSticker } = useEditorStore();

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'mascots', label: 'Mascots' },
    { id: 'hearts-stars', label: 'Hearts & Stars' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'washi-tape', label: 'Washi Tape' },
    { id: 'text-badges', label: 'Badges' },
  ];

  const filteredStickers =
    activeCategory === 'all'
      ? STICKER_CATALOGUE
      : STICKER_CATALOGUE.filter((s) => s.category === activeCategory);

  const handleAdd = (sticker: StickerItem) => {
    // Add sticker near center with slight randomized offset so multiple additions don't overlap exactly
    const offsetX = 540 + (Math.random() * 80 - 40);
    const offsetY = 1200 + (Math.random() * 120 - 60);
    addSticker(sticker.id, offsetX, offsetY);
  };

  return (
    <div className="flex flex-col w-full bg-surface rounded-card p-4 border border-pink/20 shadow-subtle">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-pill text-xs font-display whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-pink-deep text-white shadow-subtle font-semibold'
                : 'bg-bg text-muted hover:text-ink hover:bg-pink/15'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stickers Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-h-[220px] overflow-y-auto p-1">
        {filteredStickers.map((sticker) => (
          <button
            key={sticker.id}
            onClick={() => handleAdd(sticker)}
            title={`Add ${sticker.name}`}
            className="aspect-square bg-bg hover:bg-pink/15 rounded-card p-2 flex items-center justify-center border border-pink/20 hover:border-pink-deep hover:scale-105 active:scale-95 transition-all group"
          >
            <div
              className="w-full h-full drop-shadow-xs group-hover:scale-110 transition-transform pointer-events-none"
              dangerouslySetInnerHTML={{ __html: sticker.svg }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
