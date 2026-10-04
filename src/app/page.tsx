import React from 'react';
import { HomeHero } from '@/components/home/HomeHero';
import { PlatformCarousel } from '@/components/home/PlatformCarousel';
import { BhaktiParivarSection } from '@/components/home/BhaktiParivarSection';
import { SacredInvitationSection } from '@/components/home/SacredInvitationSection';
import { FooterSection } from '@/components/home/FooterSection';
import { SongCarouselRail } from '@/components/explore/SongCarouselRail';
import { getFeaturedSong, getSongs } from '@/features/songs/queries';

export default async function HomePage() {
  const featuredSong = await getFeaturedSong();
  const songs = await getSongs();

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero Section */}
      <HomeHero featuredSong={featuredSong} />

      {/* 2. Consecrated Songs Rail (if any exist) */}
      {songs.length > 0 && (
        <div className="w-full pb-8">
          <SongCarouselRail title="Consecrated Recordings" songs={songs} />
        </div>
      )}

      {/* 3. Moving Carousel of Platforms (YT, Insta, iTunes, Spotify, Amazon, JioSaavn) */}
      <PlatformCarousel />

      {/* 4. YouTube Bhakti Parivar Section (21K+ Devotees with OM Watermark) */}
      <BhaktiParivarSection />

      {/* 5. Sacred Invitation & Free Sadhana */}
      <SacredInvitationSection />

      {/* 6. Footer */}
      <FooterSection />
    </div>
  );
}
