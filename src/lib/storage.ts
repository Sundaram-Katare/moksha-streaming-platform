import fs from 'fs';
import path from 'path';
import { Song, Playlist, Profile } from '@/types';

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
