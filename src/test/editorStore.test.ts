import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '@/stores/editorStore';

describe('useEditorStore', () => {
  beforeEach(() => {
    useEditorStore.getState().resetEditor();
  });

  it('initializes with default filter and theme', () => {
    const state = useEditorStore.getState();
    expect(state.selectedFilter).toBe('none');
    expect(state.selectedThemeId).toBe('white');
    expect(state.stickers).toHaveLength(0);
    expect(state.caption).toBe('twogether ♡');
  });

  it('updates filter and creates history snapshot', () => {
    useEditorStore.getState().setFilter('bw');
    expect(useEditorStore.getState().selectedFilter).toBe('bw');
    expect(useEditorStore.getState().canUndo()).toBe(true);
  });

  it('adds and updates a sticker', () => {
    useEditorStore.getState().addSticker('boba-bunny-happy', 300, 400);
    const stickers = useEditorStore.getState().stickers;
    expect(stickers).toHaveLength(1);
    expect(stickers[0].assetId).toBe('boba-bunny-happy');
    expect(stickers[0].x).toBe(300);
    expect(stickers[0].y).toBe(400);

    // Update sticker
    useEditorStore.getState().updateSticker(stickers[0].id, { rotation: 45 });
    expect(useEditorStore.getState().stickers[0].rotation).toBe(45);
  });

  it('supports undo and redo', () => {
    useEditorStore.getState().setCaption('Hello World');
    expect(useEditorStore.getState().caption).toBe('Hello World');

    useEditorStore.getState().undo();
    expect(useEditorStore.getState().caption).toBe('twogether ♡');

    useEditorStore.getState().redo();
    expect(useEditorStore.getState().caption).toBe('Hello World');
  });

  it('duplicates and flips sticker', () => {
    useEditorStore.getState().addSticker('sparkles-trio', 100, 100);
    const stickerId = useEditorStore.getState().stickers[0].id;

    useEditorStore.getState().duplicateSticker(stickerId);
    expect(useEditorStore.getState().stickers).toHaveLength(2);

    useEditorStore.getState().flipSticker(stickerId);
    expect(useEditorStore.getState().stickers[0].isFlipped).toBe(true);
    expect(useEditorStore.getState().stickers[0].scaleX).toBeLessThan(0);
  });
});
