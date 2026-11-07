'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Plus, X, Sparkles, ExternalLink, Share2 } from 'lucide-react';
import { Song } from '@/types';
import { usePlayer } from '@/features/player/PlayerContext';
import { useLanguage } from '@/features/language/LanguageContext';
import { AddToPlaylistModal } from '@/components/playlist/AddToPlaylistModal';
import { AestheticSocialCardModal } from '@/features/share-card/AestheticSocialCardModal';

interface CategorySongRowProps {
  title: string;
  hindiTitle?: string;
  tagline?: string;
  songs: Song[];
}

export function CategorySongRow({ title, hindiTitle, tagline, songs }: CategorySongRowProps) {
  const { play, currentSong, isPlaying } = usePlayer();
  const { t, language } = useLanguage();
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [playlistModalSong, setPlaylistModalSong] = useState<Song | null>(null);
  const [shareCardSong, setShareCardSong] = useState<Song | null>(null);

  if (!songs || songs.length === 0) return null;

  // In the UI, show exactly 5 songs in a row
  const rowSongs = songs.slice(0, 5);
  const hasMore = songs.length > 5;

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6">
        {/* Category Header */}
        <div className="flex items-end justify-between pb-3 mb-4 border-b border-[var(--gold-border)]">
          <div>
            {tagline && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold-primary)] block mb-1">
                {tagline}
              </span>
            )}
            <div className="flex items-baseline gap-3">
              <h3 className="font-laila text-lg sm:text-2xl font-bold text-[var(--text-primary)]">
                {title}
              </h3>
              {hindiTitle && (
                <span className="text-sm sm:text-base font-devanagari text-[var(--gold-primary)] font-semibold">
                  {hindiTitle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsViewAllOpen(true)}
              className="text-xs font-bold text-[var(--gold-primary)] hover:underline px-3 py-1.5 rounded-full hover:bg-[var(--maroon-pill)]/40 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{t('View All', 'सभी देखें')}</span>
              <span className="text-[10px] text-[var(--text-muted)]">({songs.length})</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* 5 Songs in a Row Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {rowSongs.map((song) => {
            const isThisPlaying = isPlaying && currentSong?.id === song.id;
            const displayName = language === 'HI' && song.hindi_title ? song.hindi_title : song.title;

            return (
              <div
                key={song.id}
                className="glass-panel rounded-2xl p-2.5 sm:p-3 border border-[var(--gold-border)] hover:border-[var(--gold-primary)] transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--gold-primary)]/15 flex flex-col justify-between bg-[var(--bg-card)]"
              >
                {/* Square Album Cover Thumbnail with Play and Add actions */}
                <div
                  onClick={() => play(song, songs)}
                  className="relative w-full aspect-square rounded-xl overflow-hidden bg-[var(--maroon-pill)] border border-[var(--gold-border)]/50"
                >
                  <Image
                    src={song.thumbnail_url || '/logo.png'}
                    alt={song.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient bottom scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                  {/* Floating Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25 backdrop-blur-[1px]">
                    <div className="w-10 h-10 rounded-full bronze-pill text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform">
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Top-Right Share Card & Add to Playlist Buttons */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareCardSong(song);
                      }}
                      className="w-7 h-7 rounded-full bg-black/60 hover:bg-[var(--gold-primary)] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                      title="Create Sacred Card / शेयर कार्ड बनाएँ"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlaylistModalSong(song);
                      }}
                      className="w-7 h-7 rounded-full bg-black/60 hover:bg-[var(--gold-primary)] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                      title="Add to Playlist"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Song Meta */}
                <div className="mt-2.5 pt-0.5 space-y-0.5 min-w-0">
                  <h4
                    onClick={() => play(song, songs)}
                    className="text-xs sm:text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--gold-primary)] transition-colors truncate"
                  >
                    {displayName}
                  </h4>
                  {song.hindi_title && language !== 'HI' && (
                    <p className="text-[11px] text-[var(--gold-primary)] font-devanagari truncate">
                      {song.hindi_title}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-0.5">
                    <span className="truncate">{song.artist}</span>
                    {song.spotify_url && (
                      <a
                        href={song.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#1DB954] hover:underline shrink-0 pl-1"
                        title="Open on Spotify"
                      >
                        Spotify
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* "View All" Modal */}
      {isViewAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[85vh] glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-2xl flex flex-col bg-[var(--bg-surface)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--gold-border)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bronze-pill text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-laila font-bold text-lg sm:text-xl text-[var(--text-primary)]">
                    {title} — {t('All Sacred Tracks', 'सभी पावन गीत')}
                  </h3>
                  {hindiTitle && (
                    <p className="text-xs text-[var(--gold-primary)] font-devanagari font-semibold">
                      {hindiTitle}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsViewAllOpen(false)}
                className="p-2 rounded-full border border-[var(--gold-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--maroon-pill)] transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Grid of all songs in this category */}
            <div className="flex-1 overflow-y-auto py-5 pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {songs.map((song) => {
                  const isThisPlaying = isPlaying && currentSong?.id === song.id;
                  const displayName = language === 'HI' && song.hindi_title ? song.hindi_title : song.title;

                  return (
                    <div
                      key={song.id}
                      onClick={() => play(song, songs)}
                      className="glass-panel rounded-2xl p-3 border border-[var(--gold-border)] hover:border-[var(--gold-primary)] transition-all group cursor-pointer hover:-translate-y-1 hover:shadow-lg bg-[var(--bg-card)] flex flex-col justify-between"
                    >
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[var(--maroon-pill)] border border-[var(--gold-border)]/50">
                        <Image
                          src={song.thumbnail_url || '/logo.png'}
                          alt={song.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-9 h-9 rounded-full bronze-pill text-white flex items-center justify-center shadow-lg">
                            {isThisPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 space-y-0.5">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--gold-primary)] transition-colors truncate">
                          {displayName}
                        </h4>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">{song.artist}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[var(--gold-border)]/50 flex items-center justify-between text-xs text-[var(--text-muted)] shrink-0">
              <span>{songs.length} tracks available in this category</span>
              <button
                onClick={() => setIsViewAllOpen(false)}
                className="px-4 py-1.5 rounded-full bronze-pill text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add To Playlist Modal */}
      {playlistModalSong && (
        <AddToPlaylistModal
          song={playlistModalSong}
          isOpen={true}
          onClose={() => setPlaylistModalSong(null)}
        />
      )}

      {/* Shareable Aesthetic Social Card Modal */}
      {shareCardSong && (
        <AestheticSocialCardModal
          isOpen={Boolean(shareCardSong)}
          onClose={() => setShareCardSong(null)}
          media={{
            id: shareCardSong.id,
            title: shareCardSong.title,
            hindi_title: shareCardSong.hindi_title,
            artist: shareCardSong.artist,
            thumbnail_url: shareCardSong.thumbnail_url,
            type: 'song',
          }}
        />
      )}
    </>
  );
}
