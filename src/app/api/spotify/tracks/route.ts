import { NextResponse } from 'next/server';
import { getSpotifyTracks } from '@/features/spotify/spotifyService';

export async function GET() {
  try {
    const tracks = await getSpotifyTracks();
    return NextResponse.json({ success: true, tracks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
