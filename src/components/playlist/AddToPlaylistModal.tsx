'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Check, ListMusic, X, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Song, Playlist } from '@/types';
import {
  getUserPlaylists,
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from '@/features/playlists/queries';

interface AddToPlaylistModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToPlaylistModal({ song, isOpen, onClose }: AddToPlaylistModalProps) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [addedPlaylists, setAddedPlaylists] = useState<Set<string>>(new Set());
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (isOpen && user && song) {
      loadPlaylists();
    }
  }, [isOpen, user, song]);

  const loadPlaylists = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await getUserPlaylists(user.id);
      setPlaylists(list);

      // Check which playlists already have this song
      const addedSet = new Set<string>();
      list.forEach((pl) => {
        if (pl.songs?.some((s) => s.id === song?.id)) {
          addedSet.add(pl.id);
        }
      });
      setAddedPlaylists(addedSet);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSong = async (playlist: Playlist) => {
    if (!song) return;
    const isAlreadyAdded = addedPlaylists.has(playlist.id);

    if (isAlreadyAdded) {
      const ok = await removeSongFromPlaylist(playlist.id, song.id);
      if (ok) {
        setAddedPlaylists((prev) => {
          const next = new Set(prev);
          next.delete(playlist.id);
          return next;
        });
        setFeedbackMsg(`Removed from "${playlist.name}"`);
      }
    } else {
      const ok = await addSongToPlaylist(playlist.id, song.id);
      if (ok) {
        setAddedPlaylists((prev) => new Set(prev).add(playlist.id));
        setFeedbackMsg(`Added to "${playlist.name}"`);
      }
    }

    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !song || !newPlaylistName.trim()) return;

    setIsCreating(true);
    try {
      const created = await createPlaylist(user.id, newPlaylistName.trim());
      if (created) {
        await addSongToPlaylist(created.id, song.id);
        setNewPlaylistName('');
        setFeedbackMsg(`Created "${created.name}" and added track!`);
        await loadPlaylists();
      }
    } finally {
      setIsCreating(false);
      setTimeout(() => setFeedbackMsg(''), 3000);
    }
  };

  if (!isOpen || !song) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-[var(--gold-border)] shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-border)]">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[var(--gold-primary)]" />
            <h3 className="font-cinzel text-base font-bold text-[var(--text-primary)]">
              Add to Sacred Playlist
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Song Preview */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--gold-border)]/50">
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
              {song.title}
            </h4>
            <p className="text-[11px] text-[var(--gold-primary)] font-devanagari truncate">
              {song.hindi_title}
            </p>
          </div>
        </div>

        {feedbackMsg && (
          <div className="p-2 rounded-xl bg-[#1C2A1E] border border-[#34D399]/40 text-[11px] text-[#34D399] text-center font-medium">
            {feedbackMsg}
          </div>
        )}

        {/* Content based on Auth status */}
        {!user ? (
          <div className="text-center py-6 space-y-4">
            <p className="text-xs text-[var(--text-secondary)]">
              Sign in to curate your own playlists and save sacred recordings to your library.
            </p>
            <Link
              href="/login"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--gold-primary)] hover:opacity-90 text-[#12090A] font-bold text-xs shadow-md shadow-[var(--gold-primary)]/20 transition-all hover:scale-105 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Continue</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Create inline playlist */}
            <form onSubmit={handleCreateNew} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Create new playlist..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="flex-1 bg-[var(--bg-card)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)]"
              />
              <button
                type="submit"
                disabled={isCreating || !newPlaylistName.trim()}
                className="px-3.5 py-2 rounded-xl bg-[var(--gold-primary)] text-[#12090A] font-bold text-xs hover:opacity-90 transition-all disabled:opacity-40 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create</span>
              </button>
            </form>

            {/* Playlists List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {loading ? (
                <p className="text-center text-xs text-[var(--text-muted)] py-4">Loading your playlists...</p>
              ) : playlists.length === 0 ? (
                <p className="text-center text-xs text-[var(--text-muted)] py-4">
                  You haven&apos;t created any playlists yet. Enter a name above to create your first one!
                </p>
              ) : (
                playlists.map((pl) => {
                  const isAdded = addedPlaylists.has(pl.id);
                  return (
                    <button
                      key={pl.id}
                      onClick={() => handleToggleSong(pl)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                        isAdded
                          ? 'bg-[var(--maroon-pill)] border-[var(--gold-primary)] text-[var(--gold-primary)]'
                          : 'bg-[var(--bg-card)] border-[var(--gold-border)] text-[var(--text-primary)] hover:border-[var(--gold-primary)]/50'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold truncate">{pl.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {pl.song_count || 0} tracks
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          isAdded
                            ? 'bg-[var(--gold-primary)] text-[#12090A]'
                            : 'border border-[var(--gold-border)] text-[var(--text-muted)]'
                        }`}
                      >
                        {isAdded ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
