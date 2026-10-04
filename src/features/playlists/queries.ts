import { Playlist } from '@/types';

export async function getUserPlaylists(userId: string): Promise<Playlist[]> {
  if (!userId) return [];
  try {
    const res = await fetch(`/api/playlists?userId=${encodeURIComponent(userId)}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.success ? data.playlists : [];
  } catch {
    return [];
  }
}

export async function createPlaylist(userId: string, name: string, description?: string): Promise<Playlist | null> {
  try {
    const res = await fetch('/api/playlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, description }),
    });
    const data = await res.json();
    return data.success ? data.playlist : null;
  } catch {
    return null;
  }
}

export async function getPlaylistById(playlistId: string): Promise<Playlist | null> {
  try {
    const res = await fetch(`/api/playlists/${playlistId}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.success ? data.playlist : null;
  } catch {
    return null;
  }
}

export async function addSongToPlaylist(playlistId: string, songId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/playlists/${playlistId}/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId }),
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export async function removeSongFromPlaylist(playlistId: string, songId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/playlists/${playlistId}/songs?songId=${encodeURIComponent(songId)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export async function deletePlaylist(playlistId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/playlists/${playlistId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}
