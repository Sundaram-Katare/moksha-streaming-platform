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
  FileText,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { usePlayer } from '@/features/player/PlayerContext';
import { useLanguage } from '@/features/language/LanguageContext';
import { AestheticSocialCardModal } from '@/features/share-card/AestheticSocialCardModal';

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
  const [isInlineLyricsOpen, setIsInlineLyricsOpen] = React.useState(false);
  const [inlineLyricsLang, setInlineLyricsLang] = React.useState<'hi' | 'en' | 'hinglish'>('hi');
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [copiedLyrics, setCopiedLyrics] = React.useState(false);

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

          {/* Bronze Pill Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bronze-pill text-white flex items-center justify-center shadow-lg shadow-[var(--gold-primary)]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
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

      {/* Right: Lyrics, Share Card, Volume, Expand & Close */}
      <div className="hidden md:flex items-center gap-2 w-1/3 justify-end">
        {/* Toggle Inline Lyrics */}
        <button
          onClick={() => setIsInlineLyricsOpen(!isInlineLyricsOpen)}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            isInlineLyricsOpen
              ? 'bronze-pill text-white'
              : 'text-[var(--text-muted)] hover:text-[var(--gold-primary)] hover:bg-[var(--maroon-pill)]'
          }`}
          title="Song Lyrics / भजन के बोल"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Social Share Card Generator */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--gold-primary)] hover:bg-[var(--maroon-pill)] transition-all cursor-pointer"
          title="Create Aesthetic Social Card / सुंदर कार्ड बनाएं"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 ml-1">
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

      {/* Floating Inline Lyrics Drawer */}
      {isInlineLyricsOpen && (
        <div className="absolute bottom-[calc(100%+10px)] left-4 right-4 md:left-auto md:right-8 md:w-[460px] max-h-[400px] rounded-2xl bg-[var(--bg-card)]/95 backdrop-blur-xl border border-[var(--gold-border)] shadow-2xl p-4 flex flex-col z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-border)]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--gold-primary)]" />
              <span className="text-xs font-serif font-bold text-[var(--text-primary)]">Lyrics / भजन के बोल</span>
            </div>
            <div className="flex items-center gap-1.5">
              {(['hi', 'en', 'hinglish'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setInlineLyricsLang(lang)}
                  className={`px-2.5 py-0.5 text-[10px] rounded-full font-medium transition-all ${
                    inlineLyricsLang === lang
                      ? 'bronze-pill text-white'
                      : 'bg-[var(--maroon-pill)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {lang === 'hi' ? 'हिंदी' : lang === 'en' ? 'English' : 'Hinglish'}
                </button>
              ))}
              <button
                onClick={() => {
                  const lyricObj = currentSong.lyrics?.find((l) => l.language === inlineLyricsLang) || currentSong.lyrics?.[0];
                  const activeLyrics = lyricObj?.lyrics || (lyricObj as any)?.text;
                  if (activeLyrics) {
                    navigator.clipboard.writeText(activeLyrics);
                    setCopiedLyrics(true);
                    setTimeout(() => setCopiedLyrics(false), 2000);
                  }
                }}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition-colors ml-1"
                title="Copy Lyrics"
              >
                {copiedLyrics ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsInlineLyricsOpen(false)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[#F87171] transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-2 text-center text-xs sm:text-sm font-serif leading-relaxed text-[var(--text-primary)] whitespace-pre-line scrollbar-thin">
            {(() => {
              const foundObj = currentSong.lyrics?.find((l) => l.language === inlineLyricsLang);
              const fallbackObj = currentSong.lyrics && currentSong.lyrics.length > 0 ? currentSong.lyrics[0] : null;
              const text = foundObj?.lyrics || (foundObj as any)?.text || fallbackObj?.lyrics || (fallbackObj as any)?.text;
              if (!text) {
                return (
                  <div className="py-8 text-center text-xs text-[var(--text-muted)]">
                    <p className="font-hindi text-sm">इस भजन के बोल अभी उपलब्ध नहीं हैं।</p>
                    <p className="mt-1 opacity-70">Lyrics for this song have not been consecrated yet by the admin.</p>
                  </div>
                );
              }
              return text;
            })()}
          </div>
        </div>
      )}

      {/* Aesthetic Social Card Modal */}
      {isShareModalOpen && (
        <AestheticSocialCardModal
          item={{
            id: currentSong.id,
            title: currentSong.title,
            hindi_title: currentSong.hindi_title,
            artist: currentSong.artist,
            thumbnail_url: currentSong.thumbnail_url,
            type: 'song',
            category: (currentSong as any).category,
          }}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}
