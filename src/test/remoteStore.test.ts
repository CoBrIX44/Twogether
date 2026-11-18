import { describe, it, expect, beforeEach } from 'vitest';
import { useRemoteStore } from '@/stores/remoteStore';
import { remoteManager } from '@/lib/remote/remoteManager';

describe('useRemoteStore & remoteManager', () => {
  beforeEach(() => {
    useRemoteStore.getState().resetRemote();
  });

  it('initializes with default disconnected/idle state', () => {
    const state = useRemoteStore.getState();
    expect(state.status).toBe('idle');
    expect(state.roomCode).toBeNull();
    expect(state.role).toBeNull();
    expect(state.userName).toBe('You');
    expect(state.partnerName).toBe('Partner');
  });

  it('updates room code, role and status correctly', () => {
    const store = useRemoteStore.getState();
    store.setRoomCode('TW-9021');
    store.setRole('host');
    store.setStatus('waiting-for-peer');
    store.setUserName('Taylor');
    store.setPartnerName('Jordan');

    const updated = useRemoteStore.getState();
    expect(updated.roomCode).toBe('TW-9021');
    expect(updated.role).toBe('host');
    expect(updated.status).toBe('waiting-for-peer');
    expect(updated.userName).toBe('Taylor');
    expect(updated.partnerName).toBe('Jordan');
  });

  it('generates random format room code starting with TW-', () => {
    const code = remoteManager.generateRoomCode();
    expect(code).toMatch(/^TW-[A-Z0-9]{4}$/);
  });

  it('resets all remote state when resetRemote is called', () => {
    const store = useRemoteStore.getState();
    store.setRoomCode('TW-TEST');
    store.setRole('guest');
    store.setStatus('connected');
    store.setIsLocalReady(true);
    store.setIsPartnerReady(true);

    store.resetRemote();

    const reset = useRemoteStore.getState();
    expect(reset.roomCode).toBeNull();
    expect(reset.role).toBeNull();
    expect(reset.status).toBe('idle');
    expect(reset.isLocalReady).toBe(false);
    expect(reset.isPartnerReady).toBe(false);
  });
});
