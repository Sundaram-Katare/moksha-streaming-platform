'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles, Share2 } from 'lucide-react';
import { Song } from '@/types';
import { usePlayer } from '@/features/player/PlayerContext';
import { useLanguage } from '@/features/language/LanguageContext';
import { AestheticSocialCardModal } from '@/features/share-card/AestheticSocialCardModal';

interface InfiniteSongCarouselProps {
  songs: Song[];
}

export function InfiniteSongCarousel({ songs }: InfiniteSongCarouselProps) {
  const { play, currentSong, isPlaying } = usePlayer();
  const { t, language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shareSong, setShareSong] = useState<Song | null>(null);

  // Take the last 10 songs
  const last10Songs = songs.slice(0, 10);

  if (last10Songs.length === 0) return null;

  // Duplicate items for seamless continuous looping in marquee
  const marqueeItems = [...last10Songs, ...last10Songs];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 pt-4 pb-6">
      {/* Header Bar matching Image 2 (New Releases / Forthcoming + Next/Prev controls) */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--gold-border)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bronze-pill text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>{t('New Releases', 'नवीनतम रिलीज')}</span>
          </div>
          <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
            {t('Hover to pause scrolling', 'रोकने के लिए कर्सर ऊपर लाएँ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/music"
            className="text-xs font-semibold text-[var(--gold-primary)] hover:underline mr-2"
          >
            {t('View All Music →', 'सभी संगीत देखें →')}
          </Link>
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--gold-border)] text-[var(--gold-primary)] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--gold-border)] text-[var(--gold-primary)] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Infinite Moving Marquee Wrapper */}
      <div
        ref={scrollRef}
        className="relative w-full overflow-x-auto overflow-y-hidden py-2 scrollbar-none rounded-2xl group"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="animate-marquee-infinite flex items-stretch gap-4 sm:gap-5">
          {marqueeItems.map((song, idx) => {
            const isThisPlaying = isPlaying && currentSong?.id === song.id;
            const displayName = language === 'HI' && song.hindi_title ? song.hindi_title : song.title;

            return (
              <div
                key={`${song.id}-${idx}`}
                onClick={() => play(song, last10Songs)}
                className="w-44 sm:w-52 lg:w-56 shrink-0 glass-panel rounded-2xl p-2.5 sm:p-3 border border-[var(--gold-border)] hover:border-[var(--gold-primary)] transition-all duration-300 group/card cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--gold-primary)]/15 flex flex-col justify-between bg-[var(--bg-card)]"
              >
                {/* Square Album Cover Thumbnail with Hover Play Button */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[var(--maroon-pill)] border border-[var(--gold-border)]/50">
                  <Image
                    src={song.thumbnail_url || '/logo.png'}
                    alt={song.title}
                    fill
                    unoptimized
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                    priority={idx < 5}
                  />

                  {/* Share Card Button in Top Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareSong(song);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-[var(--gold-primary)] text-white flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all z-20 cursor-pointer shadow-md"
                    title="Create Sacred Card / शेयर कार्ड बनाएँ"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Gradient bottom scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Floating Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/30 backdrop-blur-[1px]">
                    <div className="w-11 h-11 rounded-full bronze-pill text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform">
                      {isThisPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Badge in Bottom Left of Artwork */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-bold text-amber-100 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md truncate max-w-[120px]">
                      {song.deity_focus || 'Moksha Master'}
                    </span>
                    {isThisPlaying && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-black/70 px-1.5 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Playing
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Artist Details */}
                <div className="mt-2.5 pt-1 space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] group-hover/card:text-[var(--gold-primary)] transition-colors truncate">
                    {displayName}
                  </h4>
                  {song.hindi_title && language !== 'HI' && (
                    <p className="text-[11px] text-[var(--gold-primary)] font-devanagari truncate font-medium">
                      {song.hindi_title}
                    </p>
                  )}
                  <p className="text-[10px] text-[var(--text-muted)] truncate pt-0.5">
                    {song.artist}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shareable Aesthetic Social Card Modal */}
      {shareSong && (
        <AestheticSocialCardModal
          isOpen={Boolean(shareSong)}
          onClose={() => setShareSong(null)}
          media={{
            id: shareSong.id,
            title: shareSong.title,
            hindi_title: shareSong.hindi_title,
            artist: shareSong.artist,
            thumbnail_url: shareSong.thumbnail_url,
            type: 'song',
          }}
        />
      )}
    </section>
  );
}
