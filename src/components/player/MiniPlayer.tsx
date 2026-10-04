'use client';

import React from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Music,
  ChevronUp,
} from 'lucide-react';
import { usePlayer } from '@/features/player/PlayerContext';
import { useLanguage } from '@/features/language/LanguageContext';

export function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    isLooping,
    isBottomPlayerDismissed,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleLoop,
    openFullPlayer,
    dismissBottomPlayer,
    restoreBottomPlayer,
  } = usePlayer();

  const { language } = useLanguage();

  if (!currentSong) return null;

  const songTitle = language === 'HI' && currentSong.hindi_title ? currentSong.hindi_title : currentSong.title;

  // If user dismissed the bottom player, show floating restored pill
  if (isBottomPlayerDismissed) {
    return (
      <div className="fixed bottom-4 right-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <button
          onClick={restoreBottomPlayer}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--gold-primary)] text-[var(--gold-primary)] shadow-2xl hover:bg-[var(--maroon-pill)] hover:scale-105 transition-all cursor-pointer group"
          title="Restore Player / ऑडियो प्लेयर दिखाएँ"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden relative shrink-0 border border-[var(--gold-primary)]/50">
            <Image
              src={currentSong.thumbnail_url || '/logo.png'}
              alt={currentSong.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <span className="text-xs font-semibold max-w-[140px] truncate text-[var(--text-primary)]">
            {songTitle}
          </span>
          <ChevronUp className="w-4 h-4 text-[var(--gold-primary)] group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-player px-4 sm:px-8 py-3 shadow-2xl border-t border-[var(--gold-border)] flex flex-col md:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-4 duration-300">
      {/* Left: Track Details & Spinning Disc Thumbnail */}
      <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0 justify-between md:justify-start">
        <div
          onClick={openFullPlayer}
          className="flex items-center gap-3.5 min-w-0 cursor-pointer group"
        >
          {/* Spinning Artwork Disc */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[var(--gold-primary)]/40 shadow-lg shadow-[var(--gold-primary)]/15 bg-[var(--maroon-pill)] flex items-center justify-center">
            <Image
              src={currentSong.thumbnail_url || '/logo.png'}
              alt={currentSong.title}
              fill
              unoptimized
              className={`object-cover ${isPlaying ? 'spin-vinyl' : 'spin-vinyl spin-vinyl-paused'}`}
            />
            {/* Center spindle */}
            <div className="absolute w-3 h-3 rounded-full bg-[var(--bg-void)] border border-[var(--gold-primary)] z-10" />
          </div>

          <div className="min-w-0 truncate">
            <h4 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--gold-primary)] truncate transition-colors">
              {songTitle}
            </h4>
            <p className="text-[11px] text-[var(--text-muted)] truncate">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Action: Dismiss button on mobile */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={dismissBottomPlayer}
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[#F87171] hover:bg-[var(--maroon-pill)] transition-all cursor-pointer"
            title="Hide Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Transport Controls & Scrubber */}
      <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4 max-w-xl">
        <div className="flex items-center gap-5">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isShuffled ? 'text-[var(--gold-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={previous}
            className="text-[var(--text-secondary)] hover:text-[var(--gold-primary)] transition-colors cursor-pointer"
            title="Previous"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          {/* Gold Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[var(--gold-primary)] hover:opacity-90 text-[#12090A] flex items-center justify-center shadow-lg shadow-[var(--gold-primary)]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-[#12090A]" />
            ) : (
              <Play className="w-4 h-4 fill-[#12090A] ml-0.5" />
            )}
          </button>

          <button
            onClick={next}
            className="text-[var(--text-secondary)] hover:text-[var(--gold-primary)] transition-colors cursor-pointer"
            title="Next"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={toggleLoop}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isLooping ? 'text-[var(--gold-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
            title="Loop"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Scrubber Progress Bar */}
        <div className="w-full flex items-center gap-3 text-[10px] font-mono text-[var(--text-muted)]">
          <span className="w-9 text-right">{formatTime(currentTime)}</span>
          <div
            className="relative flex-1 h-1.5 bg-[var(--maroon-pill)] rounded-full overflow-hidden cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              seek(clickPos * duration);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-[var(--gold-secondary)] to-[var(--gold-primary)] rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="w-9">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume, Expand & Close / Dismiss Player */}
      <div className="hidden md:flex items-center gap-2 w-1/3 justify-end">
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleMute}
            className="text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition-colors p-1 cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#F87171]" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-[var(--maroon-pill)] accent-[var(--gold-primary)] rounded-full cursor-pointer"
          />
        </div>

        {/* Fullscreen Expand */}
        <button
          onClick={openFullPlayer}
          className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--gold-primary)] hover:bg-[var(--maroon-pill)] transition-all ml-1 cursor-pointer"
          title="Expand Player"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* REMOVE / DISMISS BOTTOM PLAYER */}
        <button
          onClick={dismissBottomPlayer}
          className="p-2 rounded-full text-[var(--text-muted)] hover:text-[#F87171] hover:bg-[var(--maroon-pill)] transition-all ml-1 cursor-pointer"
          title="Remove / Hide Bottom Player (हटाएँ)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
