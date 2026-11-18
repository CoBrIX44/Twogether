export interface StickerItem {
  id: string;
  name: string;
  category: 'mascots' | 'hearts-stars' | 'accessories' | 'washi-tape' | 'text-badges';
  svg: string;
  alt: string;
  defaultWidth: number;
  defaultHeight: number;
}

export const STICKER_CATALOGUE: StickerItem[] = [
  // --- MASCOTS ---
  {
    id: 'boba-bunny-happy',
    name: 'Boba Bunny Happy',
    category: 'mascots',
    alt: 'Boba the Bunny smiling happily with blush',
    defaultWidth: 120,
    defaultHeight: 130,
    svg: `<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg">
      <!-- Ears -->
      <ellipse cx="42" cy="35" rx="14" ry="32" fill="#FFF7F9" stroke="#3B2A35" stroke-width="4"/>
      <ellipse cx="42" cy="35" rx="8" ry="22" fill="#FF9EC4"/>
      <ellipse cx="78" cy="35" rx="14" ry="32" fill="#FFF7F9" stroke="#3B2A35" stroke-width="4"/>
      <ellipse cx="78" cy="35" rx="8" ry="22" fill="#FF9EC4"/>
      <!-- Head -->
      <circle cx="60" cy="80" r="42" fill="#FFF7F9" stroke="#3B2A35" stroke-width="4"/>
      <!-- Cheeks -->
      <ellipse cx="36" cy="88" rx="8" ry="5" fill="#FF9EC4" opacity="0.85"/>
      <ellipse cx="84" cy="88" rx="8" ry="5" fill="#FF9EC4" opacity="0.85"/>
      <!-- Eyes -->
      <ellipse cx="46" cy="76" rx="5" ry="6" fill="#3B2A35"/>
      <circle cx="44.5" cy="74" r="2" fill="#FFFFFF"/>
      <ellipse cx="74" cy="76" rx="5" ry="6" fill="#3B2A35"/>
      <circle cx="72.5" cy="74" r="2" fill="#FFFFFF"/>
      <!-- Nose & Mouth -->
      <ellipse cx="60" cy="82" rx="3.5" ry="2.5" fill="#F0629A"/>
      <path d="M54 86 Q60 91 66 86" stroke="#3B2A35" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Little heart clip -->
      <path d="M78 52 C78 48 83 48 86 51 C89 48 94 48 94 52 C94 57 86 62 86 62 C86 62 78 57 78 52 Z" fill="#F0629A"/>
    </svg>`
  },
  {
    id: 'boba-bunny-wink',
    name: 'Boba Bunny Wink',
    category: 'mascots',
    alt: 'Boba the Bunny winking cutely',
    defaultWidth: 120,
    defaultHeight: 130,
    svg: `<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="36" rx="14" ry="32" transform="rotate(-6 40 36)" fill="#FFF7F9" stroke="#3B2A35" stroke-width="4"/>
      <ellipse cx="40" cy="36" rx="8" ry="22" transform="rotate(-6 40 36)" fill="#FF9EC4"/>
      <ellipse cx="80" cy="36" rx="14" ry="32" transform="rotate(8 80 36)" fill="#FFF7F9" stroke="#3B2A35" stroke-width="4"/>
      <ellipse cx="80" cy="36" rx="8" ry="22" transform="rotate(8 80 36)" fill="#FF9EC4"/>
      <circle cx="60" cy="80" r="42" fill="#FFF7F9" stroke="#3B2A35" stroke-width="4"/>
      <ellipse cx="36" cy="88" rx="8" ry="5" fill="#FF9EC4" opacity="0.85"/>
      <ellipse cx="84" cy="88" rx="8" ry="5" fill="#FF9EC4" opacity="0.85"/>
      <!-- Left eye open -->
      <ellipse cx="46" cy="76" rx="5" ry="6" fill="#3B2A35"/>
      <circle cx="44.5" cy="74" r="2" fill="#FFFFFF"/>
      <!-- Right eye wink -->
      <path d="M70 77 Q75 72 80 77" stroke="#3B2A35" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="82" rx="3.5" ry="2.5" fill="#F0629A"/>
      <path d="M55 86 Q60 92 65 86" stroke="#3B2A35" stroke-width="3" fill="none" stroke-linecap="round"/>
      <polygon points="26,62 29,68 35,68 30,72 32,78 26,74 20,78 22,72 17,68 23,68" fill="#FFE9A8" stroke="#3B2A35" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'mochi-bear-rosy',
    name: 'Mochi Bear Rosy',
    category: 'mascots',
    alt: 'Mochi the Bear looking sweet and cozy',
    defaultWidth: 120,
    defaultHeight: 120,
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <!-- Ears -->
      <circle cx="34" cy="36" r="18" fill="#DDB892" stroke="#3B2A35" stroke-width="4"/>
      <circle cx="34" cy="36" r="10" fill="#E6CCB2"/>
      <circle cx="86" cy="36" r="18" fill="#DDB892" stroke="#3B2A35" stroke-width="4"/>
      <circle cx="86" cy="36" r="10" fill="#E6CCB2"/>
      <!-- Head -->
      <circle cx="60" cy="68" r="42" fill="#DDB892" stroke="#3B2A35" stroke-width="4"/>
      <!-- Snout -->
      <ellipse cx="60" cy="75" rx="18" ry="14" fill="#F8F3ED"/>
      <ellipse cx="60" cy="70" rx="6" ry="4" fill="#3B2A35"/>
      <path d="M60 74 L60 80 M56 80 Q60 83 64 80" stroke="#3B2A35" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Eyes -->
      <circle cx="44" cy="62" r="5" fill="#3B2A35"/>
      <circle cx="42.5" cy="60" r="1.8" fill="#FFFFFF"/>
      <circle cx="76" cy="62" r="5" fill="#3B2A35"/>
      <circle cx="74.5" cy="60" r="1.8" fill="#FFFFFF"/>
      <!-- Blush -->
      <ellipse cx="36" cy="74" rx="7" ry="4.5" fill="#FF9EC4" opacity="0.9"/>
      <ellipse cx="84" cy="74" rx="7" ry="4.5" fill="#FF9EC4" opacity="0.9"/>
    </svg>`
  },
  {
    id: 'kiki-cat-kawaii',
    name: 'Kiki the Cat',
    category: 'mascots',
    alt: 'Kiki the Cat with cute whiskers',
    defaultWidth: 120,
    defaultHeight: 120,
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <!-- Ears -->
      <polygon points="20,54 36,16 56,42" fill="#FFFFFF" stroke="#3B2A35" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="26,48 37,24 50,42" fill="#FF9EC4"/>
      <polygon points="64,42 84,16 100,54" fill="#FFFFFF" stroke="#3B2A35" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="70,42 83,24 94,48" fill="#FF9EC4"/>
      <!-- Head -->
      <ellipse cx="60" cy="70" rx="42" ry="38" fill="#FFFFFF" stroke="#3B2A35" stroke-width="4"/>
      <!-- Eyes -->
      <ellipse cx="44" cy="64" rx="5" ry="6" fill="#3B2A35"/>
      <circle cx="42.5" cy="62" r="2" fill="#FFFFFF"/>
      <ellipse cx="76" cy="64" rx="5" ry="6" fill="#3B2A35"/>
      <circle cx="74.5" cy="62" r="2" fill="#FFFFFF"/>
      <!-- Nose & Mouth -->
      <polygon points="57,72 63,72 60,75" fill="#F0629A"/>
      <path d="M54 77 Q60 81 66 77" stroke="#3B2A35" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Whiskers -->
      <line x1="22" y1="68" x2="36" y2="70" stroke="#3B2A35" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="20" y1="76" x2="35" y2="75" stroke="#3B2A35" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="84" y1="70" x2="98" y2="68" stroke="#3B2A35" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="85" y1="75" x2="100" y2="76" stroke="#3B2A35" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Blush -->
      <ellipse cx="36" cy="74" rx="6" ry="4" fill="#FF9EC4" opacity="0.8"/>
      <ellipse cx="84" cy="74" rx="6" ry="4" fill="#FF9EC4" opacity="0.8"/>
    </svg>`
  },
  {
    id: 'twinkle-star-blob',
    name: 'Twinkle Star Blob',
    category: 'mascots',
    alt: 'Happy glowing kawaii pastel star',
    defaultWidth: 110,
    defaultHeight: 110,
    svg: `<svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
      <path d="M55 12 C57 28 66 38 78 40 C94 43 96 52 86 64 C76 74 76 84 82 96 C70 94 62 88 55 94 C48 88 40 94 28 96 C34 84 34 74 24 64 C14 52 16 43 32 40 C44 38 53 28 55 12 Z" fill="#FFE9A8" stroke="#3B2A35" stroke-width="4" stroke-linejoin="round"/>
      <!-- Kawaii eyes -->
      <circle cx="45" cy="54" r="5" fill="#3B2A35"/>
      <circle cx="43.5" cy="52" r="1.8" fill="#FFFFFF"/>
      <circle cx="65" cy="54" r="5" fill="#3B2A35"/>
      <circle cx="63.5" cy="52" r="1.8" fill="#FFFFFF"/>
      <!-- Cute open mouth -->
      <path d="M51 60 Q55 67 59 60" stroke="#3B2A35" stroke-width="3" fill="#F0629A" stroke-linecap="round"/>
      <!-- Cheeks -->
      <circle cx="39" cy="60" r="4.5" fill="#FF9EC4" opacity="0.9"/>
      <circle cx="71" cy="60" r="4.5" fill="#FF9EC4" opacity="0.9"/>
    </svg>`
  },

  // --- HEARTS & STARS ---
  {
    id: 'sparkles-trio',
    name: 'Sparkles Trio',
    category: 'hearts-stars',
    alt: 'Magical pastel twinkle stars',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Big star -->
      <path d="M45 10 C46 25 55 34 70 35 C55 36 46 45 45 60 C44 45 35 36 20 35 C35 34 44 25 45 10 Z" fill="#FFE9A8" stroke="#3B2A35" stroke-width="3"/>
      <!-- Medium star -->
      <path d="M78 50 C79 58 84 63 92 64 C84 65 79 70 78 78 C77 70 72 65 64 64 C72 63 77 58 78 50 Z" fill="#FF9EC4" stroke="#3B2A35" stroke-width="2.5"/>
      <!-- Small star -->
      <path d="M24 64 C25 69 28 72 33 73 C28 74 25 77 24 82 C23 77 20 74 15 73 C20 72 23 69 24 64 Z" fill="#C9B6F2" stroke="#3B2A35" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'double-hearts',
    name: 'Double Floating Hearts',
    category: 'hearts-stars',
    alt: 'Two cute blushing hearts floating together',
    defaultWidth: 110,
    defaultHeight: 90,
    svg: `<svg viewBox="0 0 110 90" xmlns="http://www.w3.org/2000/svg">
      <!-- Main pink heart -->
      <path d="M42 22 C42 12 52 8 60 18 C68 8 78 12 78 22 C78 38 60 54 60 54 C60 54 42 38 42 22 Z" fill="#F0629A" stroke="#3B2A35" stroke-width="3.5"/>
      <ellipse cx="50" cy="22" rx="3" ry="5" transform="rotate(-25 50 22)" fill="#FFFFFF" opacity="0.6"/>
      <!-- Little companion heart -->
      <path d="M16 46 C16 38 24 35 30 43 C36 35 44 38 44 46 C44 58 30 70 30 70 C30 70 16 58 16 46 Z" fill="#FF9EC4" stroke="#3B2A35" stroke-width="3"/>
      <ellipse cx="22" cy="46" rx="2" ry="3.5" transform="rotate(-25 22 46)" fill="#FFFFFF" opacity="0.6"/>
      <circle cx="85" cy="40" r="3" fill="#FFE9A8" stroke="#3B2A35" stroke-width="1.5"/>
      <circle cx="78" cy="64" r="4" fill="#C9B6F2" stroke="#3B2A35" stroke-width="1.5"/>
    </svg>`
  },

  // --- ACCESSORIES ---
  {
    id: 'pink-ribbon-bow',
    name: 'Pink Ribbon Bow',
    category: 'accessories',
    alt: 'Charming pink silk ribbon bow',
    defaultWidth: 110,
    defaultHeight: 90,
    svg: `<svg viewBox="0 0 110 90" xmlns="http://www.w3.org/2000/svg">
      <!-- Tails -->
      <path d="M46 44 L28 82 L42 76 L52 52 Z" fill="#F0629A" stroke="#3B2A35" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M64 44 L82 82 L68 76 L58 52 Z" fill="#F0629A" stroke="#3B2A35" stroke-width="3.5" stroke-linejoin="round"/>
      <!-- Loops -->
      <path d="M52 40 C34 22 14 30 16 46 C18 60 42 48 52 44 Z" fill="#FF9EC4" stroke="#3B2A35" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M58 40 C76 22 96 30 94 46 C92 60 68 48 58 44 Z" fill="#FF9EC4" stroke="#3B2A35" stroke-width="3.5" stroke-linejoin="round"/>
      <!-- Center Knot -->
      <ellipse cx="55" cy="42" rx="9" ry="8" fill="#F0629A" stroke="#3B2A35" stroke-width="3.5"/>
      <circle cx="53" cy="40" r="2" fill="#FFFFFF" opacity="0.7"/>
    </svg>`
  },
  {
    id: 'heart-sunglasses',
    name: 'Heart Sunglasses',
    category: 'accessories',
    alt: 'Fun retro pink heart-shaped sunglasses',
    defaultWidth: 130,
    defaultHeight: 70,
    svg: `<svg viewBox="0 0 130 70" xmlns="http://www.w3.org/2000/svg">
      <!-- Bridge -->
      <path d="M58 28 Q65 24 72 28" stroke="#3B2A35" stroke-width="4" fill="none" stroke-linecap="round"/>
      <!-- Left Frame & Lens -->
      <path d="M22 18 C16 18 10 24 10 32 C10 46 38 60 38 60 C38 60 66 46 66 32 C66 24 60 18 54 18 C46 18 38 26 38 26 C38 26 30 18 22 18 Z" fill="#F0629A" stroke="#3B2A35" stroke-width="4"/>
      <path d="M24 22 C19 22 14 26 14 33 C14 43 38 54 38 54 C38 54 62 43 62 33 C62 26 57 22 52 22 C46 22 38 29 38 29 C38 29 30 22 24 22 Z" fill="#3B2A35"/>
      <line x1="20" y1="26" x2="30" y2="44" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
      <!-- Right Frame & Lens -->
      <path d="M76 18 C70 18 64 24 64 32 C64 46 92 60 92 60 C92 60 120 46 120 32 C120 24 114 18 108 18 C100 18 92 26 92 26 C92 26 84 18 76 18 Z" fill="#F0629A" stroke="#3B2A35" stroke-width="4"/>
      <path d="M78 22 C73 22 68 26 68 33 C68 43 92 54 92 54 C92 54 116 43 116 33 C116 26 111 22 106 22 C100 22 92 29 92 29 C92 29 84 22 78 22 Z" fill="#3B2A35"/>
      <line x1="74" y1="26" x2="84" y2="44" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'sweet-cherries',
    name: 'Sweet Cherries',
    category: 'accessories',
    alt: 'Pair of glossy red cherries with leaf',
    defaultWidth: 90,
    defaultHeight: 90,
    svg: `<svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
      <!-- Stems -->
      <path d="M34 52 Q44 26 62 16" stroke="#588157" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M58 58 Q54 34 62 16" stroke="#588157" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Leaf -->
      <path d="M62 16 Q76 12 80 22 Q72 26 62 16 Z" fill="#BFEBD8" stroke="#3B2A35" stroke-width="2.5"/>
      <!-- Left Cherry -->
      <circle cx="34" cy="56" r="16" fill="#E5484D" stroke="#3B2A35" stroke-width="3.5"/>
      <ellipse cx="29" cy="51" rx="4" ry="2.5" transform="rotate(-30 29 51)" fill="#FFFFFF" opacity="0.7"/>
      <!-- Right Cherry -->
      <circle cx="58" cy="62" r="16" fill="#E5484D" stroke="#3B2A35" stroke-width="3.5"/>
      <ellipse cx="53" cy="57" rx="4" ry="2.5" transform="rotate(-30 53 57)" fill="#FFFFFF" opacity="0.7"/>
    </svg>`
  },

  // --- WASHI TAPE ---
  {
    id: 'washi-tape-pink',
    name: 'Washi Tape Pink Check',
    category: 'washi-tape',
    alt: 'Pastel pink textured washi tape strip',
    defaultWidth: 140,
    defaultHeight: 45,
    svg: `<svg viewBox="0 0 140 45" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pink-check" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#F0629A" opacity="0.2"/>
          <rect x="6" y="6" width="6" height="6" fill="#F0629A" opacity="0.2"/>
        </pattern>
      </defs>
      <polygon points="4,4 136,2 134,42 2,40" fill="#FF9EC4" opacity="0.85"/>
      <polygon points="4,4 136,2 134,42 2,40" fill="url(#pink-check)"/>
      <!-- Torn tape edges -->
      <path d="M4 4 L0 10 L5 16 L1 24 L5 32 L2 40" stroke="#3B2A35" stroke-width="2" fill="none"/>
      <path d="M136 2 L140 8 L135 18 L139 28 L134 42" stroke="#3B2A35" stroke-width="2" fill="none"/>
      <line x1="4" y1="4" x2="136" y2="2" stroke="#3B2A35" stroke-width="2"/>
      <line x1="2" y1="40" x2="134" y2="42" stroke="#3B2A35" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'washi-tape-mint',
    name: 'Washi Tape Mint Polka',
    category: 'washi-tape',
    alt: 'Mint green polka dot washi tape strip',
    defaultWidth: 140,
    defaultHeight: 45,
    svg: `<svg viewBox="0 0 140 45" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="mint-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="2.5" fill="#FFFFFF" opacity="0.75"/>
        </pattern>
      </defs>
      <polygon points="5,3 135,5 133,41 3,39" fill="#BFEBD8" opacity="0.9"/>
      <polygon points="5,3 135,5 133,41 3,39" fill="url(#mint-dots)"/>
      <path d="M5 3 L1 9 L6 18 L2 27 L6 34 L3 39" stroke="#3B2A35" stroke-width="2" fill="none"/>
      <path d="M135 5 L139 12 L134 20 L138 30 L133 41" stroke="#3B2A35" stroke-width="2" fill="none"/>
      <line x1="5" y1="3" x2="135" y2="5" stroke="#3B2A35" stroke-width="2"/>
      <line x1="3" y1="39" x2="133" y2="41" stroke="#3B2A35" stroke-width="2"/>
    </svg>`
  },

  // --- TEXT BADGES ---
  {
    id: 'badge-love-you',
    name: 'Love You Badge',
    category: 'text-badges',
    alt: 'Cute bubble saying Love You ♡',
    defaultWidth: 120,
    defaultHeight: 60,
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="108" height="48" rx="24" fill="#FFE9A8" stroke="#3B2A35" stroke-width="3.5"/>
      <text x="60" y="36" font-family="'Fredoka', cursive, sans-serif" font-size="18" font-weight="700" fill="#3B2A35" text-anchor="middle">LOVE YOU ♡</text>
    </svg>`
  },
  {
    id: 'badge-besties',
    name: 'Besties 4 Ever',
    category: 'text-badges',
    alt: 'Pastel badge saying Besties 4 Ever',
    defaultWidth: 130,
    defaultHeight: 60,
    svg: `<svg viewBox="0 0 130 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="118" height="48" rx="24" fill="#C9B6F2" stroke="#3B2A35" stroke-width="3.5"/>
      <text x="65" y="36" font-family="'Fredoka', cursive, sans-serif" font-size="16" font-weight="700" fill="#3B2A35" text-anchor="middle">BESTIES ✨</text>
    </svg>`
  }
];

export function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}
