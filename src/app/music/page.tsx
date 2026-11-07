import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Sparkles, Music2, ExternalLink } from 'lucide-react';
import { getSpotifyTracks } from '@/features/spotify/spotifyService';
import { getLocalCategories } from '@/lib/storage';
import { CategorySongRow } from '@/components/music/CategorySongRow';
import { Song } from '@/types';

export const metadata: Metadata = {
  title: 'Sacred Music Catalog — Moksha Music | Spotify Masters',
  description: 'Audiophile devotional music masters, bhajans, stotrams, and meditative ragas streaming from Spotify.',
};

export const revalidate = 60;

export default async function MusicPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const allTracks = await getSpotifyTracks();
  const categories = getLocalCategories();

  // If a search query is present, filter tracks
  const filteredTracks = q
    ? allTracks.filter(
        (t) =>
          t.title.toLowerCase().includes(q.toLowerCase()) ||
          t.hindi_title?.toLowerCase().includes(q.toLowerCase()) ||
          t.artist.toLowerCase().includes(q.toLowerCase()) ||
          t.deity_focus?.toLowerCase().includes(q.toLowerCase())
      )
    : allTracks;

  // Group tracks by category
  const categorizedRows: {
    id: string;
    name: string;
    hindi_name: string;
    tagline?: string;
    songs: Song[];
  }[] = [];

  categories.forEach((cat) => {
    // Matches by assigned item_ids, category name, or deity focus
    const matched = allTracks.filter(
      (track) =>
        cat.item_ids?.includes(track.id) ||
        track.deity_focus?.toLowerCase().includes(cat.slug.replace('-bhajans', '').replace('-invocations', '')) ||
        track.title.toLowerCase().includes(cat.name.split(' ')[0].toLowerCase())
    );

    if (matched.length > 0) {
      categorizedRows.push({
        id: cat.id,
        name: cat.name,
        hindi_name: cat.hindi_name,
        tagline: cat.tagline,
        songs: matched,
      });
    }
  });

  // Featured track for top banner
  const featuredTrack = allTracks[0];

  return (
    <div className="w-full flex flex-col items-center pb-16">
      {/* Top Banner: Spotify Artist Spotlight */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 pt-4 pb-6">
        <div className="relative rounded-3xl p-6 sm:p-10 border border-[var(--gold-border)] bg-[var(--bg-card)] shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Subtle Ambient Background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--gold-primary)]/10 rounded-full filter blur-3xl pointer-events-none" />

          {/* Left Info */}
          <div className="space-y-3 max-w-2xl relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bronze-pill text-white text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>SPOTIFY MASTER CONSECRATIONS</span>
            </div>

            <h1 className="font-laila text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-wide leading-tight">
              Moksha Music on Spotify
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Explore authentic high-definition recordings of classical ragas, deity bhajans, and meditative Sanskrit stotras by AK Chandra. Pure lossless devotional streaming.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="https://open.spotify.com/artist/3n12VKEDUVES1qNzSdneYV"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1AA34A] text-white font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.485 17.306c-.215.353-.674.464-1.027.25-2.82-1.722-6.37-2.112-10.55-1.157-.403.093-.807-.156-.9-.558-.093-.402.156-.807.558-.9 4.582-1.047 8.513-.598 11.66 1.328.354.214.465.674.25 1.027zm1.464-3.256c-.27.44-.848.58-1.288.31-3.227-1.984-8.147-2.557-11.964-1.398-.498.15-1.027-.134-1.178-.632-.151-.497.134-1.026.632-1.177 4.364-1.325 9.79-.686 13.488 1.588.44.27.58.848.31 1.288zm.126-3.41c-3.87-2.298-10.257-2.51-13.938-1.392-.593.18-1.223-.157-1.403-.75-.18-.594.157-1.224.75-1.404 4.238-1.286 11.288-1.037 15.74 1.606.535.318.708 1.01.39 1.545-.318.536-1.01.71-1.545.39z" />
                </svg>
                <span>Follow on Spotify</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <span className="text-xs text-[var(--text-muted)] font-medium">
                {allTracks.length} Sacred Tracks Live
              </span>
            </div>
          </div>

          {/* Right: Featured Cover Artwork Card */}
          {featuredTrack && (
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-[var(--gold-border)] shadow-2xl shrink-0 group bg-[var(--maroon-pill)]">
              <Image
                src={featuredTrack.thumbnail_url || '/logo.png'}
                alt={featuredTrack.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3">
                <span className="text-[10px] font-bold text-amber-200">LATEST MASTER</span>
                <h4 className="text-xs font-bold text-white truncate">{featuredTrack.title}</h4>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* If search query entered, show search results first */}
      {q && (
        <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-4">
          <CategorySongRow
            title={`Search Results for "${q}"`}
            hindiTitle="खोज परिणाम"
            tagline="SEARCH DISCOVERY"
            songs={filteredTracks}
          />
        </section>
      )}

      {/* All Music (5 in a row + View All) */}
      <CategorySongRow
        title="All Spotify Music Releases"
        hindiTitle="सम्पूर्ण संगीत संग्रह"
        tagline="OFFICIAL SPOTIFY CATALOG"
        songs={allTracks}
      />

      {/* Categorized Rails: Each shows 5 in a row + View All */}
      {categorizedRows.map((cat) => (
        <CategorySongRow
          key={cat.id}
          title={cat.name}
          hindiTitle={cat.hindi_name}
          tagline={cat.tagline}
          songs={cat.songs}
        />
      ))}
    </div>
  );
}
