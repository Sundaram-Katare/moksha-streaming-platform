import { NextResponse } from 'next/server';
import { getYoutubeVideos } from '@/features/youtube/youtubeService';

export async function GET() {
  try {
    const videos = await getYoutubeVideos();
    return NextResponse.json({ success: true, videos });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
