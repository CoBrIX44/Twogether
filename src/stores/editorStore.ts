import { create } from 'zustand';
import { FilterId, PlacedSticker } from '@/types';

interface EditorSnapshot {
  stickers: PlacedSticker[];
  selectedFilter: FilterId;
  selectedThemeId: string;
  selectedTemplateId: string;
  caption: string;
  dateText: string;
}

interface EditorState {
  selectedFilter: FilterId;
  selectedThemeId: string;
  selectedTemplateId: string;
  stickers: PlacedSticker[];
  selectedStickerId: string | null;
  caption: string;
  dateText: string;

  // History for Undo / Redo
  history: EditorSnapshot[];
  historyIndex: number;

  // Actions
  setFilter: (filterId: FilterId) => void;
  setTheme: (themeId: string) => void;
  setTemplate: (templateId: string) => void;
  setCaption: (caption: string) => void;
  setDateText: (dateText: string) => void;
  selectSticker: (id: string | null) => void;
  addSticker: (assetId: string, initialX?: number, initialY?: number) => void;
  updateSticker: (id: string, partial: Partial<PlacedSticker>) => void;
  removeSticker: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  duplicateSticker: (id: string) => void;
  flipSticker: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  resetEditor: () => void;
}

const DEFAULT_DATE = new Date().toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).toUpperCase();

export const useEditorStore = create<EditorState>((set, get) => {
  const saveSnapshot = (snapshot: EditorSnapshot) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    // Limit history stack size to 25 states
    if (newHistory.length > 25) {
      newHistory.shift();
    }
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  };

  const getSnapshot = (): EditorSnapshot => {
    const { stickers, selectedFilter, selectedThemeId, selectedTemplateId, caption, dateText } = get();
    return {
      stickers: JSON.parse(JSON.stringify(stickers)),
      selectedFilter,
      selectedThemeId,
      selectedTemplateId,
      caption,
      dateText,
    };
  };

  return {
    selectedFilter: 'none',
    selectedThemeId: 'blush',
    selectedTemplateId: 'classic-3x2',
    stickers: [],
    selectedStickerId: null,
    caption: 'twogether ♡',
    dateText: DEFAULT_DATE,
    history: [
      {
        stickers: [],
        selectedFilter: 'none',
        selectedThemeId: 'blush',
        selectedTemplateId: 'classic-3x2',
        caption: 'twogether ♡',
        dateText: DEFAULT_DATE,
      },
    ],
    historyIndex: 0,

    setFilter: (selectedFilter) => {
      set({ selectedFilter });
      saveSnapshot(getSnapshot());
    },

    setTheme: (selectedThemeId) => {
      set({ selectedThemeId });
      saveSnapshot(getSnapshot());
    },

    setTemplate: (selectedTemplateId) => {
      set({ selectedTemplateId });
      saveSnapshot(getSnapshot());
    },

    setCaption: (caption) => {
      set({ caption });
      saveSnapshot(getSnapshot());
    },

    setDateText: (dateText) => {
      set({ dateText });
      saveSnapshot(getSnapshot());
    },

    selectSticker: (selectedStickerId) => set({ selectedStickerId }),

    addSticker: (assetId, initialX = 540, initialY = 1200) => {
      const { stickers } = get();
      const newSticker: PlacedSticker = {
        id: `sticker-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        assetId,
        x: initialX,
        y: initialY,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        zIndex: stickers.length + 1,
        isFlipped: false,
      };

      const updated = [...stickers, newSticker];
      set({ stickers: updated, selectedStickerId: newSticker.id });
      saveSnapshot(getSnapshot());
    },

    updateSticker: (id, partial) => {
      const { stickers } = get();
      const updated = stickers.map((s) => (s.id === id ? { ...s, ...partial } : s));
      set({ stickers: updated });
    },

    removeSticker: (id) => {
      const { stickers, selectedStickerId } = get();
      const updated = stickers.filter((s) => s.id !== id);
      set({
        stickers: updated,
        selectedStickerId: selectedStickerId === id ? null : selectedStickerId,
      });
      saveSnapshot(getSnapshot());
    },

    bringForward: (id) => {
      const { stickers } = get();
      const idx = stickers.findIndex((s) => s.id === id);
      if (idx < 0 || idx === stickers.length - 1) return;
      const updated = [...stickers];
      const item = updated.splice(idx, 1)[0];
      updated.splice(idx + 1, 0, item);
      updated.forEach((s, i) => (s.zIndex = i + 1));
      set({ stickers: updated });
      saveSnapshot(getSnapshot());
    },

    sendBackward: (id) => {
      const { stickers } = get();
      const idx = stickers.findIndex((s) => s.id === id);
      if (idx <= 0) return;
      const updated = [...stickers];
      const item = updated.splice(idx, 1)[0];
      updated.splice(idx - 1, 0, item);
      updated.forEach((s, i) => (s.zIndex = i + 1));
      set({ stickers: updated });
      saveSnapshot(getSnapshot());
    },

    duplicateSticker: (id) => {
      const { stickers } = get();
      const original = stickers.find((s) => s.id === id);
      if (!original) return;
      const copy: PlacedSticker = {
        ...JSON.parse(JSON.stringify(original)),
        id: `sticker-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        x: original.x + 40,
        y: original.y + 40,
        zIndex: stickers.length + 1,
      };
      set({ stickers: [...stickers, copy], selectedStickerId: copy.id });
      saveSnapshot(getSnapshot());
    },

    flipSticker: (id) => {
      const { stickers } = get();
      const target = stickers.find((s) => s.id === id);
      if (!target) return;
      const updated = stickers.map((s) =>
        s.id === id ? { ...s, isFlipped: !s.isFlipped, scaleX: -s.scaleX } : s
      );
      set({ stickers: updated });
      saveSnapshot(getSnapshot());
    },

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const targetIndex = historyIndex - 1;
        const state = history[targetIndex];
        set({
          ...state,
          historyIndex: targetIndex,
          selectedStickerId: null,
        });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const targetIndex = historyIndex + 1;
        const state = history[targetIndex];
        set({
          ...state,
          historyIndex: targetIndex,
          selectedStickerId: null,
        });
      }
    },

    resetEditor: () =>
      set({
        selectedFilter: 'none',
        selectedThemeId: 'blush',
        selectedTemplateId: 'classic-3x2',
        stickers: [],
        selectedStickerId: null,
        caption: 'twogether ♡',
        dateText: DEFAULT_DATE,
        history: [
          {
            stickers: [],
            selectedFilter: 'none',
            selectedThemeId: 'blush',
            selectedTemplateId: 'classic-3x2',
            caption: 'twogether ♡',
            dateText: DEFAULT_DATE,
          },
        ],
        historyIndex: 0,
      }),
  };
});
