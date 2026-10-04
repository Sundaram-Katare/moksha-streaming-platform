import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { getLocalSongs, saveLocalSong } from '@/lib/storage';
import { Song } from '@/types';

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('songs')
        .select('*, song_lyrics(*), song_categories(categories(*)), song_platform_links(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map((item: any) => ({
          ...item,
          lyrics: item.song_lyrics || [],
          categories: item.song_categories?.map((sc: any) => sc.categories) || [],
          platform_links: item.song_platform_links || [],
        }));
        return NextResponse.json({ success: true, songs: mapped });
      }
    }

    const localSongs = getLocalSongs();
    return NextResponse.json({ success: true, songs: localSongs });
  } catch (error: any) {
    const localSongs = getLocalSongs();
    return NextResponse.json({ success: true, songs: localSongs });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      hindi_title,
      artist = 'Moksha Devotional',
      thumbnail_url,
      audio_url,
      raag = '',
      tala = '',
      deity_focus = '',
      description = '',
      duration_seconds = 0,
    } = body;

    if (!title || !hindi_title) {
      return NextResponse.json(
        { success: false, error: 'Song name in both English and Hindi are required.' },
        { status: 400 }
      );
    }

    if (!thumbnail_url || !audio_url) {
      return NextResponse.json(
        { success: false, error: 'Both thumbnail image and audio file are required.' },
        { status: 400 }
      );
    }

    // Generate URL safe unique slug
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${cleanTitle}-${Date.now().toString(36)}`;
    const songId = crypto.randomUUID();

    const newSong: Song = {
      id: songId,
      title,
      hindi_title,
      slug,
      artist,
      raag,
      tala,
      deity_focus,
      description,
      thumbnail_url,
      audio_url,
      youtube_video_id: null,
      youtube_url: null,
      duration_seconds: duration_seconds || 180,
      plays_count: 0,
      audio_format: 'Lossless 24-Bit / 96kHz',
      is_featured: false,
      is_daily_darshan: false,
      is_fresh_consecration: true,
      master_tape_number: null,
      acoustic_notes: null,
      status: 'published',
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { error } = await supabase.from('songs').insert(newSong as any);
        if (error) {
          console.warn('Supabase insert warning, saving locally:', error.message);
        }
      } catch (err) {
        console.warn('Supabase write error, falling back locally:', err);
      }
    }

    saveLocalSong(newSong);

    return NextResponse.json({ success: true, song: newSong }, { status: 201 });
  } catch (error: any) {
    console.error('Create song error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create song' },
      { status: 500 }
    );
  }
}
