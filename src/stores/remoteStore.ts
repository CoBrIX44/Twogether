import { create } from 'zustand';
import { RemoteRole, RemoteConnectionStatus } from '@/types';

interface RemoteStoreState {
  roomCode: string | null;
  role: RemoteRole | null;
  status: RemoteConnectionStatus;
  userName: string;
  partnerName: string;
  isLocalReady: boolean;
  isPartnerReady: boolean;
  remoteStream: MediaStream | null;
  errorMessage: string | null;

  // Actions
  setRoomCode: (code: string | null) => void;
  setRole: (role: RemoteRole | null) => void;
  setStatus: (status: RemoteConnectionStatus) => void;
  setUserName: (name: string) => void;
  setPartnerName: (name: string) => void;
  setIsLocalReady: (ready: boolean) => void;
  setIsPartnerReady: (ready: boolean) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setErrorMessage: (msg: string | null) => void;
  resetRemote: () => void;
}

export const useRemoteStore = create<RemoteStoreState>((set) => ({
  roomCode: null,
  role: null,
  status: 'idle',
  userName: 'You',
  partnerName: 'Partner',
  isLocalReady: false,
  isPartnerReady: false,
  remoteStream: null,
  errorMessage: null,

  setRoomCode: (roomCode) => set({ roomCode }),
  setRole: (role) => set({ role }),
  setStatus: (status) => set({ status }),
  setUserName: (userName) => set({ userName }),
  setPartnerName: (partnerName) => set({ partnerName }),
  setIsLocalReady: (isLocalReady) => set({ isLocalReady }),
  setIsPartnerReady: (isPartnerReady) => set({ isPartnerReady }),
  setRemoteStream: (remoteStream) => set({ remoteStream }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  resetRemote: () =>
    set({
      roomCode: null,
      role: null,
      status: 'idle',
      isLocalReady: false,
      isPartnerReady: false,
      remoteStream: null,
      errorMessage: null,
    }),
}));
