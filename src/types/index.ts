export type AppStep =
  | 'landing'
  | 'mode-select'
  | 'remote-setup'
  | 'capture'
  | 'review'
  | 'editor'
  | 'export';

export type SessionMode = 'same-device' | 'together-remote';

export type SameDeviceSubMode = 'same-frame' | 'taking-turns';

export type RemoteRole = 'host' | 'guest';

export type RemoteConnectionStatus =
  | 'idle'
  | 'creating'
  | 'waiting-for-peer'
  | 'joining'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'room-full'
  | 'error';

export interface RemoteParticipant {
  id: string;
  name: string;
  isReady: boolean;
  role: RemoteRole;
  stream?: MediaStream | null;
}

export interface PhotoSlot {
  round: number; // 0, 1, 2
  slot: number;  // 0 (Person 1 / Host), 1 (Person 2 / Guest)
  dataUrl: string;
  timestamp: number;
}

export interface StripTheme {
  id: string;
  name: string;
  background: string;
  textColor: string;
  borderColor: string;
  borderStyle?: 'solid' | 'dashed' | 'checkered';
  accentColor: string;
}

export type FilterId =
  | 'none'
  | 'bw'
  | 'pink-blush'
  | 'lavender-dream'
  | 'sepia'
  | 'warm'
  | 'cool';

export interface FilterPreset {
  id: FilterId;
  name: string;
  cssFilter: string;
  overlayColor?: string;
  overlayBlendMode?: GlobalCompositeOperation;
  description: string;
}

export interface PlacedSticker {
  id: string;
  assetId: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  zIndex: number;
  isFlipped: boolean;
}

export interface StripTemplateConfig {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  padding: number;
  gapX: number;
  gapY: number;
  photoWidth: number;
  photoHeight: number;
  headerHeight: number;
  footerHeight: number;
  stripFrameImageUrl?: string;
  frameSlices?: {
    bTop: number;
    bBottom: number;
    bLeft: number;
    bRight: number;
    dTop: number;
    dBottom: number;
    dLeft: number;
    dRight: number;
  };
  overlayImageUrl?: string;
  previewImageUrl?: string;
  slotFrameImageUrl?: string;
  slots: Array<{
    round: number;
    slot: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf';
  quality: number; // 0.8 - 1.0
  pdfLayout?: 'strip-only' | '4x6-print' | 'a4-sheet';
}

// Remote signaling messages over WebRTC data channel
export type RemoteMessage =
  | { type: 'PARTNER_JOINED'; name: string }
  | { type: 'SYNC_READY'; isReady: boolean }
  | { type: 'START_COUNTDOWN'; duration: number; timestamp: number }
  | { type: 'CAPTURE_FRAME'; round: number; slot: number; dataUrl: string }
  | { type: 'RETAKE_ROUND'; round: number }
  | { type: 'PROCEED_STEP'; step: AppStep }
  | { type: 'SYNC_TEMPLATE'; templateId: string }
  | { type: 'SYNC_FILTER'; filterId: FilterId }
  | { type: 'SYNC_THEME'; themeId: string }
  | { type: 'SYNC_CAPTION'; caption: string }
  | { type: 'ROOM_FULL' }
  | { type: 'PEER_LEFT' };
