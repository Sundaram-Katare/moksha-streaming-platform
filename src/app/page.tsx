import React from 'react';
import { InfiniteSongCarousel } from '@/components/home/InfiniteSongCarousel';
import { LatestVideosSection } from '@/components/home/LatestVideosSection';
import { PlatformCarousel } from '@/components/home/PlatformCarousel';
import { BhaktiParivarSection } from '@/components/home/BhaktiParivarSection';
import { FooterSection } from '@/components/home/FooterSection';
import { getSongs } from '@/features/songs/queries';
import { getSpotifyTracks } from '@/features/spotify/spotifyService';
import { getYoutubeVideos } from '@/features/youtube/youtubeService';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [consecratedSongs, spotifyTracks, youtubeVideos] = await Promise.all([
    getSongs(),
    getSpotifyTracks(),
    getYoutubeVideos(),
  ]);

  // Combine consecrated songs + Spotify tracks to guarantee 10 rich tiles
  const allSongTiles = [...consecratedSongs, ...spotifyTracks];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Infinite Moving Song Carousel (Top Section - pauses on hover) */}
      <InfiniteSongCarousel songs={allSongTiles} />

      {/* 2. Latest Videos 2-Column Split Player (Images 2 & 3) */}
      <LatestVideosSection videos={youtubeVideos} />

      {/* 3. Platforms Carousel: LISTEN ON YOUR SACRED PLATFORMS */}
      <PlatformCarousel />

      {/* 4. YouTube Bhakti Parivar Section (21K+ Devotees) */}
      <BhaktiParivarSection />

      {/* 5. Footer */}
      <FooterSection />
    </div>
  );
}
