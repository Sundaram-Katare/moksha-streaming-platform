import fs from 'fs';
import path from 'path';
import { Song, Playlist, Profile, SongLyric, LyricLanguage } from '@/types';

const DATA_DIR = path.join(process.cwd(), '.data');
const SONGS_FILE = path.join(DATA_DIR, 'songs.json');
const PLAYLISTS_FILE = path.join(DATA_DIR, 'playlists.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// -------------------------------------------------------------
// SONGS STORAGE
// -------------------------------------------------------------
export function getLocalSongs(): Song[] {
  ensureDataDir();
  if (!fs.existsSync(SONGS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(SONGS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalSong(song: Song): Song {
  ensureDataDir();
  const songs = getLocalSongs();
  const existingIdx = songs.findIndex((s) => s.id === song.id);
  if (existingIdx >= 0) {
    songs[existingIdx] = song;
  } else {
    songs.unshift(song);
  }
  fs.writeFileSync(SONGS_FILE, JSON.stringify(songs, null, 2), 'utf-8');
  return song;
}

export function updateSongLyrics(
  songId: string,
  lyricsList: { language: LyricLanguage; lyrics: string }[]
): Song | null {
  ensureDataDir();
  const songs = getLocalSongs();
  const song = songs.find((s) => s.id === songId);
  if (!song) return null;

  const now = new Date().toISOString();
  song.lyrics = lyricsList.map((item, idx) => ({
    id: `lyric-${songId}-${item.language}-${idx}`,
    song_id: songId,
    language: item.language,
    lyrics: item.lyrics,
    created_at: now,
    updated_at: now,
  }));
  song.updated_at = now;

  fs.writeFileSync(SONGS_FILE, JSON.stringify(songs, null, 2), 'utf-8');
  return song;
}

export function deleteLocalSong(id: string): boolean {
  ensureDataDir();
  const songs = getLocalSongs();
  const filtered = songs.filter((s) => s.id !== id);
  if (filtered.length !== songs.length) {
    fs.writeFileSync(SONGS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// PLAYLISTS STORAGE
// -------------------------------------------------------------
export function getLocalPlaylists(): Playlist[] {
  ensureDataDir();
  if (!fs.existsSync(PLAYLISTS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(PLAYLISTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalPlaylist(playlist: Playlist): Playlist {
  ensureDataDir();
  const playlists = getLocalPlaylists();
  const existingIdx = playlists.findIndex((p) => p.id === playlist.id);
  if (existingIdx >= 0) {
    playlists[existingIdx] = playlist;
  } else {
    playlists.unshift(playlist);
  }
  fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists, null, 2), 'utf-8');
  return playlist;
}

export function deleteLocalPlaylist(id: string): boolean {
  ensureDataDir();
  const playlists = getLocalPlaylists();
  const filtered = playlists.filter((p) => p.id !== id);
  if (filtered.length !== playlists.length) {
    fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// CATEGORIES STORAGE & ASSIGNMENTS
// -------------------------------------------------------------
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

export interface CategoryItem {
  id: string;
  name: string;
  hindi_name: string;
  slug: string;
  description?: string;
  tagline?: string;
  item_ids?: string[];
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-krishna',
    name: 'Krishna Bhajans',
    hindi_name: 'श्री कृष्ण भजन एवं कीर्तन',
    slug: 'krishna-bhajans',
    description: 'Vrindavan kirtans, flute ragas, and ecstatic Krishna melodies.',
    tagline: 'PREM & ANAND',
    item_ids: [
      'spotify-3Bu3KFn6Z401i6Qi86RMuq',
      'spotify-3sxl1co2tXTl9urLVJbfoJ',
      'spotify-5tRRnPcBlOiHi7fO0lZD8P',
      'spotify-4HrAUohLAiRbUYbFi6nYS9',
      'spotify-1hRttHYlXWdCSGtRMEvVhn',
      'yt-BL-qD4H24R4',
      'yt-s8in_gB1hD8',
      'yt-WcOEDOoaxz8',
      'yt-WPNrfr326pk',
    ],
  },
  {
    id: 'cat-ganesh',
    name: 'Ganesh Invocations',
    hindi_name: 'श्री गणेश वंदना एवं स्तुति',
    slug: 'ganesh-invocations',
    description: 'Auspicious morning mantras and prayer hymns to Lord Ganesha.',
    tagline: 'MANGAL & SIDDHI',
    item_ids: [
      'spotify-5sATw2cU3kCCEO8tTBZXUQ',
      'yt-gaDGpLvWMJo',
      'yt-a39zMTWjIsM',
    ],
  },
  {
    id: 'cat-aarti',
    name: 'Aarti & Stuti',
    hindi_name: 'पावन आरती एवं चालीसा संग्रह',
    slug: 'aarti-stuti',
    description: 'Authentic temple aartis and meditative divine stutis.',
    tagline: 'BHAKTI & PRAKASH',
    item_ids: [
      'spotify-31kEADJw24EeSmq6gIQ2g1',
      'yt-a39zMTWjIsM',
      'yt-U5yUFjoohG8',
      'yt-Q5jQx-mOma8',
    ],
  },
  {
    id: 'cat-stotrams',
    name: 'Vedic Stotrams',
    hindi_name: 'प्राचीन वैदिक स्तोत्र',
    slug: 'vedic-stotrams',
    description: 'Vedic chants and ancient Sanskrit stotrams in 432Hz tuning.',
    tagline: 'SHANTI & JNANA',
    item_ids: [
      'spotify-5OTfElbVJuBVo8SluZ62k9',
      'yt-fHj8bf-JneA',
    ],
  },
  {
    id: 'cat-dhyan',
    name: 'Mahamantra & Dhyan',
    hindi_name: 'महामंत्र जप एवं ध्यान',
    slug: 'mahamantra-dhyan',
    description: 'Continuous mantra chanting and meditative stillness for japa sadhana.',
    tagline: 'DHYAN & SAMADHI',
    item_ids: [
      'spotify-5F5d6a0KeYigcMVR0q20Ib',
      'yt-QEV0xChp95Q',
    ],
  },
  {
    id: 'cat-devi',
    name: 'Devi Stutis',
    hindi_name: 'माँ दुर्गा एवं देवी स्तुति',
    slug: 'devi-stutis',
    description: 'Divine Mother stutis, kavachas, and sacred shakti chants.',
    tagline: 'SHAKTI & TEJ',
    item_ids: [
      'spotify-1cdvlBtso5I0j4a1T3pb7K',
      'yt-Q5jQx-mOma8',
    ],
  },
  {
    id: 'cat-raga',
    name: 'Raga Meditation',
    hindi_name: 'शास्त्रीय राग एवं बाँसुरी संगीत',
    slug: 'raga-meditation',
    description: 'Indian classical ragas, meditative flute, and temple strings.',
    tagline: 'NADA BRAHMA',
    item_ids: [
      'yt-WPNrfr326pk',
    ],
  },
];

export function getLocalCategories(): CategoryItem[] {
  ensureDataDir();
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(DEFAULT_CATEGORIES, null, 2), 'utf-8');
    return DEFAULT_CATEGORIES;
  }
  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveLocalCategory(category: CategoryItem): CategoryItem {
  ensureDataDir();
  const categories = getLocalCategories();
  const existingIdx = categories.findIndex((c) => c.id === category.id || c.slug === category.slug);
  if (existingIdx >= 0) {
    categories[existingIdx] = category;
  } else {
    categories.push(category);
  }
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
  return category;
}

export function assignItemToCategory(categoryId: string, itemId: string): boolean {
  ensureDataDir();
  const categories = getLocalCategories();
  const cat = categories.find((c) => c.id === categoryId || c.slug === categoryId);
  if (!cat) return false;

  cat.item_ids = cat.item_ids || [];
  if (!cat.item_ids.includes(itemId)) {
    cat.item_ids.push(itemId);
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
  }
  return true;
}

export function unassignItemFromCategory(categoryId: string, itemId: string): boolean {
  ensureDataDir();
  const categories = getLocalCategories();
  const cat = categories.find((c) => c.id === categoryId || c.slug === categoryId);
  if (!cat || !cat.item_ids) return false;

  cat.item_ids = cat.item_ids.filter((id) => id !== itemId);
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
  return true;
}

