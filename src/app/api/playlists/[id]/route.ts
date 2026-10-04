import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { getLocalPlaylists, deleteLocalPlaylist } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Playlist ID required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from('playlists')
          .select('*, playlist_songs(song_id, songs(*))')
          .eq('id', id)
          .single();

        if (!error && data) {
          const pl = data as any;
          return NextResponse.json({
            success: true,
            playlist: {
              ...pl,
              song_count: pl.playlist_songs?.length || 0,
              songs: pl.playlist_songs?.map((ps: any) => ps.songs).filter(Boolean) || [],
            },
          });
        }
      } catch (err) {
        console.warn('Supabase get playlist error:', err);
      }
    }

    const playlist = getLocalPlaylists().find((p) => p.id === id);
    if (!playlist) {
      return NextResponse.json({ success: false, error: 'Playlist not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, playlist });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch playlist' },
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
    if (!id) {
      return NextResponse.json({ success: false, error: 'Playlist ID required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase.from('playlists').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete playlist error:', err);
      }
    }

    deleteLocalPlaylist(id);

    return NextResponse.json({ success: true, message: 'Playlist deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete playlist' },
      { status: 500 }
    );
  }
}
