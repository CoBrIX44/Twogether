import { create } from 'zustand';
import { AppStep, SessionMode, SameDeviceSubMode, PhotoSlot } from '@/types';

interface SessionState {
  step: AppStep;
  mode: SessionMode;
  subMode: SameDeviceSubMode;
  currentRound: number; // 0, 1, 2
  currentPersonTurn: number; // 0 (Person 1) or 1 (Person 2)
  frames: PhotoSlot[];
  isMuted: boolean;
  timerDuration: number; // 3, 5, 10
  retakeTargetRound: number | null;

  // Actions
  setStep: (step: AppStep) => void;
  setMode: (mode: SessionMode) => void;
  setSubMode: (subMode: SameDeviceSubMode) => void;
  addFrame: (frame: PhotoSlot) => void;
  replaceRoundFrames: (round: number, frames: PhotoSlot[]) => void;
  setCurrentRound: (round: number) => void;
  setCurrentPersonTurn: (turn: number) => void;
  setRetakeTargetRound: (round: number | null) => void;
  toggleMute: () => void;
  setTimerDuration: (seconds: number) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  step: 'landing',
  mode: 'same-device',
  subMode: 'same-frame',
  currentRound: 0,
  currentPersonTurn: 0,
  frames: [],
  isMuted: false,
  timerDuration: 3,
  retakeTargetRound: null,

  setStep: (step) => set({ step }),
  setMode: (mode) => set({ mode }),
  setSubMode: (subMode) => set({ subMode }),

  addFrame: (newFrame) =>
    set((state) => {
      // Replace existing slot if it exists or append
      const filtered = state.frames.filter(
        (f) => !(f.round === newFrame.round && f.slot === newFrame.slot)
      );
      return { frames: [...filtered, newFrame] };
    }),

  replaceRoundFrames: (round, newFrames) =>
    set((state) => {
      const remaining = state.frames.filter((f) => f.round !== round);
      return { frames: [...remaining, ...newFrames] };
    }),

  setCurrentRound: (currentRound) => set({ currentRound }),
  setCurrentPersonTurn: (currentPersonTurn) => set({ currentPersonTurn }),
  setRetakeTargetRound: (retakeTargetRound) => set({ retakeTargetRound }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setTimerDuration: (timerDuration) => set({ timerDuration }),

  resetSession: () =>
    set({
      step: 'landing',
      currentRound: 0,
      currentPersonTurn: 0,
      frames: [],
      retakeTargetRound: null,
    }),
}));
