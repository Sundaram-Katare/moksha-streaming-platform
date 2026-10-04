'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldAlert,
  Upload,
  Music,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileAudio,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Song } from '@/types';
import { usePlayer } from '@/features/player/PlayerContext';

export default function AdminPage() {
  const { user, profile, isAdmin, isLoading: isAuthLoading } = useAuth();
  const { play, currentSong, isPlaying } = usePlayer();

  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [hindiTitle, setHindiTitle] = useState('');
  const [artist, setArtist] = useState('Moksha Devotional');
  const [deityFocus, setDeityFocus] = useState('Krishna');
  const [raag, setRaag] = useState('');
  const [tala, setTala] = useState('');
  const [description, setDescription] = useState('');

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch all songs
  const fetchSongs = async () => {
    setIsLoadingSongs(true);
    try {
      const res = await fetch('/api/songs', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setSongs(data.songs);
      }
    } catch {
      // Failed to load
    } finally {
      setIsLoadingSongs(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Handle Thumbnail selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Handle Audio selection
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);

      // Measure duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setAudioDuration(Math.round(audio.duration));
        }
      };
    }
  };

  // Submit new song
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!title.trim() || !hindiTitle.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter the song name in both English and Hindi.' });
      return;
    }

    if (!thumbnailFile) {
      setStatusMessage({ type: 'error', text: 'Please upload a thumbnail image.' });
      return;
    }

    if (!audioFile) {
      setStatusMessage({ type: 'error', text: 'Please upload an audio file.' });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload files
      const uploadData = new FormData();
      uploadData.append('thumbnail', thumbnailFile);
      uploadData.append('audio', audioFile);

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      const uploadResult = await uploadRes.json();
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'File upload failed');
      }

      // 2. Create song record
      const songRes = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          hindi_title: hindiTitle.trim(),
          artist: artist.trim() || 'Moksha Devotional',
          deity_focus: deityFocus,
          raag: raag.trim(),
          tala: tala.trim(),
          description: description.trim(),
          thumbnail_url: uploadResult.thumbnailUrl,
          audio_url: uploadResult.audioUrl,
          duration_seconds: audioDuration || 180,
        }),
      });

      const songResult = await songRes.json();
      if (!songResult.success) {
        throw new Error(songResult.error || 'Failed to consecrate song');
      }

      // 3. Reset form
      setTitle('');
      setHindiTitle('');
      setRaag('');
      setTala('');
      setDescription('');
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setAudioFile(null);
      setAudioDuration(0);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
      if (audioInputRef.current) audioInputRef.current.value = '';

      setStatusMessage({
        type: 'success',
        text: `✦ "${songResult.song.title}" (${songResult.song.hindi_title}) has been published and is now live on the website!`,
      });

      // Refresh catalog
      fetchSongs();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'An error occurred while publishing the song.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete song
  const handleDeleteSong = async (id: string, songTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${songTitle}" from the sacred sanctuary?`)) return;

    try {
      const res = await fetch(`/api/songs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSongs((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      alert('Failed to delete song');
    }
  };

  // Auth Loading
  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[var(--gold-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="font-laila text-sm text-[var(--text-muted)]">Verifying Administrator Consecration...</p>
        </div>
      </div>
    );
  }

  // Access Control: Admin only
  if (!user || !isAdmin) {
    return (
      <div className="min-h-[75vh] w-full max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="glass-panel w-full rounded-3xl p-8 sm:p-12 border border-[var(--gold-border)] shadow-2xl flex flex-col items-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#381419] border border-[#58242A] flex items-center justify-center text-[#F87171] shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Admin Access Restricted
            </h1>
            <p className="font-laila text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
              This dashboard is accessible exclusively by designated Sanctuary Administrators.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#170C0E] border border-[var(--gold-border)]/40 text-xs text-[var(--text-muted)] max-w-md text-left space-y-2">
            <p className="font-semibold text-[var(--gold-primary)] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Admin Role Requirement:
            </p>
            <p>
              Admins are granted privileges directly in the database. Ensure your registered profile in the
              <code className="text-[var(--gold-primary)] bg-[var(--maroon-pill)] px-1.5 py-0.5 rounded mx-1">
                public.profiles
              </code>
              table has <code className="text-[var(--gold-primary)] bg-[var(--maroon-pill)] px-1.5 py-0.5 rounded">role = &apos;admin&apos;</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full border border-[var(--gold-border)] text-xs text-[var(--text-primary)] hover:bg-[var(--maroon-pill)] transition-all"
            >
              Return to Sanctuary
            </Link>
            {!user && (
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-full bg-[var(--gold-primary)] text-[#12090A] font-bold text-xs shadow-md shadow-[var(--gold-primary)]/20 hover:scale-105 active:scale-95 transition-all"
              >
                Sign In to Admin Account
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--gold-border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#381419] border border-[#58242A] mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
            <span className="text-[10px] font-bold tracking-wider text-[var(--gold-primary)] uppercase">
              SANCTUARY MASTER CONSOLE
            </span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
            Admin Song Management
          </h1>
          <p className="font-laila text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Upload new sacred audio recordings with English &amp; Hindi names, thumbnail artwork, and master audio.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-[var(--text-muted)]">Signed in as</span>
          <p className="text-xs font-bold text-[var(--gold-primary)]">
            {profile?.display_name || user?.email} (Admin)
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs text-center font-medium transition-all ${
            statusMessage.type === 'success'
              ? 'bg-[#1C2A1E] border-[#34D399]/40 text-[#34D399]'
              : 'bg-[#381419] border-[#A83244] text-[#F87171]'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Main Grid: Upload Form + Songs Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Upload Form (6 cols) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--gold-border)]">
            <Upload className="w-5 h-5 text-[var(--gold-primary)]" />
            <h2 className="font-cinzel text-lg font-bold text-[var(--text-primary)]">
              Consecrate New Song
            </h2>
          </div>

          <form onSubmit={handlePublish} className="space-y-4">
            {/* Song Name in English */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Song Name (English) <span className="text-[#F87171]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Govind Bolo Hari Gopal Bolo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--gold-border)] rounded-xl py-2.5 px-3.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)]"
              />
            </div>

            {/* Song Name in Hindi */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Song Name (Hindi / देवनागरी) <span className="text-[#F87171]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. गोविन्द बोलो हरि गोपाल बोलो"
                value={hindiTitle}
                onChange={(e) => setHindiTitle(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--gold-border)] rounded-xl py-2.5 px-3.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] font-devanagari"
              />
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Upload Thumbnail Artwork <span className="text-[#F87171]">*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={thumbnailInputRef}
                  required
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-[var(--gold-border)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] transition-all cursor-pointer text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <ImageIcon className="w-4 h-4 text-[var(--gold-primary)]" />
                  <span>{thumbnailFile ? thumbnailFile.name : 'Choose Image (JPG, PNG, WEBP)'}</span>
                </label>

                {thumbnailPreview && (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[var(--gold-border)] shrink-0">
                    <Image src={thumbnailPreview} alt="Preview" fill unoptimized className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Upload Audio File (.mp3, .wav, .aac, .m4a) <span className="text-[#F87171]">*</span>
              </label>
              <input
                type="file"
                ref={audioInputRef}
                required
                accept="audio/*"
                onChange={handleAudioChange}
                className="hidden"
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-[var(--gold-border)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] transition-all cursor-pointer text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <FileAudio className="w-4 h-4 text-[var(--gold-primary)]" />
                <span className="truncate">
                  {audioFile
                    ? `${audioFile.name} (${(audioFile.size / (1024 * 1024)).toFixed(1)} MB)`
                    : 'Choose Sacred Audio Track'}
                </span>
              </label>
            </div>

            {/* Extra Metadata (Artist, Deity Focus, Raag) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Artist / Singer / गायक
                </label>
                <input
                  type="text"
                  placeholder="Moksha Devotional"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Deity / Lineage
                </label>
                <select
                  value={deityFocus}
                  onChange={(e) => setDeityFocus(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] cursor-pointer"
                >
                  <option value="Krishna">Shri Krishna</option>
                  <option value="Shiva">Mahadeva Shiva</option>
                  <option value="Ram">Shri Ram</option>
                  <option value="Devi">Durga &amp; Devi</option>
                  <option value="Hanuman">Mahavira Hanuman</option>
                  <option value="Ganesh">Shri Ganesh</option>
                  <option value="Mantra">Vedic Mantra</option>
                  <option value="Meditation">Meditation &amp; 432Hz</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 rounded-full bg-[var(--gold-primary)] hover:opacity-90 text-[#12090A] font-bold text-xs shadow-xl shadow-[var(--gold-primary)]/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Uploading & Consecrating...' : 'Publish Consecrated Song'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Live Catalog Table (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-border)]">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[var(--gold-primary)]" />
              <h2 className="font-cinzel text-lg font-bold text-[var(--text-primary)]">
                Live Sanctuary Tracks ({songs.length})
              </h2>
            </div>
          </div>

          {isLoadingSongs ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              Loading consecrated songs...
            </div>
          ) : songs.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 border border-[var(--gold-border)] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[var(--maroon-pill)] mx-auto flex items-center justify-center text-[var(--gold-primary)]">
                <Music className="w-6 h-6 opacity-60" />
              </div>
              <h3 className="font-laila text-base font-semibold text-[var(--text-primary)]">
                No Songs Consecrated Yet
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Use the form on the left to enter song names in English and Hindi, upload artwork and master audio, and publish them to the sanctuary.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {songs.map((song) => {
                const isThisPlaying = isPlaying && currentSong?.id === song.id;
                return (
                  <div
                    key={song.id}
                    className="glass-panel rounded-2xl p-3 border border-[var(--gold-border)] hover:border-[var(--gold-primary)] transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[var(--maroon-pill)] shrink-0 border border-[var(--gold-border)]">
                        <Image
                          src={song.thumbnail_url || '/logo.png'}
                          alt={song.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--gold-primary)] transition-colors">
                          {song.title}
                        </h4>
                        <p className="text-[11px] text-[var(--gold-primary)] font-devanagari truncate">
                          {song.hindi_title}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">
                          {song.artist} • {song.deity_focus || 'Sanctuary'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Play Preview */}
                      <button
                        onClick={() => play(song, songs)}
                        className="w-8 h-8 rounded-full bg-[var(--maroon-pill)] hover:bg-[var(--gold-primary)] text-[var(--gold-primary)] hover:text-[#12090A] flex items-center justify-center transition-all cursor-pointer"
                        title={isThisPlaying ? 'Playing' : 'Listen'}
                      >
                        {isThisPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteSong(song.id, song.title)}
                        className="w-8 h-8 rounded-full bg-[var(--maroon-pill)] hover:bg-[#381419] text-[var(--text-muted)] hover:text-[#F87171] flex items-center justify-center transition-all cursor-pointer"
                        title="Delete Song"
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
      </div>
    </div>
  );
}
