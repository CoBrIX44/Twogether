export type AppStep =
  | 'landing'
  | 'mode-select'
  | 'capture'
  | 'review'
  | 'editor'
  | 'export';

export type SessionMode = 'same-device' | 'together-remote';

export type SameDeviceSubMode = 'same-frame' | 'taking-turns';

export interface PhotoSlot {
  round: number; // 0, 1, 2
  slot: number;  // 0 (Person 1), 1 (Person 2)
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
  width: number;
  height: number;
  padding: number;
  gapX: number;
  gapY: number;
  photoWidth: number;
  photoHeight: number;
  headerHeight: number;
  footerHeight: number;
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
