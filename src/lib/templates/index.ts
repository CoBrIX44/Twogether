import { StripTemplateConfig, StripTheme } from '@/types';

export const CLASSIC_3X2_TEMPLATE: StripTemplateConfig = {
  id: 'classic-3x2',
  name: 'Classic 3x2 Duo Strip',
  width: 1200,
  height: 2600,
  padding: 48,
  gapX: 24,
  gapY: 28,
  photoWidth: 540,
  photoHeight: 720,
  headerHeight: 120,
  footerHeight: 180,
  slots: [
    // Round 1 (Top)
    { round: 0, slot: 0, x: 48, y: 168, width: 540, height: 720 },
    { round: 0, slot: 1, x: 612, y: 168, width: 540, height: 720 },
    // Round 2 (Middle)
    { round: 1, slot: 0, x: 48, y: 916, width: 540, height: 720 },
    { round: 1, slot: 1, x: 612, y: 916, width: 540, height: 720 },
    // Round 3 (Bottom)
    { round: 2, slot: 0, x: 48, y: 1664, width: 540, height: 720 },
    { round: 2, slot: 1, x: 612, y: 1664, width: 540, height: 720 },
  ],
};

export const STRIP_THEMES: StripTheme[] = [
  {
    id: 'blush',
    name: 'Blush Dream',
    background: '#FFF7F9',
    textColor: '#3B2A35',
    borderColor: '#FF9EC4',
    borderStyle: 'solid',
    accentColor: '#F0629A',
  },
  {
    id: 'white',
    name: 'Classic White',
    background: '#FFFFFF',
    textColor: '#3B2A35',
    borderColor: '#E8DCE4',
    borderStyle: 'solid',
    accentColor: '#3B2A35',
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    background: '#F7F3FF',
    textColor: '#2E2347',
    borderColor: '#C9B6F2',
    borderStyle: 'solid',
    accentColor: '#9A7BE0',
  },
  {
    id: 'mint',
    name: 'Pastel Mint',
    background: '#F0FAF6',
    textColor: '#223830',
    borderColor: '#BFEBD8',
    borderStyle: 'solid',
    accentColor: '#52B788',
  },
  {
    id: 'butter',
    name: 'Butter Honey',
    background: '#FFFDF2',
    textColor: '#42361A',
    borderColor: '#FFE9A8',
    borderStyle: 'solid',
    accentColor: '#E6A700',
  },
  {
    id: 'noir',
    name: 'Midnight Noir',
    background: '#1F1620',
    textColor: '#FFF7F9',
    borderColor: '#4A3644',
    borderStyle: 'solid',
    accentColor: '#FF9EC4',
  },
];
