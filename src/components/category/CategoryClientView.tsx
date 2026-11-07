'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Shuffle, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { Category, Song } from '@/types';
import { usePlayer } from '@/features/player/PlayerContext';

interface CategoryClientViewProps {
  category: Category;
  songs: Song[];
}

export function CategoryClientView({ category, songs }: CategoryClientViewProps) {
  const { play, currentSong, isPlaying } = usePlayer();

  const handlePlayAll = () => {
    if (songs.length > 0) {
      play(songs[0], songs);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#A89A8A]">
        <Link href="/" className="hover:text-[#E5C378]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/explore" className="hover:text-[#E5C378]">Deities</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#E5C378] truncate">{category.name}</span>
      </div>

      {/* Hero Banner for Deity */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-10 border border-[#E5C378]/25 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Backdrop image */}
        <div className="absolute inset-0 -z-10 opacity-25 filter blur-2xl">
          <Image
            src={category.image_url || '/logo.png'}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Left Portrait (4 cols) */}
        <div className="md:col-span-4 flex justify-center">
          <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-3xl overflow-hidden border-2 border-[#E5C378]/40 shadow-2xl bg-[#12080A]">
            <Image
              src={category.image_url || '/logo.png'}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12080A]/90 via-transparent to-transparent" />
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-[#E5C378]/30 text-[10px] font-bold text-[#E5C378] tracking-widest uppercase">
              {category.tagline || 'DIVINE LINEAGE'}
            </span>
          </div>
        </div>

        {/* Right Info & Actions (8 cols) */}
        <div className="md:col-span-8 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-[#E5C378] uppercase block">
              SANCTUARY OF DEVOTION
            </span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-[#F8F5EE]">
              {category.name}
            </h1>
            {category.hindi_name && (
              <h2 className="font-devanagari text-2xl sm:text-3xl text-[#E5C378] font-semibold">
                {category.hindi_name}
              </h2>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#C5BAAD] leading-relaxed max-w-2xl">
            {category.description}
          </p>

          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-6 py-3 rounded-full bronze-pill hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-[var(--gold-primary)]/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white ml-0.5" />
              <span>Play All Consecrations</span>
            </button>
          </div>
        </div>
      </div>

      {/* Song List for Category */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#E5C378]/20 shadow-xl space-y-4">
        <h3 className="font-cinzel text-lg font-bold text-[#F8F5EE] pb-2 border-b border-[#E5C378]/15">
          Consecrated Stotrams &amp; Bhajans ({songs.length})
        </h3>

        <div className="space-y-2 pt-2">
          {songs.map((song, idx) => {
            const isSongPlaying = isPlaying && currentSong?.id === song.id;
            return (
              <div
                key={song.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#170C0E]/80 hover:bg-[#251316] border border-[#E5C378]/10 hover:border-[#E5C378]/30 transition-all group cursor-pointer"
                onClick={() => play(song, songs)}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="font-cinzel text-sm font-bold text-[#8E8275] w-6 text-center shrink-0">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E5C378]/20 bg-[#12080A]">
                    <Image
                      src={song.thumbnail_url}
                      alt={song.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#F8F5EE] group-hover:text-[#E5C378] truncate transition-colors flex items-center gap-2">
                      <span>{song.title}</span>
                      {song.hindi_title && (
                        <span className="text-[#A89A8A] font-devanagari text-xs hidden sm:inline">
                          • {song.hindi_title}
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-[#A89A8A] truncate">
                      {song.artist} {song.raag && `• ${song.raag}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-[11px] font-mono text-[#8E8275]">
                    {song.duration_seconds ? `${Math.floor(song.duration_seconds / 60)}m` : '15m'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#1F1013] group-hover:bg-[var(--gold-primary)] text-[var(--gold-primary)] group-hover:text-white flex items-center justify-center transition-all border border-[#E5C378]/30 group-hover:border-transparent">
                    {isSongPlaying ? (
                      <span className="w-2.5 h-2.5 bg-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
