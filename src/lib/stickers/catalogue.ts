export interface StickerItem {
  id: string;
  name: string;
  category: 'mascots' | 'retro-vibes' | 'hearts-stars' | 'nature-blooms' | 'pins-badges' | 'washi-tape';
  svg?: string;
  imageUrl?: string;
  alt: string;
  defaultWidth: number;
  defaultHeight: number;
}

export const STICKER_CATALOGUE: StickerItem[] = [
  // --- REAL IMAGE STICKERS (Provided in stickers/) ---
  // Mascots & Characters
  {
    id: 'guitar-kitten',
    name: 'Guitar Kitten',
    category: 'mascots',
    imageUrl: '/stickers/guitar_kitten.png',
    alt: 'Cute kitten playing an acoustic guitar sticker',
    defaultWidth: 120,
    defaultHeight: 140,
  },
  {
    id: 'rock-cat-guitar',
    name: 'Rock Cat Guitar',
    category: 'mascots',
    imageUrl: '/stickers/rock_cat_guitar.png',
    alt: 'Cool rock and roll cat playing electric guitar',
    defaultWidth: 130,
    defaultHeight: 130,
  },

  // Retro Vibes
  {
    id: 'cassette-tapes',
    name: 'Cassette Tapes',
    category: 'retro-vibes',
    imageUrl: '/stickers/cassette_tapes.png',
    alt: 'Vintage cassette mixtapes stack sticker',
    defaultWidth: 140,
    defaultHeight: 120,
  },
  {
    id: 'vinyl-record',
    name: 'Vinyl Record',
    category: 'retro-vibes',
    imageUrl: '/stickers/vinyl_record.png',
    alt: 'Classic vinyl record album sticker',
    defaultWidth: 120,
    defaultHeight: 120,
  },
  {
    id: 'retro-camera',
    name: 'Retro Camera',
    category: 'retro-vibes',
    imageUrl: '/stickers/retro_camera.png',
    alt: 'Vintage analog camera photobooth sticker',
    defaultWidth: 140,
    defaultHeight: 110,
  },
  {
    id: 'red-rotary-phone',
    name: 'Red Rotary Phone',
    category: 'retro-vibes',
    imageUrl: '/stickers/red_rotary_phone.png',
    alt: 'Vintage cherry red rotary telephone sticker',
    defaultWidth: 130,
    defaultHeight: 110,
  },
  {
    id: 'cola-bottle-cap',
    name: 'Cola Bottle Cap',
    category: 'retro-vibes',
    imageUrl: '/stickers/cola_bottle_cap.png',
    alt: 'Retro soda bottle cap sticker',
    defaultWidth: 100,
    defaultHeight: 110,
  },
  {
    id: 'cigarette-pack',
    name: 'Vintage Matchbox',
    category: 'retro-vibes',
    imageUrl: '/stickers/cigarette_pack.png',
    alt: 'Retro illustrated matchbox pack sticker',
    defaultWidth: 110,
    defaultHeight: 125,
  },

  // Hearts & Stars
  {
    id: 'red-heart-gloss',
    name: 'Glossy Red Heart',
    category: 'hearts-stars',
    imageUrl: '/stickers/red_heart.png',
    alt: 'Glossy red heart sticker',
    defaultWidth: 110,
    defaultHeight: 105,
  },
  {
    id: 'red-star-chubby',
    name: 'Red Star',
    category: 'hearts-stars',
    imageUrl: '/stickers/red_star.png',
    alt: 'Cute red star sticker',
    defaultWidth: 95,
    defaultHeight: 95,
  },
  {
    id: 'striped-star',
    name: 'Striped Star',
    category: 'hearts-stars',
    imageUrl: '/stickers/striped_star.png',
    alt: 'Candy striped star sticker',
    defaultWidth: 115,
    defaultHeight: 115,
  },
  {
    id: 'shooting-star-doodle',
    name: 'Shooting Star',
    category: 'hearts-stars',
    imageUrl: '/stickers/shooting_star_doodle.png',
    alt: 'Hand-drawn shooting star trail sticker',
    defaultWidth: 100,
    defaultHeight: 140,
  },
  {
    id: 'doodle-sparkles',
    name: 'Doodle Sparkles',
    category: 'hearts-stars',
    imageUrl: '/stickers/doodle_sparkles.png',
    alt: 'Magical doodle twinkle sparkles sticker',
    defaultWidth: 100,
    defaultHeight: 115,
  },

  // Nature & Blooms
  {
    id: 'rose-bouquet',
    name: 'Rose Bouquet',
    category: 'nature-blooms',
    imageUrl: '/stickers/rose_bouquet.png',
    alt: 'Romantic red rose bouquet sticker',
    defaultWidth: 120,
    defaultHeight: 130,
  },
  {
    id: 'lily-flower',
    name: 'White Lily',
    category: 'nature-blooms',
    imageUrl: '/stickers/lily_flower.png',
    alt: 'Blooming white lily flower sticker',
    defaultWidth: 130,
    defaultHeight: 125,
  },
  {
    id: 'newspaper-butterfly',
    name: 'Paper Butterfly',
    category: 'nature-blooms',
    imageUrl: '/stickers/newspaper_butterfly.png',
    alt: 'Collage newspaper butterfly sticker',
    defaultWidth: 130,
    defaultHeight: 130,
  },
  {
    id: 'fish-on-sneakers',
    name: 'Sneaker Fish',
    category: 'nature-blooms',
    imageUrl: '/stickers/fish_on_sneakers.png',
    alt: 'Quirky illustrated fish on sneakers sticker',
    defaultWidth: 120,
    defaultHeight: 115,
  },

  // Pins & Badges
  {
    id: 'red-pushpin',
    name: 'Red Pushpin',
    category: 'pins-badges',
    imageUrl: '/stickers/red_pushpin.png',
    alt: '3D red pushpin thumbtack sticker',
    defaultWidth: 120,
    defaultHeight: 80,
  },
  {
    id: 'punk-skull',
    name: 'Punk Skull',
    category: 'pins-badges',
    imageUrl: '/stickers/punk_skull.png',
    alt: 'Cute grunge punk skull sticker',
    defaultWidth: 105,
    defaultHeight: 115,
  },
  {
    id: 'rock-band-cutout',
    name: 'Rock Band Badge',
    category: 'pins-badges',
    imageUrl: '/stickers/rock_band_cutout.png',
    alt: 'Vintage rock band paper cutout sticker',
    defaultWidth: 120,
    defaultHeight: 120,
  },

  // --- ORIGINAL VECTOR MASCOTS & ACCENT STICKERS ---
  {
    id: 'boba-bunny-happy',
    name: 'Boba Bunny Happy',
    category: 'mascots',
    alt: 'Boba the Bunny smiling happily with blush',
    defaultWidth: 120,
    defaultHeight: 130,
    svg: `<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="42" cy="35" rx="14" ry="32" fill="#FFF7F9" stroke="#3B2A35" stroke-width="4"/>
      <ellipse cx="42" cy="35" rx="8" ry="22" fill="#FF9EC4"/>
      <ellipse cx="78" cy="35" rx="14" ry="32" fill="#FFF7F9" stroke="#3B2A35" stroke-width="4"/>
      <ellipse cx="78" cy="35" rx="8" ry="22" fill="#FF9EC4"/>
      <circle cx="60" cy="80" r="42" fill="#FFF7F9" stroke="#3B2A35" stroke-width="4"/>
      <ellipse cx="36" cy="88" rx="8" ry="5" fill="#FF9EC4" opacity="0.85"/>
      <ellipse cx="84" cy="88" rx="8" ry="5" fill="#FF9EC4" opacity="0.85"/>
      <ellipse cx="46" cy="76" rx="5" ry="6" fill="#3B2A35"/>
      <circle cx="44.5" cy="74" r="2" fill="#FFFFFF"/>
      <ellipse cx="74" cy="76" rx="5" ry="6" fill="#3B2A35"/>
      <circle cx="72.5" cy="74" r="2" fill="#FFFFFF"/>
      <ellipse cx="60" cy="82" rx="3.5" ry="2.5" fill="#F0629A"/>
      <path d="M54 86 Q60 91 66 86" stroke="#3B2A35" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M78 52 C78 48 83 48 86 51 C89 48 94 48 94 52 C94 57 86 62 86 62 C86 62 78 57 78 52 Z" fill="#F0629A"/>
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
      <circle cx="34" cy="36" r="18" fill="#DDB892" stroke="#3B2A35" stroke-width="4"/>
      <circle cx="34" cy="36" r="10" fill="#E6CCB2"/>
      <circle cx="86" cy="36" r="18" fill="#DDB892" stroke="#3B2A35" stroke-width="4"/>
      <circle cx="86" cy="36" r="10" fill="#E6CCB2"/>
      <circle cx="60" cy="68" r="42" fill="#DDB892" stroke="#3B2A35" stroke-width="4"/>
      <ellipse cx="60" cy="75" rx="18" ry="14" fill="#F8F3ED"/>
      <ellipse cx="60" cy="70" rx="6" ry="4" fill="#3B2A35"/>
      <path d="M60 74 L60 80 M56 80 Q60 83 64 80" stroke="#3B2A35" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="44" cy="62" r="5" fill="#3B2A35"/>
      <circle cx="42.5" cy="60" r="1.8" fill="#FFFFFF"/>
      <circle cx="76" cy="62" r="5" fill="#3B2A35"/>
      <circle cx="74.5" cy="60" r="1.8" fill="#FFFFFF"/>
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
      <polygon points="20,54 36,16 56,42" fill="#FFFFFF" stroke="#3B2A35" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="26,48 37,24 50,42" fill="#FF9EC4"/>
      <polygon points="64,42 84,16 100,54" fill="#FFFFFF" stroke="#3B2A35" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="70,42 83,24 94,48" fill="#FF9EC4"/>
      <ellipse cx="60" cy="70" rx="42" ry="38" fill="#FFFFFF" stroke="#3B2A35" stroke-width="4"/>
      <ellipse cx="44" cy="64" rx="5" ry="6" fill="#3B2A35"/>
      <circle cx="42.5" cy="62" r="2" fill="#FFFFFF"/>
      <ellipse cx="76" cy="64" rx="5" ry="6" fill="#3B2A35"/>
      <circle cx="74.5" cy="62" r="2" fill="#FFFFFF"/>
      <polygon points="57,72 63,72 60,75" fill="#F0629A"/>
      <path d="M54 77 Q60 81 66 77" stroke="#3B2A35" stroke-width="3" fill="none" stroke-linecap="round"/>
      <line x1="22" y1="68" x2="36" y2="70" stroke="#3B2A35" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="20" y1="76" x2="35" y2="75" stroke="#3B2A35" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="84" y1="70" x2="98" y2="68" stroke="#3B2A35" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="85" y1="75" x2="100" y2="76" stroke="#3B2A35" stroke-width="2.5" stroke-linecap="round"/>
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
      <circle cx="45" cy="54" r="5" fill="#3B2A35"/>
      <circle cx="43.5" cy="52" r="1.8" fill="#FFFFFF"/>
      <circle cx="65" cy="54" r="5" fill="#3B2A35"/>
      <circle cx="63.5" cy="52" r="1.8" fill="#FFFFFF"/>
      <path d="M51 60 Q55 67 59 60" stroke="#3B2A35" stroke-width="3" fill="#F0629A" stroke-linecap="round"/>
      <circle cx="39" cy="60" r="4.5" fill="#FF9EC4" opacity="0.9"/>
      <circle cx="71" cy="60" r="4.5" fill="#FF9EC4" opacity="0.9"/>
    </svg>`
  },

  // Washi Tape
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
  }
];

export function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}
