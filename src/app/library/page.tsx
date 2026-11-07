'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Music,
  ListMusic,
  ArrowLeft,
  LogIn,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { usePlayer } from '@/features/player/PlayerContext';
import { useLanguage } from '@/features/language/LanguageContext';
import { Playlist, Song } from '@/types';
import {
  getUserPlaylists,
  createPlaylist,
  getPlaylistById,
  removeSongFromPlaylist,
  deletePlaylist,
  addSongToPlaylist,
} from '@/features/playlists/queries';

export default function LibraryPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { play, currentSong, isPlaying } = usePlayer();
  const { t, language } = useLanguage();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Create Playlist Modal / Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available songs to add to playlist
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [showAddSongsModal, setShowAddSongsModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadPlaylists();
      loadAvailableSongs();
    }
  }, [user]);

  const loadPlaylists = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const list = await getUserPlaylists(user.id);
      setPlaylists(list);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableSongs = async () => {
    try {
      const res = await fetch('/api/songs', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setAvailableSongs(data.songs);
      }
    } catch {
      // Ignored
    }
  };

  const handleSelectPlaylist = async (playlist: Playlist) => {
    const full = await getPlaylistById(playlist.id);
    setSelectedPlaylist(full || playlist);
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPlaylistName.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await createPlaylist(user.id, newPlaylistName.trim(), newPlaylistDesc.trim());
      if (created) {
        setNewPlaylistName('');
        setNewPlaylistDesc('');
        setShowCreateModal(false);
        await loadPlaylists();
        setSelectedPlaylist(created);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlaylist = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the playlist "${name}"?`)) return;

    const ok = await deletePlaylist(id);
    if (ok) {
      setSelectedPlaylist(null);
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (!selectedPlaylist) return;
    const ok = await removeSongFromPlaylist(selectedPlaylist.id, songId);
    if (ok) {
      const updatedSongs = (selectedPlaylist.songs || []).filter((s) => s.id !== songId);
      const updated = {
        ...selectedPlaylist,
        songs: updatedSongs,
        song_count: updatedSongs.length,
      };
      setSelectedPlaylist(updated);
      setPlaylists((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    }
  };

  const handleAddSongDirect = async (song: Song) => {
    if (!selectedPlaylist) return;
    const ok = await addSongToPlaylist(selectedPlaylist.id, song.id);
    if (ok) {
      const updatedSongs = [...(selectedPlaylist.songs || []), song];
      const updated = {
        ...selectedPlaylist,
        songs: updatedSongs,
        song_count: updatedSongs.length,
      };
      setSelectedPlaylist(updated);
      setPlaylists((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    }
  };

  const handlePlayAll = () => {
    if (selectedPlaylist && selectedPlaylist.songs && selectedPlaylist.songs.length > 0) {
      play(selectedPlaylist.songs[0], selectedPlaylist.songs);
    }
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining.toString().padStart(2, '0')}`;
  };

  // Auth loading state
  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--gold-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in view
  if (!user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 flex flex-col items-center justify-center min-h-[65vh] text-center">
        <div className="glass-panel max-w-md w-full rounded-3xl p-8 sm:p-12 border border-[var(--gold-border)] shadow-2xl flex flex-col items-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[var(--maroon-pill)] border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold-primary)] shadow-lg">
            <ListMusic className="w-10 h-10 opacity-80" />
          </div>

          <div className="space-y-2">
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {t('Sacred Playlists Sanctuary', 'पवित्र प्लेलिस्ट्स संग्रह')}
            </h1>
            <p className="font-laila text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              {t(
                'Sign in to curate your personal devotion playlists, add your favorite bhajans, and meditate with custom tracks.',
                'अपनी व्यक्तिगत भजन प्लेलिस्ट बनाने और अपने पसंदीदा भजनों को सहेजने के लिए कृपया साइन इन करें।'
              )}
            </p>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 px-8 py-3 rounded-full bronze-pill hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-[var(--gold-primary)]/20 hover:scale-105 active:scale-95 transition-all"
          >
            <LogIn className="w-4 h-4 text-white" />
            <span>{t('Sign In to Create Playlists', 'प्लेलिस्ट बनाने के लिए साइन इन करें')}</span>
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DETAIL VIEW OF A SELECTED PLAYLIST
  // -------------------------------------------------------------
  if (selectedPlaylist) {
    const songs = selectedPlaylist.songs || [];
    const isThisListPlaying =
      isPlaying && currentSong && songs.some((s) => s.id === currentSong.id);

    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPlaylist(null)}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--gold-primary)] hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Back to All Playlists', 'सभी प्लेलिस्ट पर वापस')}</span>
        </button>

        {/* Playlist Banner Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-xl flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-[var(--maroon-pill)] border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold-primary)] shrink-0 shadow-lg relative overflow-hidden">
              {songs.length > 0 && songs[0].thumbnail_url ? (
                <Image
                  src={songs[0].thumbnail_url}
                  alt={selectedPlaylist.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <Music className="w-12 h-12 opacity-60" />
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-primary)]">
                {t('Private User Playlist', 'निजी प्लेलिस्ट')}
              </span>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
                {selectedPlaylist.name}
              </h1>
              {selectedPlaylist.description && (
                <p className="font-laila text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg">
                  {selectedPlaylist.description}
                </p>
              )}
              <p className="text-xs text-[var(--text-muted)]">
                {songs.length} {songs.length === 1 ? 'track' : 'tracks'} • Curated for your sadhana
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {songs.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-6 py-3 rounded-full bronze-pill hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-[var(--gold-primary)]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isThisListPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isThisListPlaying ? 'Playing' : 'Play All'}</span>
              </button>
            )}

            <button
              onClick={() => setShowAddSongsModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-full border border-[var(--gold-border)] hover:border-[var(--gold-primary)] text-xs font-semibold text-[var(--text-primary)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[var(--gold-primary)]" />
              <span>Add Songs</span>
            </button>

            <button
              onClick={() => handleDeletePlaylist(selectedPlaylist.id, selectedPlaylist.name)}
              className="p-3 rounded-full border border-[var(--gold-border)] hover:border-[#F87171] text-[var(--text-muted)] hover:text-[#F87171] transition-all cursor-pointer"
              title="Delete Playlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Songs List */}
        <div className="space-y-3">
          <h3 className="font-cinzel text-lg font-bold text-[var(--text-primary)]">
            {t('Playlist Tracks', 'ट्रैक्स')}
          </h3>

          {songs.length === 0 ? (
            <div className="glass-panel rounded-3xl p-10 border border-[var(--gold-border)] text-center space-y-4">
              <Music className="w-10 h-10 text-[var(--gold-primary)] opacity-40 mx-auto" />
              <h4 className="font-laila text-base font-semibold text-[var(--text-primary)]">
                No songs in this playlist yet
              </h4>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Add songs from the sanctuary catalog to begin your devotional playlist.
              </p>
              <button
                onClick={() => setShowAddSongsModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bronze-pill text-white font-bold text-xs hover:opacity-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Add Songs to Playlist</span>
              </button>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl border border-[var(--gold-border)] overflow-hidden divide-y divide-[var(--gold-border)]/20">
              {songs.map((song, idx) => {
                const isThisPlaying = isPlaying && currentSong?.id === song.id;
                const displayName = language === 'HI' && song.hindi_title ? song.hindi_title : song.title;

                return (
                  <div
                    key={song.id}
                    className="p-3 sm:p-4 flex items-center justify-between gap-4 hover:bg-[var(--maroon-pill)]/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span className="w-6 text-center text-xs font-mono text-[var(--text-muted)] group-hover:hidden">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <button
                        onClick={() => play(song, songs)}
                        className="w-6 hidden group-hover:flex items-center justify-center text-[var(--gold-primary)] cursor-pointer"
                      >
                        {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[var(--maroon-pill)] shrink-0 border border-[var(--gold-border)]">
                        <Image
                          src={song.thumbnail_url || '/logo.png'}
                          alt={song.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <h4
                          onClick={() => play(song, songs)}
                          className={`text-xs sm:text-sm font-semibold truncate cursor-pointer hover:text-[var(--gold-primary)] transition-colors ${
                            isThisPlaying ? 'text-[var(--gold-primary)]' : 'text-[var(--text-primary)]'
                          }`}
                        >
                          {displayName}
                        </h4>
                        <p className="text-[11px] text-[var(--text-muted)] truncate">
                          {song.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        {formatDuration(song.duration_seconds || 180)}
                      </span>
                      <button
                        onClick={() => handleRemoveSong(song.id)}
                        className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[#F87171] hover:bg-[#381419] transition-all cursor-pointer"
                        title="Remove from playlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Add Available Songs to this Playlist */}
        {showAddSongsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 border border-[var(--gold-border)] shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-border)]">
                <h3 className="font-cinzel text-base font-bold text-[var(--text-primary)]">
                  Add Songs to &ldquo;{selectedPlaylist.name}&rdquo;
                </h3>
                <button
                  onClick={() => setShowAddSongsModal(false)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Done
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {availableSongs.length === 0 ? (
                  <p className="text-center text-xs text-[var(--text-muted)] py-6">
                    No songs found on the sanctuary yet. Please add songs via Admin Console.
                  </p>
                ) : (
                  availableSongs.map((song) => {
                    const alreadyIn = songs.some((s) => s.id === song.id);
                    return (
                      <div
                        key={song.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--gold-border)]/50"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[var(--maroon-pill)] shrink-0">
                            <Image src={song.thumbnail_url || '/logo.png'} alt={song.title} fill unoptimized className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{song.title}</p>
                            <p className="text-[10px] text-[var(--text-muted)] truncate">{song.hindi_title}</p>
                          </div>
                        </div>

                        {alreadyIn ? (
                          <span className="text-[10px] text-[#34D399] font-medium flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Added
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddSongDirect(song)}
                            className="px-3 py-1.5 rounded-full bronze-pill text-white font-bold text-[11px] hover:opacity-95 transition-all cursor-pointer shrink-0"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // LIST VIEW OF ALL USER PLAYLISTS
  // -------------------------------------------------------------
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--gold-border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--maroon-pill)] border border-[var(--gold-border)] mb-2">
            <ListMusic className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
            <span className="text-[10px] font-bold tracking-wider text-[var(--gold-primary)] uppercase">
              {t('PERSONAL SANCTUARY', 'व्यक्तिगत संग्रह')}
            </span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
            {t('My Sacred Playlists', 'मेरी पवित्र प्लेलिस्ट्स')}
          </h1>
          <p className="font-laila text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {t(
              'Your private collections of bhajans, stotrams, and chants. Only visible to you.',
              'भजनों और स्तोत्रों का आपका निजी संग्रह। केवल आपके लिए दृश्यमान।'
            )}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bronze-pill hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[var(--gold-primary)]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>{t('Create New Playlist', 'नई प्लेलिस्ट बनाएं')}</span>
        </button>
      </div>

      {/* Grid of Playlists */}
      {isLoading ? (
        <div className="text-center py-16 text-xs text-[var(--text-muted)]">
          Loading your sacred playlists...
        </div>
      ) : playlists.length === 0 ? (
        <div className="glass-panel max-w-lg mx-auto rounded-3xl p-10 border border-[var(--gold-border)] shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[var(--maroon-pill)] mx-auto flex items-center justify-center text-[var(--gold-primary)]">
            <ListMusic className="w-8 h-8 opacity-70" />
          </div>
          <div className="space-y-1">
            <h3 className="font-cinzel text-xl font-bold text-[var(--text-primary)]">
              {t('No Playlists Created Yet', 'कोई प्लेलिस्ट नहीं है')}
            </h3>
            <p className="font-laila text-xs text-[var(--text-muted)] leading-relaxed">
              {t(
                'Create your first playlist and add existing songs from the sanctuary to listen anytime.',
                'अपनी पहली प्लेलिस्ट बनाएं और कभी भी सुनने के लिए वेबसाइट के गानों को जोड़ें।'
              )}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bronze-pill text-white font-bold text-xs hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>{t('Create Your First Playlist', 'पहली प्लेलिस्ट बनाएं')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => handleSelectPlaylist(pl)}
              className="glass-panel rounded-3xl p-5 border border-[var(--gold-border)] hover:border-[var(--gold-primary)] transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--gold-primary)]/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[var(--maroon-pill)] flex items-center justify-center border border-[var(--gold-border)]/50">
                  {pl.songs && pl.songs.length > 0 && pl.songs[0].thumbnail_url ? (
                    <Image src={pl.songs[0].thumbnail_url} alt={pl.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Music className="w-10 h-10 text-[var(--gold-primary)] opacity-50" />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-cinzel text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--gold-primary)] transition-colors truncate">
                    {pl.name}
                  </h3>
                  {pl.description && (
                    <p className="font-laila text-xs text-[var(--text-muted)] line-clamp-2">
                      {pl.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--gold-border)]/30 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>{pl.song_count || pl.songs?.length || 0} tracks</span>
                <span className="text-[var(--gold-primary)] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Open Playlist &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-2xl space-y-5">
            <h3 className="font-cinzel text-lg font-bold text-[var(--text-primary)]">
              {t('Create Sacred Playlist', 'नई प्लेलिस्ट बनाएं')}
            </h3>

            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  {t('Playlist Name', 'प्लेलिस्ट का नाम')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Dhyan, Vrindavan Kirtans"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--gold-border)] rounded-xl py-2.5 px-3.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  {t('Description (Optional)', 'विवरण (वैकल्पिक)')}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Daily morning sadhana and japa meditations"
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--gold-border)] rounded-xl py-2.5 px-3.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full border border-[var(--gold-border)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newPlaylistName.trim()}
                  className="px-6 py-2 rounded-full bronze-pill text-white font-bold text-xs hover:opacity-95 transition-all disabled:opacity-40"
                >
                  {isSubmitting ? 'Creating...' : 'Create Playlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
