import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { getLocalPlaylists, saveLocalPlaylist } from '@/lib/storage';
import { Playlist } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: true, playlists: [] });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from('playlists')
          .select('*, playlist_songs(song_id, songs(*))')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mapped = data.map((pl: any) => ({
            ...pl,
            song_count: pl.playlist_songs?.length || 0,
            songs: pl.playlist_songs?.map((ps: any) => ps.songs).filter(Boolean) || [],
          }));
          return NextResponse.json({ success: true, playlists: mapped });
        }
      } catch (err) {
        console.warn('Supabase fetch playlists error:', err);
      }
    }

    const local = getLocalPlaylists().filter((p) => p.user_id === userId);
    return NextResponse.json({ success: true, playlists: local });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description = '', userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User must be authenticated to create a playlist.' },
        { status: 401 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Playlist name is required.' },
        { status: 400 }
      );
    }

    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      user_id: userId,
      name: name.trim(),
      description: description.trim() || null,
      cover_url: null,
      is_public: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      song_count: 0,
      songs: [],
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase.from('playlists').insert({
          id: newPlaylist.id,
          user_id: newPlaylist.user_id,
          name: newPlaylist.name,
          description: newPlaylist.description,
          is_public: false,
        } as any);
      } catch (err) {
        console.warn('Supabase insert playlist error:', err);
      }
    }

    saveLocalPlaylist(newPlaylist);

    return NextResponse.json({ success: true, playlist: newPlaylist }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create playlist' },
      { status: 500 }
    );
  }
}
