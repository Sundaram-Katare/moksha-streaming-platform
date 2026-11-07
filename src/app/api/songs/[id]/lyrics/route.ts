import { NextRequest, NextResponse } from 'next/server';
import { getLocalSongs, updateSongLyrics } from '@/lib/storage';
import { LyricLanguage } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const songs = getLocalSongs();
    const song = songs.find((s) => s.id === id);

    if (!song) {
      return NextResponse.json(
        { success: false, error: 'Song not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lyrics: song.lyrics || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch lyrics' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { lyrics } = body; // Array of { language: LyricLanguage, lyrics: string }

    if (!Array.isArray(lyrics)) {
      return NextResponse.json(
        { success: false, error: 'Invalid lyrics payload format. Array expected.' },
        { status: 400 }
      );
    }

    const updatedSong = updateSongLyrics(
      id,
      lyrics.map((l: any) => ({
        language: (l.language || 'hi') as LyricLanguage,
        lyrics: typeof l.lyrics === 'string' ? l.lyrics : '',
      }))
    );

    if (!updatedSong) {
      return NextResponse.json(
        { success: false, error: 'Song not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      song: updatedSong,
      lyrics: updatedSong.lyrics || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save lyrics' },
      { status: 500 }
    );
  }
}
