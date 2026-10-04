import { NextResponse } from 'next/server';
import { syncYouTubeChannel } from '@/features/youtube/syncService';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await syncYouTubeChannel(body.channelId);

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${result.syncedCount} items from YouTube sanctuary channel.`,
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'YouTube sync failed' },
      { status: 500 }
    );
  }
}
