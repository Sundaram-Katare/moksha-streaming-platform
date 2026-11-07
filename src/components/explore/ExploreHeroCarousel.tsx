'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, ChevronLeft, ChevronRight, Plus, Sparkles, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Song } from '@/types';
import { usePlayer } from '@/features/player/PlayerContext';
import { useLanguage } from '@/features/language/LanguageContext';
import { AddToPlaylistModal } from '@/components/playlist/AddToPlaylistModal';

interface ExploreHeroCarouselProps {
  heroSongs: Song[];
}

export function ExploreHeroCarousel({ heroSongs }: ExploreHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { play, currentSong, isPlaying } = usePlayer();
  const { t, language } = useLanguage();
  const [playlistModalSong, setPlaylistModalSong] = useState<Song | null>(null);

  const currentHeroSong = heroSongs[currentIndex] || heroSongs[0];
  const isThisPlaying = isPlaying && currentSong?.id === currentHeroSong?.id;

  // Auto advance every 8 seconds
  useEffect(() => {
    if (heroSongs.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSongs.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroSongs.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroSongs.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroSongs.length) % heroSongs.length);
  };

  if (!currentHeroSong || heroSongs.length === 0) return null;

  const thumbnailSrc = currentHeroSong.thumbnail_url || '/logo.png';

  return (
    <>
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-8">
        {/* Outer Banner Card */}
        <div className="relative w-full min-h-[360px] sm:min-h-[420px] rounded-3xl overflow-hidden border border-[var(--gold-border)] shadow-2xl bg-[#0F0708]">
          {/* Ambient Background Blur Artwork (NO NEGATIVE Z-INDEX) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHeroSong.id + '-bg'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src={thumbnailSrc}
                  alt={currentHeroSong.title}
                  fill
                  unoptimized
                  className="object-cover opacity-25 filter blur-2xl scale-110"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            {/* Gradients to keep background rich and text readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0405] via-[#0A0405]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0405] via-[#0A0405]/60 to-transparent" />
          </div>

          {/* Main Foreground Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[360px] sm:min-h-[420px]">
            {/* Top Row: Lineage Badge + Prev/Next Controls */}
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--maroon-pill)] border border-[var(--gold-border)] shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[var(--gold-primary)] uppercase">
                  {currentHeroSong.deity_focus
                    ? `${currentHeroSong.deity_focus} Bhakti Master`
                    : 'Featured Consecration'}
                </span>
              </div>

              {heroSongs.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/80 border border-[var(--gold-border)] text-[var(--gold-primary)] transition-all backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
                    title="Previous Song"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/80 border border-[var(--gold-border)] text-[var(--gold-primary)] transition-all backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
                    title="Next Song"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Middle Row: Album Artwork + Titles & Actions */}
            <div className="my-auto py-4 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 lg:gap-8">
              {/* Crisp, High-Definition Album Thumbnail Artwork */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHeroSong.id + '-thumb'}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 rounded-2xl overflow-hidden border-2 border-[var(--gold-border)] shadow-2xl shadow-black/80 shrink-0 group bg-[var(--maroon-pill)]"
                >
                  <Image
                    src={thumbnailSrc}
                    alt={currentHeroSong.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
                </motion.div>
              </AnimatePresence>

              {/* Song Details & CTA Buttons */}
              <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentHeroSong.id + '-meta'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-1.5"
                  >
                    {/* English Title */}
                    <h1 className="font-laila text-2xl sm:text-3xl lg:text-5xl font-bold tracking-wide text-[var(--text-primary)] leading-tight drop-shadow-lg truncate">
                      {currentHeroSong.title}
                    </h1>

                    {/* Hindi Title (Devanagari) */}
                    {currentHeroSong.hindi_title && (
                      <p className="font-laila text-xl sm:text-2xl lg:text-3xl text-[var(--gold-primary)] font-semibold tracking-wide drop-shadow-md truncate">
                        {currentHeroSong.hindi_title}
                      </p>
                    )}

                    {/* Artist & Format */}
                    <p className="font-laila text-xs sm:text-sm text-[var(--text-secondary)] font-normal pt-1">
                      {currentHeroSong.artist}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Actions: Play and Add to Playlist */}
                <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
                  {/* Play / Pause CTA */}
                  <button
                    onClick={() => play(currentHeroSong, heroSongs)}
                    className="flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bronze-pill hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-[var(--gold-primary)]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {isThisPlaying ? (
                      <>
                        <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                        <span>{t('Pause', 'रोकें')}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                        <span>{t('Listen Now', 'अभी सुनें')}</span>
                      </>
                    )}
                  </button>

                  {/* Add to Playlist CTA */}
                  <button
                    onClick={() => setPlaylistModalSong(currentHeroSong)}
                    className="flex items-center gap-2 px-5 py-3 sm:py-3.5 rounded-full border border-[var(--gold-border)] hover:border-[var(--gold-primary)] bg-[var(--bg-card)] hover:bg-[var(--maroon-pill)] text-[var(--gold-primary)] text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('Add to Playlist', 'प्लेलिस्ट में जोड़ें')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Carousel Dots */}
            {heroSongs.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {heroSongs.map((song, idx) => (
                  <button
                    key={song.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'w-6 bg-[var(--gold-primary)]'
                        : 'w-1.5 bg-[var(--gold-border)] hover:bg-[var(--gold-primary)]/50'
                    }`}
                    title={song.title}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add To Playlist Modal */}
      {playlistModalSong && (
        <AddToPlaylistModal
          song={playlistModalSong}
          isOpen={true}
          onClose={() => setPlaylistModalSong(null)}
        />
      )}
    </>
  );
}
