import React from 'react';
import { Metadata } from 'next';
import { getYoutubeVideos, YoutubeVideo } from '@/features/youtube/youtubeService';
import { getLocalCategories } from '@/lib/storage';
import { VideoHeroCarousel } from '@/components/videos/VideoHeroCarousel';
import { CategoryVideoRow } from '@/components/videos/CategoryVideoRow';

export const metadata: Metadata = {
  title: 'Devotional Videos Sanctuary — Moksha Music | YouTube Master Visuals',
  description: 'Watch sacred devotional music videos, Krishna bhajans, daily mantras, and temple aartis by Moksha Music.',
};

export const revalidate = 60;

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const allVideos = await getYoutubeVideos();
  const categories = getLocalCategories();

  // If search query is provided
  const filteredVideos = q
    ? allVideos.filter(
        (v) =>
          v.title.toLowerCase().includes(q.toLowerCase()) ||
          v.hindi_title?.toLowerCase().includes(q.toLowerCase()) ||
          v.category?.toLowerCase().includes(q.toLowerCase()) ||
          v.deity_focus?.toLowerCase().includes(q.toLowerCase())
      )
    : allVideos;

  // Group videos by category
  const categorizedVideoRows: {
    id: string;
    name: string;
    hindi_name: string;
    tagline?: string;
    videos: YoutubeVideo[];
  }[] = [];

  categories.forEach((cat) => {
    const matched = allVideos.filter(
      (v) =>
        cat.item_ids?.includes(v.id) ||
        cat.item_ids?.includes(v.videoId) ||
        v.category.toLowerCase().includes(cat.name.split(' ')[0].toLowerCase()) ||
        v.deity_focus.toLowerCase().includes(cat.slug.replace('-bhajans', '').replace('-invocations', '')) ||
        v.title.toLowerCase().includes(cat.name.split(' ')[0].toLowerCase())
    );

    if (matched.length > 0) {
      categorizedVideoRows.push({
        id: cat.id,
        name: cat.name,
        hindi_name: cat.hindi_name,
        tagline: cat.tagline,
        videos: matched,
      });
    }
  });

  return (
    <div className="w-full flex flex-col items-center pb-16">
      {/* 1. Hero Carousel Section (similar to explore page) */}
      <VideoHeroCarousel videos={allVideos} />

      {/* If Search Query entered, show Search Results */}
      {q && (
        <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-4">
          <CategoryVideoRow
            title={`Search Results for "${q}"`}
            hindiTitle="खोज परिणाम"
            tagline="SEARCH DISCOVERY"
            videos={filteredVideos}
          />
        </section>
      )}

      {/* 2. All Videos Fetched from YouTube (5 per row + View All) */}
      <CategoryVideoRow
        title="All Devotional Video Releases"
        hindiTitle="सम्पूर्ण वीडियो संग्रह"
        tagline="OFFICIAL YOUTUBE CHANNEL • @MOKSHAMUSIC20"
        videos={allVideos}
      />

      {/* 3. List of Videos by Categories (5 per row + View All) */}
      {categorizedVideoRows.map((cat) => (
        <CategoryVideoRow
          key={cat.id}
          title={cat.name}
          hindiTitle={cat.hindi_name}
          tagline={cat.tagline}
          videos={cat.videos}
        />
      ))}
    </div>
  );
}
