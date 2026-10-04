import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { getLocalPlaylists, saveLocalPlaylist, getLocalSongs } from '@/lib/storage';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { songId } = body;

    if (!id || !songId) {
      return NextResponse.json(
        { success: false, error: 'Playlist ID and Song ID are required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase.from('playlist_songs').upsert(
          {
            playlist_id: id,
            song_id: songId,
          } as any,
          { onConflict: 'playlist_id, song_id' }
        );
      } catch (err) {
        console.warn('Supabase add song to playlist error:', err);
      }
    }

    // Local fallback update
    const playlists = getLocalPlaylists();
    const pl = playlists.find((p) => p.id === id);
    if (pl) {
      if (!pl.songs) pl.songs = [];
      if (!pl.songs.some((s) => s.id === songId)) {
        const songs = getLocalSongs();
        const foundSong = songs.find((s) => s.id === songId);
        if (foundSong) {
          pl.songs.push(foundSong);
          pl.song_count = pl.songs.length;
          saveLocalPlaylist(pl);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Song added to playlist' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add song to playlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const songId = searchParams.get('songId');

    if (!id || !songId) {
      return NextResponse.json(
        { success: false, error: 'Playlist ID and Song ID are required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase
          .from('playlist_songs')
          .delete()
          .match({ playlist_id: id, song_id: songId });
      } catch (err) {
        console.warn('Supabase remove song from playlist error:', err);
      }
    }

    // Local fallback update
    const playlists = getLocalPlaylists();
    const pl = playlists.find((p) => p.id === id);
    if (pl && pl.songs) {
      pl.songs = pl.songs.filter((s) => s.id !== songId);
      pl.song_count = pl.songs.length;
      saveLocalPlaylist(pl);
    }

    return NextResponse.json({ success: true, message: 'Song removed from playlist' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove song from playlist' },
      { status: 500 }
    );
  }
}
