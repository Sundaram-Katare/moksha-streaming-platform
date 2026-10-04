import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const thumbnailFile = formData.get('thumbnail') as File | null;
    const audioFile = formData.get('audio') as File | null;

    let thumbnailUrl = '';
    let audioUrl = '';

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const thumbDir = path.join(uploadsDir, 'thumbnails');
    const audioDir = path.join(uploadsDir, 'audio');

    if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });
    if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

    // Handle thumbnail
    if (thumbnailFile && thumbnailFile.size > 0) {
      const ext = path.extname(thumbnailFile.name) || '.jpg';
      const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      fs.writeFileSync(path.join(thumbDir, cleanName), buffer);
      thumbnailUrl = `/uploads/thumbnails/${cleanName}`;
    }

    // Handle audio file
    if (audioFile && audioFile.size > 0) {
      const ext = path.extname(audioFile.name) || '.mp3';
      const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const buffer = Buffer.from(await audioFile.arrayBuffer());
      fs.writeFileSync(path.join(audioDir, cleanName), buffer);
      audioUrl = `/uploads/audio/${cleanName}`;
    }

    return NextResponse.json({
      success: true,
      thumbnailUrl,
      audioUrl,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
