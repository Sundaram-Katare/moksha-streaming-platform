'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Song } from '@/types';
import { usePlayer } from '@/features/player/PlayerContext';
import { useLanguage } from '@/features/language/LanguageContext';
import { AddToPlaylistModal } from '@/components/playlist/AddToPlaylistModal';

interface SongCarouselRailProps {
  title: string;
  songs: Song[];
}

export function SongCarouselRail({ title, songs }: SongCarouselRailProps) {
  const router = useRouter();
  const railRef = useRef<HTMLDivElement>(null);
  const { play } = usePlayer();
  const { language } = useLanguage();
  const [playlistSong, setPlaylistSong] = useState<Song | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (railRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      railRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCardClick = (song: Song) => {
    play(song, songs);
  };

  if (!songs || songs.length === 0) return null;

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
        {/* Rail Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-border)] mb-4">
          <h2 className="font-laila text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            {title}
          </h2>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--gold-border)] text-[var(--gold-primary)] transition-colors cursor-pointer"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--gold-border)] text-[var(--gold-primary)] transition-colors cursor-pointer"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Rail */}
        <div
          ref={railRef}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {songs.map((song) => {
            const songDisplayName =
              language === 'HI' && song.hindi_title ? song.hindi_title : song.title;

            return (
              <div
                key={song.id}
                className="w-48 sm:w-56 shrink-0 snap-start glass-panel rounded-2xl p-3 border border-[var(--gold-border)] hover:border-[var(--gold-primary)] transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--gold-primary)]/10"
              >
                {/* Thumbnail with Hover Play & Add to Playlist Buttons */}
                <div
                  onClick={() => handleCardClick(song)}
                  className="relative w-full aspect-square rounded-xl overflow-hidden bg-[var(--maroon-pill)]"
                >
                  <Image
                    src={song.thumbnail_url || '/logo.png'}
                    alt={song.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Floating Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bronze-pill text-white flex items-center justify-center shadow-xl shadow-[var(--gold-primary)]/30 hover:scale-110 active:scale-95 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Song Info & Add to Playlist */}
                <div className="mt-3 pt-1 flex items-center justify-between gap-2">
                  <div
                    onClick={() => handleCardClick(song)}
                    className="min-w-0 flex-1"
                  >
                    <h4 className="font-laila text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--gold-primary)] truncate transition-colors">
                      {songDisplayName}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">
                      {song.artist}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlaylistSong(song);
                    }}
                    className="p-1.5 rounded-full border border-[var(--gold-border)] hover:border-[var(--gold-primary)] bg-[var(--bg-card)] hover:bg-[var(--maroon-pill)] text-[var(--gold-primary)] transition-all cursor-pointer shrink-0"
                    title="Add to Playlist"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        song={playlistSong}
        isOpen={Boolean(playlistSong)}
        onClose={() => setPlaylistSong(null)}
      />
    </>
  );
}
