import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SongDetailsClient } from '@/components/song/SongDetailsClient';
import { getSongBySlug, getSongs } from '@/features/songs/queries';

interface SongPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SongPageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = await getSongBySlug(slug);

  if (!song) {
    return {
      title: 'Song Not Found — Moksha Music',
    };
  }

  return {
    title: `${song.title} (${song.hindi_title || ''}) — Moksha Music`,
    description: song.description || `Listen to ${song.title} on Moksha Music.`,
    openGraph: {
      title: `${song.title} — Moksha Music`,
      description: song.description || '',
      images: [song.thumbnail_url],
    },
  };
}

export default async function SongPage({ params }: SongPageProps) {
  const { slug } = await params;
  const song = await getSongBySlug(slug);

  if (!song) {
    notFound();
  }

  const allSongs = await getSongs();
  const relatedSongs = allSongs.filter((s) => s.id !== song.id);

  return <SongDetailsClient song={song} relatedSongs={relatedSongs} />;
}
