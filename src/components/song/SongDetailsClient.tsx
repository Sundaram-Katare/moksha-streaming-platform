'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Play,
  Pause,
  Heart,
  ChevronRight,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Copy,
  Check,
  FileText,
  Plus,
} from 'lucide-react';
import { Song, LyricLanguage } from '@/types';
import { usePlayer } from '@/features/player/PlayerContext';
import { useLanguage } from '@/features/language/LanguageContext';
import { CommentsSection } from '@/features/comments/CommentsSection';
import { AddToPlaylistModal } from '@/components/playlist/AddToPlaylistModal';

interface SongDetailsClientProps {
  song: Song;
  relatedSongs?: Song[];
}

export function SongDetailsClient({ song, relatedSongs = [] }: SongDetailsClientProps) {
  const {
    play,
    pause,
    togglePlay,
    next,
    previous,
    seek,
    toggleShuffle,
    toggleLoop,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isShuffled,
    isLooping,
  } = usePlayer();

  const { t, language } = useLanguage();
  const [activeLang, setActiveLang] = useState<LyricLanguage>('hi');
  const [isLiked, setIsLiked] = useState(song.user_has_liked ?? false);
  const [likesCount, setLikesCount] = useState(song.likes_count || 0);
  const [copied, setCopied] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);

  const isCurrentPlaying = isPlaying && currentSong?.id === song.id;

  const togglePlayState = () => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      play(song);
    }
  };

  const toggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Duration for display
  const activeDuration = currentSong?.id === song.id ? duration : (song.duration_seconds || 180);
  const activeCurrentTime = currentSong?.id === song.id ? currentTime : 0;
  const progressPercent = activeDuration > 0 ? (activeCurrentTime / activeDuration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    seek(newPercent * activeDuration);
  };

  const currentLyricsObj = song.lyrics?.find((l) => l.language === activeLang);
  const lyricsText =
    currentLyricsObj?.lyrics ||
    song.description ||
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--gold-primary)] transition-colors">
            {t('Sanctuary', 'धाम')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/explore" className="hover:text-[var(--gold-primary)] transition-colors">
            {t('Explore', 'संग्रह')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--gold-primary)] font-semibold truncate max-w-[200px]">
            {song.title}
          </span>
        </nav>

        {/* Variant 1: Turntable Record Player Deck */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-[var(--gold-border)] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left: Turntable Deck with Spinning Vinyl and Tonearm */}
            <div className="lg:col-span-6 flex justify-center items-center py-4">
              <div className="deck relative aspect-square max-w-[380px] sm:max-w-[420px] w-full">
                {/* Spinning Record */}
                <div className={`record-vinyl ${isCurrentPlaying ? 'is-playing' : ''}`}>
                  {/* Center Record Label with Thumbnail Image */}
                  <div className="absolute inset-[30%] rounded-full overflow-hidden border-2 border-[var(--gold-primary)] shadow-inner flex items-center justify-center bg-[#18080C]">
                    <Image
                      src={song.thumbnail_url || '/logo.png'}
                      alt={song.title}
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
                <div className={`turntable-arm ${isCurrentPlaying ? 'is-playing' : ''}`} />
              </div>
            </div>

            {/* Right: Song Title in English & Hindi, Likes, Scrubber, Transport Controls */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
              {/* Song Name in English & Hindi */}
              <div className="space-y-2">
                <h1 className="font-laila text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
                  {song.title}
                </h1>

                {song.hindi_title && (
                  <div className="font-laila text-2xl sm:text-3xl text-[var(--gold-primary)] font-semibold">
                    {song.hindi_title}
                  </div>
                )}

                {song.artist && (
                  <p className="font-laila text-sm sm:text-base text-[var(--text-secondary)] pt-1">
                    {song.artist}
                  </p>
                )}
              </div>

              {/* Action Buttons: Like & Add to Playlist */}
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
                  <span>{formatTime(activeCurrentTime)}</span>
                  <span>{formatTime(activeDuration)}</span>
                </div>
              </div>

              {/* Transport Controls */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isShuffled ? 'text-[var(--gold-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                  title="Shuffle"
                >
                  <Shuffle className="w-5 h-5" />
                </button>

                <button
                  onClick={previous}
                  className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--gold-primary)] transition-colors cursor-pointer"
                  title="Previous"
                >
                  <SkipBack className="w-6 h-6 fill-current" />
                </button>

                {/* Primary Play Button */}
                <button
                  onClick={togglePlayState}
                  className="w-16 h-16 rounded-full bg-[var(--gold-primary)] hover:opacity-95 text-[#12090A] flex items-center justify-center shadow-xl shadow-[var(--gold-primary)]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title={isCurrentPlaying ? 'Pause' : 'Play'}
                >
                  {isCurrentPlaying ? (
                    <Pause className="w-7 h-7 fill-[#12090A]" />
                  ) : (
                    <Play className="w-7 h-7 fill-[#12090A] ml-1" />
                  )}
                </button>

                <button
                  onClick={next}
                  className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--gold-primary)] transition-colors cursor-pointer"
                  title="Next"
                >
                  <SkipForward className="w-6 h-6 fill-current" />
                </button>

                <button
                  onClick={toggleLoop}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
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

        {/* Lyrics & Comments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Lyrics Container */}
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

          {/* Comments Section */}
          <div className="lg:col-span-5">
            <CommentsSection songId={song.id} />
          </div>
        </div>
      </div>

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        song={song}
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
      />
    </>
  );
}
