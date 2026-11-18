import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { PermissionScreen } from '@/features/capture/PermissionScreen';
import { StickerTray } from '@/features/editor/StickerTray';
import { useEditorStore } from '@/stores/editorStore';

describe('UI Components', () => {
  it('renders button with label and responds to clicks', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me ♡</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders permission denied screen with instructions and retry button', () => {
    const handleRetry = vi.fn();
    render(
      <PermissionScreen
        errorType="PERMISSION_DENIED"
        errorMessage="Camera access was denied."
        onRetry={handleRetry}
      />
    );

    expect(screen.getByText(/camera permission needed/i)).toBeInTheDocument();
    expect(screen.getByText(/camera access was denied/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('renders sticker tray and allows adding a sticker', () => {
    useEditorStore.getState().resetEditor();
    render(<StickerTray />);

    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mascots/i })).toBeInTheDocument();

    const firstStickerBtn = screen.getByTitle(/add boba bunny happy/i);
    expect(firstStickerBtn).toBeInTheDocument();

    fireEvent.click(firstStickerBtn);
    expect(useEditorStore.getState().stickers).toHaveLength(1);
    expect(useEditorStore.getState().stickers[0].assetId).toBe('boba-bunny-happy');
  });
});
