'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Copy,
  Check,
  FileText,
  Plus,
} from 'lucide-react';
import { usePlayer } from '@/features/player/PlayerContext';
import { useLanguage } from '@/features/language/LanguageContext';
import { CommentsSection } from '@/features/comments/CommentsSection';
import { AddToPlaylistModal } from '@/components/playlist/AddToPlaylistModal';
import { LyricLanguage } from '@/types';

export function FullPlayerModal() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isShuffled,
    isLooping,
    isFullPlayerOpen,
    togglePlay,
    next,
    previous,
    seek,
    toggleShuffle,
    toggleLoop,
    closeFullPlayer,
  } = usePlayer();

  const { t, language } = useLanguage();
  const [activeLang, setActiveLang] = useState<LyricLanguage>('hi');
  const [isLiked, setIsLiked] = useState(currentSong?.user_has_liked ?? false);
  const [likesCount, setLikesCount] = useState(currentSong?.likes_count || 0);
  const [copied, setCopied] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);

  if (!isFullPlayerOpen || !currentSong) return null;

  const toggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    seek(newPercent * duration);
  };

  const currentLyricsObj = currentSong.lyrics?.find((l) => l.language === activeLang);
  const lyricsText =
    currentLyricsObj?.lyrics ||
    currentSong.description ||
    (language === 'HI'
      ? 'इस पवित्र रचना के बोल जल्द ही उपलब्ध होंगे।'
      : 'Lyrics for this sacred recording will be consecrated soon.');

  const handleCopyLyrics = () => {
    navigator.clipboard.writeText(lyricsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-void)]/98 backdrop-blur-3xl flex flex-col justify-between animate-in fade-in duration-300">
        {/* Top Header */}
        <div className="sticky top-0 z-30 w-full px-6 lg:px-12 py-4 flex items-center justify-between border-b border-[var(--gold-border)] glass-nav">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--gold-border)]">
              <Image
                src="/logo.png"
                alt="Moksha Music"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-laila font-bold text-sm tracking-wide text-[var(--text-primary)]">
              MOKSHA MUSIC
            </span>
          </div>

          {/* Close Modal Button */}
          <button
            onClick={closeFullPlayer}
            className="p-2.5 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--gold-border)] text-[var(--gold-primary)] hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
            title="Close Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-10">
          {/* Turntable Record Player Deck */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-[var(--gold-border)] shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              {/* Left: Turntable Deck with Spinning Vinyl and Tonearm */}
              <div className="lg:col-span-6 flex justify-center items-center py-4">
                <div className="deck relative aspect-square max-w-[380px] sm:max-w-[420px] w-full">
                  {/* Spinning Record */}
                  <div className={`record-vinyl ${isPlaying ? 'is-playing' : ''}`}>
                    {/* Center Record Label with Thumbnail Image */}
                    <div className="absolute inset-[30%] rounded-full overflow-hidden border-2 border-[var(--gold-primary)] shadow-inner flex items-center justify-center bg-[#18080C]">
                      <Image
                        src={currentSong.thumbnail_url || '/logo.png'}
                        alt={currentSong.title}
                        fill
                        unoptimized
                        className="object-cover"
                        priority
                      />
                      {/* Center Spindle Hole */}
                      <div className="absolute w-4 h-4 rounded-full bg-[var(--bg-void)] border border-[var(--gold-primary)] z-10" />
                    </div>
                  </div>

                  {/* Tonearm */}
                  <div className={`turntable-arm ${isPlaying ? 'is-playing' : ''}`} />
                </div>
              </div>

              {/* Right: Song Title in English & Hindi, Likes, Scrubber, Transport Controls */}
              <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
                {/* Song Name in English & Hindi */}
                <div className="space-y-2">
                  <h1 className="font-laila text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
                    {currentSong.title}
                  </h1>

                  {currentSong.hindi_title && (
                    <div className="font-laila text-2xl sm:text-3xl text-[var(--gold-primary)] font-semibold">
                      {currentSong.hindi_title}
                    </div>
                  )}

                  {currentSong.artist && (
                    <p className="font-laila text-sm sm:text-base text-[var(--text-secondary)] pt-1">
                      {currentSong.artist}
                    </p>
                  )}
                </div>

                {/* Like Button & Add to Playlist */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all cursor-pointer ${
                      isLiked
                        ? 'bg-red-500/15 border-red-500 text-red-500 shadow-md shadow-red-500/20'
                        : 'bg-[var(--bg-void)] border-[var(--gold-border)] text-[var(--text-secondary)] hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                    <span className="font-laila text-xs font-semibold">
                      {likesCount.toLocaleString()} {t('Likes', 'पसंद')}
                    </span>
                  </button>

                  <button
                    onClick={() => setIsAddToPlaylistOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--gold-border)] hover:border-[var(--gold-primary)] bg-[var(--bg-void)] text-[var(--gold-primary)] transition-all cursor-pointer shadow-sm hover:bg-[var(--maroon-pill)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-laila text-xs font-semibold">{t('Add to Playlist', 'प्लेलिस्ट में जोड़ें')}</span>
                  </button>
                </div>

                {/* Scrubber Progress Bar */}
                <div className="space-y-2">
                  <div
                    onClick={handleSeek}
                    className="w-full h-2.5 rounded-full bg-[var(--maroon-pill)] dark:bg-white/15 border border-[var(--gold-border)] hover:border-[var(--gold-primary)] transition-all cursor-pointer relative group flex items-center"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--gold-secondary)] to-[var(--gold-primary)] relative"
                      style={{ width: `${progressPercent}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--gold-primary)] shadow-md shadow-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-mono font-medium text-[var(--text-muted)]">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Transport Controls */}
                <div className="flex items-center justify-start gap-4 sm:gap-6 pt-2">
                  <button
                    onClick={toggleShuffle}
                    className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                      isShuffled ? 'text-[var(--gold-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                    title="Shuffle"
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>

                  <button
                    onClick={previous}
                    className="p-2.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--gold-primary)] transition-colors cursor-pointer"
                    title="Previous"
                  >
                    <SkipBack className="w-6 h-6 fill-current" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-[var(--gold-primary)] hover:opacity-95 text-[#12090A] flex items-center justify-center shadow-xl shadow-[var(--gold-primary)]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 fill-[#12090A]" />
                    ) : (
                      <Play className="w-7 h-7 fill-[#12090A] ml-1" />
                    )}
                  </button>

                  <button
                    onClick={next}
                    className="p-2.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--gold-primary)] transition-colors cursor-pointer"
                    title="Next"
                  >
                    <SkipForward className="w-6 h-6 fill-current" />
                  </button>

                  <button
                    onClick={toggleLoop}
                    className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                      isLooping ? 'text-[var(--gold-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                    title="Loop"
                  >
                    <Repeat className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lyrics and Comments */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-border)]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--gold-primary)]" />
                  <h3 className="font-laila text-lg font-bold text-[var(--text-primary)]">
                    {t('Lyrics & Notes', 'भजन के बोल व विवरण')}
                  </h3>
                </div>

                <button
                  onClick={handleCopyLyrics}
                  className="p-2 rounded-full bg-[var(--bg-void)] border border-[var(--gold-border)] text-[var(--gold-primary)] hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
                  title="Copy Lyrics"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="max-h-[440px] overflow-y-auto pr-2 space-y-4 font-laila text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
                <div className="p-5 rounded-2xl bg-[var(--bg-void)] border border-[var(--gold-border)]">
                  <pre className="whitespace-pre-wrap font-inherit leading-loose tracking-wide text-[var(--text-primary)]">
                    {lyricsText}
                  </pre>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <CommentsSection songId={currentSong.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        song={currentSong}
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
      />
    </>
  );
}
