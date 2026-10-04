import React from 'react';
import { Metadata } from 'next';
import { ExploreHeroCarousel } from '@/components/explore/ExploreHeroCarousel';
import { SongCarouselRail } from '@/components/explore/SongCarouselRail';
import { getSongs } from '@/features/songs/queries';

export const metadata: Metadata = {
  title: 'Explore Sacred Catalog — Moksha Music | दिव्य साधना संगीत',
  description: 'Immerse into authentic recordings of Vedic stotrams, classical Indian ragas, and deity-focused bhajans.',
};

export default async function ExplorePage() {
  const songs = await getSongs();

  if (songs.length === 0) {
    return <div className="w-full min-h-[50vh]" />;
  }

  const trendingSongs = songs;
  const krishnaSongs = songs.filter((s) => s.deity_focus?.toLowerCase().includes('krishna'));
  const shivaSongs = songs.filter((s) => s.deity_focus?.toLowerCase().includes('shiva'));
  const ramSongs = songs.filter((s) => s.deity_focus?.toLowerCase().includes('ram'));
  const deviSongs = songs.filter((s) => s.deity_focus?.toLowerCase().includes('devi') || s.deity_focus?.toLowerCase().includes('durga'));

  return (
    <div className="w-full flex flex-col items-center pb-12">
      {/* Streaming Hero Carousel */}
      <ExploreHeroCarousel heroSongs={trendingSongs} />

      {/* 1. All Consecrated Songs */}
      <SongCarouselRail title="Consecrated Recordings" songs={trendingSongs} />

      {/* 2. Krishna's Bhajans */}
      {krishnaSongs.length > 0 && (
        <SongCarouselRail title="Krishna Bhajans &amp; Kirtans" songs={krishnaSongs} />
      )}

      {/* 3. Shiva Bhajans */}
      {shivaSongs.length > 0 && (
        <SongCarouselRail title="Mahadeva Shiva Stotras" songs={shivaSongs} />
      )}

      {/* 4. Ram Bhajans */}
      {ramSongs.length > 0 && (
        <SongCarouselRail title="Shri Ram Bhajans" songs={ramSongs} />
      )}

      {/* 5. Devi Bhajans */}
      {deviSongs.length > 0 && (
        <SongCarouselRail title="Durga &amp; Devi Stutis" songs={deviSongs} />
      )}
    </div>
  );
}
