import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionStore } from '@/stores/sessionStore';

describe('useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.getState().resetSession();
  });

  it('initializes with default values', () => {
    const state = useSessionStore.getState();
    expect(state.step).toBe('landing');
    expect(state.mode).toBe('same-device');
    expect(state.subMode).toBe('same-frame');
    expect(state.currentRound).toBe(0);
    expect(state.frames).toHaveLength(0);
    expect(state.isMuted).toBe(false);
  });

  it('updates step correctly', () => {
    useSessionStore.getState().setStep('capture');
    expect(useSessionStore.getState().step).toBe('capture');
  });

  it('adds frames and maintains slot integrity', () => {
    const frame1 = { round: 0, slot: 0, dataUrl: 'data:img1', timestamp: 1000 };
    const frame2 = { round: 0, slot: 1, dataUrl: 'data:img2', timestamp: 1001 };

    useSessionStore.getState().addFrame(frame1);
    useSessionStore.getState().addFrame(frame2);

    expect(useSessionStore.getState().frames).toHaveLength(2);
    expect(useSessionStore.getState().frames[0].slot).toBe(0);
    expect(useSessionStore.getState().frames[1].slot).toBe(1);
  });

  it('replaces round frames during retake', () => {
    // Add round 0 and round 1
    useSessionStore.getState().addFrame({ round: 0, slot: 0, dataUrl: 'data:old-0', timestamp: 1000 });
    useSessionStore.getState().addFrame({ round: 0, slot: 1, dataUrl: 'data:old-1', timestamp: 1001 });
    useSessionStore.getState().addFrame({ round: 1, slot: 0, dataUrl: 'data:r1-0', timestamp: 1002 });

    // Retake round 0
    const newFrames = [
      { round: 0, slot: 0, dataUrl: 'data:new-0', timestamp: 2000 },
      { round: 0, slot: 1, dataUrl: 'data:new-1', timestamp: 2001 },
    ];
    useSessionStore.getState().replaceRoundFrames(0, newFrames);

    const frames = useSessionStore.getState().frames;
    expect(frames).toHaveLength(3);
    const r0Slot0 = frames.find((f) => f.round === 0 && f.slot === 0);
    expect(r0Slot0?.dataUrl).toBe('data:new-0');
  });

  it('toggles sound mute', () => {
    expect(useSessionStore.getState().isMuted).toBe(false);
    useSessionStore.getState().toggleMute();
    expect(useSessionStore.getState().isMuted).toBe(true);
  });
});
