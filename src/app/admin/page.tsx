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
  FolderPlus,
  Tag,
  Plus,
  Layers,
  Video,
  FileText,
  BookOpen,
  Edit3,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Song } from '@/types';
import { usePlayer } from '@/features/player/PlayerContext';
import { CategoryItem } from '@/lib/storage';

export default function AdminPage() {
  const { user, profile, isAdmin, isLoading: isAuthLoading } = useAuth();
  const { play, currentSong, isPlaying } = usePlayer();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'upload' | 'lyrics' | 'categories'>('upload');

  // Song Upload State
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const [title, setTitle] = useState('');
  const [hindiTitle, setHindiTitle] = useState('');
  const [artist, setArtist] = useState('Moksha Devotional');
  const [deityFocus, setDeityFocus] = useState('Krishna');
  const [raag, setRaag] = useState('');
  const [tala, setTala] = useState('');
  const [description, setDescription] = useState('');

  // Upload Form Lyrics State
  const [uploadLyricsHi, setUploadLyricsHi] = useState('');
  const [uploadLyricsEn, setUploadLyricsEn] = useState('');
  const [uploadLyricsHinglish, setUploadLyricsHinglish] = useState('');
  const [uploadLyricsTab, setUploadLyricsTab] = useState<'hi' | 'en' | 'hinglish'>('hi');

  // Dedicated Lyrics Management State
  const [lyricsSongId, setLyricsSongId] = useState('');
  const [lyricsHi, setLyricsHi] = useState('');
  const [lyricsEn, setLyricsEn] = useState('');
  const [lyricsHinglish, setLyricsHinglish] = useState('');
  const [activeLyricsTab, setActiveLyricsTab] = useState<'hi' | 'en' | 'hinglish'>('hi');
  const [isSavingLyrics, setIsSavingLyrics] = useState(false);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  // Category Management State
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatHindiName, setNewCatHindiName] = useState('');
  const [newCatTagline, setNewCatTagline] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Item Assignment State
  const [selectedCatId, setSelectedCatId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [availableItems, setAvailableItems] = useState<{ id: string; title: string; type: 'Spotify Track' | 'YouTube Video' | 'Uploaded Song' }[]>([]);

  // Fetch all songs & categories
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

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        if (data.categories.length > 0 && !selectedCatId) {
          setSelectedCatId(data.categories[0].id);
        }
      }
    } catch {
      // Failed to load categories
    }
  };

  const fetchAvailableItems = async () => {
    try {
      const [spotifyRes, ytRes, songsRes] = await Promise.all([
        fetch('/api/spotify/tracks', { cache: 'no-store' }),
        fetch('/api/youtube/videos', { cache: 'no-store' }),
        fetch('/api/songs', { cache: 'no-store' }),
      ]);

      const spotifyData = await spotifyRes.json();
      const ytData = await ytRes.json();
      const songsData = await songsRes.json();

      const items: { id: string; title: string; type: 'Spotify Track' | 'YouTube Video' | 'Uploaded Song' }[] = [];

      if (spotifyData.success && Array.isArray(spotifyData.tracks)) {
        spotifyData.tracks.forEach((t: any) => {
          items.push({ id: t.id, title: `${t.title} (${t.artist})`, type: 'Spotify Track' });
        });
      }

      if (ytData.success && Array.isArray(ytData.videos)) {
        ytData.videos.forEach((v: any) => {
          items.push({ id: v.id, title: v.title, type: 'YouTube Video' });
        });
      }

      if (songsData.success && Array.isArray(songsData.songs)) {
        songsData.songs.forEach((s: any) => {
          items.push({ id: s.id, title: s.title, type: 'Uploaded Song' });
        });
      }

      setAvailableItems(items);
      if (items.length > 0 && !selectedItemId) {
        setSelectedItemId(items[0].id);
      }
    } catch {
      // Failed to fetch available items
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchCategories();
    fetchAvailableItems();
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

      const lyricsPayload: { language: string; lyrics: string }[] = [];
      if (uploadLyricsHi.trim()) lyricsPayload.push({ language: 'hi', lyrics: uploadLyricsHi.trim() });
      if (uploadLyricsEn.trim()) lyricsPayload.push({ language: 'en', lyrics: uploadLyricsEn.trim() });
      if (uploadLyricsHinglish.trim()) lyricsPayload.push({ language: 'hinglish', lyrics: uploadLyricsHinglish.trim() });

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
          lyrics: lyricsPayload,
        }),
      });

      const songResult = await songRes.json();
      if (!songResult.success) {
        throw new Error(songResult.error || 'Failed to consecrate song');
      }

      setTitle('');
      setHindiTitle('');
      setRaag('');
      setTala('');
      setDescription('');
      setUploadLyricsHi('');
      setUploadLyricsEn('');
      setUploadLyricsHinglish('');
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

      fetchSongs();
      fetchAvailableItems();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'An error occurred while publishing the song.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Lyrics Editor for a specific song
  const openLyricsForSong = (song: Song) => {
    setLyricsSongId(song.id);
    const hi = song.lyrics?.find((l) => l.language === 'hi')?.lyrics || '';
    const en = song.lyrics?.find((l) => l.language === 'en')?.lyrics || '';
    const hinglish = song.lyrics?.find((l) => l.language === 'hinglish')?.lyrics || '';
    setLyricsHi(hi);
    setLyricsEn(en);
    setLyricsHinglish(hinglish);
    setActiveTab('lyrics');
  };

  // Save updated lyrics for song
  const handleSaveLyrics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lyricsSongId) {
      alert('Please select a song first.');
      return;
    }

    setIsSavingLyrics(true);
    try {
      const lyricsPayload: { language: string; lyrics: string }[] = [];
      if (lyricsHi.trim()) lyricsPayload.push({ language: 'hi', lyrics: lyricsHi.trim() });
      if (lyricsEn.trim()) lyricsPayload.push({ language: 'en', lyrics: lyricsEn.trim() });
      if (lyricsHinglish.trim()) lyricsPayload.push({ language: 'hinglish', lyrics: lyricsHinglish.trim() });

      const res = await fetch(`/api/songs/${lyricsSongId}/lyrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: lyricsPayload }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: `✦ Sacred lyrics for "${data.song?.title || 'Selected Track'}" have been saved and will appear when played!`,
        });
        fetchSongs();
      } else {
        alert(data.error || 'Failed to save lyrics');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving lyrics');
    } finally {
      setIsSavingLyrics(false);
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

  // Create New Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsCreatingCategory(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName.trim(),
          hindi_name: newCatHindiName.trim() || newCatName.trim(),
          tagline: newCatTagline.trim() || 'BHAKTI & SHANTI',
          description: newCatDesc.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewCatName('');
        setNewCatHindiName('');
        setNewCatTagline('');
        setNewCatDesc('');
        setStatusMessage({
          type: 'success',
          text: `✦ Category "${data.category.name}" created successfully!`,
        });
        fetchCategories();
      } else {
        alert(data.error || 'Failed to create category');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating category');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Assign track/video to Category
  const handleAssignItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId || !selectedItemId) return;

    try {
      const res = await fetch('/api/categories/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedCatId,
          itemId: selectedItemId,
          action: 'add',
        }),
      });

      const data = await res.json();
      if (data.success) {
        const itemObj = availableItems.find((i) => i.id === selectedItemId);
        setStatusMessage({
          type: 'success',
          text: `✦ Assigned "${itemObj?.title || selectedItemId}" to category!`,
        });
        fetchCategories();
      }
    } catch {
      alert('Failed to assign item to category');
    }
  };

  // Unassign track from category
  const handleUnassignItem = async (catId: string, itemId: string) => {
    try {
      const res = await fetch('/api/categories/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: catId,
          itemId,
          action: 'remove',
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchCategories();
      }
    } catch {
      alert('Failed to remove item from category');
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
        <div className="glass-panel w-full rounded-3xl p-8 sm:p-12 border border-[var(--gold-border)] shadow-2xl flex flex-col items-center space-y-6 bg-[var(--bg-card)]">
          <div className="w-16 h-16 rounded-full bg-[#FEE2E2] border border-[#FCA5A5] flex items-center justify-center text-[#DC2626] shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-laila text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Admin Access Restricted
            </h1>
            <p className="font-laila text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
              This dashboard is accessible exclusively by designated Sanctuary Administrators.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--gold-border)] text-xs text-[var(--text-muted)] max-w-md text-left space-y-2">
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
                className="px-6 py-2.5 rounded-full bronze-pill text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--gold-border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bronze-pill text-white mb-2 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              SANCTUARY MASTER CONSOLE
            </span>
          </div>
          <h1 className="font-laila text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
            Admin Management Console
          </h1>
          <p className="font-laila text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Upload new sacred tracks, manage categories, and assign Spotify tracks or YouTube videos to categories.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-[var(--text-muted)]">Signed in as</span>
          <p className="text-xs font-bold text-[var(--gold-primary)]">
            {profile?.display_name || user?.email} (Admin)
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-[var(--gold-border)] pb-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bronze-pill text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--maroon-pill)]'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Sacred Song</span>
        </button>

        <button
          onClick={() => setActiveTab('lyrics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'lyrics'
              ? 'bronze-pill text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--maroon-pill)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Manage Song Lyrics / भजन के बोल</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bronze-pill text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--maroon-pill)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Category Management &amp; Assignments</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs text-center font-medium transition-all ${
            statusMessage.type === 'success'
              ? 'bg-[#E8F5E9] border-[#4CAF50]/40 text-[#2E7D32]'
              : 'bg-[#FFEBEE] border-[#EF5350] text-[#C62828]'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* TAB 1: UPLOAD SACRED SONG */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Form (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-xl space-y-6 bg-[var(--bg-card)]">
            <div className="flex items-center gap-3 pb-3 border-b border-[var(--gold-border)]">
              <Upload className="w-5 h-5 text-[var(--gold-primary)]" />
              <h2 className="font-laila text-lg font-bold text-[var(--text-primary)]">
                Consecrate New Song
              </h2>
            </div>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Song Name (English) <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Govind Bolo Hari Gopal Bolo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2.5 px-3.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Song Name (Hindi / देवनागरी) <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. गोविन्द बोलो हरि गोपाल बोलो"
                  value={hindiTitle}
                  onChange={(e) => setHindiTitle(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2.5 px-3.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] font-devanagari"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Upload Thumbnail Artwork <span className="text-[#DC2626]">*</span>
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
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-[var(--gold-border)] bg-[var(--bg-surface)] hover:border-[var(--gold-primary)] transition-all cursor-pointer text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Upload Audio File (.mp3, .wav, .aac, .m4a) <span className="text-[#DC2626]">*</span>
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
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-[var(--gold-border)] bg-[var(--bg-surface)] hover:border-[var(--gold-primary)] transition-all cursor-pointer text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <FileAudio className="w-4 h-4 text-[var(--gold-primary)]" />
                  <span className="truncate">
                    {audioFile
                      ? `${audioFile.name} (${(audioFile.size / (1024 * 1024)).toFixed(1)} MB)`
                      : 'Choose Sacred Audio Track'}
                  </span>
                </label>
              </div>

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
                    className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                    Deity Focus
                  </label>
                  <select
                    value={deityFocus}
                    onChange={(e) => setDeityFocus(e.target.value)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] cursor-pointer"
                  >
                    <option value="Krishna">Shri Krishna</option>
                    <option value="Ganesh">Shri Ganesh</option>
                    <option value="Shiva">Mahadeva Shiva</option>
                    <option value="Ram">Shri Ram</option>
                    <option value="Devi">Durga &amp; Devi</option>
                    <option value="Hanuman">Mahavira Hanuman</option>
                  </select>
                </div>
              </div>

              {/* Sacred Song Lyrics Input Editor */}
              <div className="pt-2 border-t border-[var(--gold-border)]/60 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-[11px] font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                    <span>Sacred Lyrics / भजन के बोल (Optional)</span>
                  </label>

                  {/* Language Tabs for Upload Lyrics */}
                  <div className="flex items-center gap-1 bg-[var(--maroon-pill)] p-0.5 rounded-full border border-[var(--gold-border)] self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setUploadLyricsTab('hi')}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        uploadLyricsTab === 'hi'
                          ? 'bronze-pill text-white shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      हिंदी (Devanagari)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadLyricsTab('en')}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        uploadLyricsTab === 'en'
                          ? 'bronze-pill text-white shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadLyricsTab('hinglish')}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        uploadLyricsTab === 'hinglish'
                          ? 'bronze-pill text-white shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Hinglish
                    </button>
                  </div>
                </div>

                {uploadLyricsTab === 'hi' && (
                  <textarea
                    rows={4}
                    value={uploadLyricsHi}
                    onChange={(e) => setUploadLyricsHi(e.target.value)}
                    placeholder="यहाँ भजन के हिंदी / देवनागरी बोल लिखें या पेस्ट करें (उदा: नमामीश्वरं सच्चिदानन्दरूपं...)"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] font-devanagari resize-y"
                  />
                )}

                {uploadLyricsTab === 'en' && (
                  <textarea
                    rows={4}
                    value={uploadLyricsEn}
                    onChange={(e) => setUploadLyricsEn(e.target.value)}
                    placeholder="Type or paste English lyrics or spiritual translation here..."
                    className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] resize-y"
                  />
                )}

                {uploadLyricsTab === 'hinglish' && (
                  <textarea
                    rows={4}
                    value={uploadLyricsHinglish}
                    onChange={(e) => setUploadLyricsHinglish(e.target.value)}
                    placeholder="Paste romanized Hinglish lyrics here (e.g. Govind bolo hari gopal bolo...)"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] resize-y"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bronze-pill text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Consecrating Song...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Song to Sanctuary</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Consecrated Songs Catalog (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-xl space-y-6 bg-[var(--bg-card)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-border)]">
              <h2 className="font-laila text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Music className="w-5 h-5 text-[var(--gold-primary)]" />
                <span>Uploaded Sanctuary Songs</span>
              </h2>
              <span className="text-xs text-[var(--text-muted)] font-semibold">
                {songs.length} Tracks
              </span>
            </div>

            {isLoadingSongs ? (
              <div className="py-12 flex justify-center">
                <div className="w-6 h-6 border-2 border-[var(--gold-primary)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : songs.length === 0 ? (
              <div className="glass-panel rounded-3xl p-8 border border-[var(--gold-border)] text-center space-y-3 bg-[var(--bg-surface)]">
                <Music className="w-8 h-8 text-[var(--gold-primary)] opacity-50 mx-auto" />
                <h3 className="font-laila text-sm font-semibold text-[var(--text-primary)]">
                  No Songs Uploaded Yet
                </h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                  Use the form on the left to enter song names in English and Hindi, upload artwork and master audio, and publish them to the sanctuary.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {songs.map((song) => {
                  const isThisPlaying = isPlaying && currentSong?.id === song.id;
                  return (
                    <div
                      key={song.id}
                      className="glass-panel rounded-2xl p-3 border border-[var(--gold-border)] hover:border-[var(--gold-primary)] transition-all flex items-center justify-between gap-3 group bg-[var(--bg-surface)]"
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
                          <p className="text-[11px] text-[var(--gold-primary)] font-devanagari truncate font-medium">
                            {song.hindi_title}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] truncate">
                            {song.artist} • {song.deity_focus || 'Sanctuary'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openLyricsForSong(song)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--gold-border)] hover:border-[var(--gold-primary)] text-xs text-[var(--gold-primary)] hover:bg-[var(--maroon-pill)] transition-all cursor-pointer font-semibold shadow-sm"
                          title="Add or Edit Sacred Lyrics / भजन के बोल"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Lyrics</span>
                        </button>

                        <button
                          onClick={() => play(song, songs)}
                          className="w-8 h-8 rounded-full bronze-pill text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                          title={isThisPlaying ? 'Playing' : 'Listen'}
                        >
                          {isThisPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        </button>

                        <button
                          onClick={() => handleDeleteSong(song.id, song.title)}
                          className="w-8 h-8 rounded-full border border-[var(--gold-border)] hover:border-[#DC2626] text-[var(--text-muted)] hover:text-[#DC2626] hover:bg-[#FEE2E2] flex items-center justify-center transition-all cursor-pointer"
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
      )}

      {/* TAB 2: MANAGE SONG LYRICS (Devanagari, English, Hinglish) */}
      {activeTab === 'lyrics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Select Song & Editor */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-xl bg-[var(--bg-card)] space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--gold-border)]">
              <FileText className="w-5 h-5 text-[var(--gold-primary)]" />
              <div>
                <h2 className="font-laila text-lg font-bold text-[var(--text-primary)]">
                  Sacred Lyrics Management
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Add, format, or update lyrics in Hindi, English, and Hinglish. These will automatically appear whenever a user plays the song.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveLyrics} className="space-y-5">
              {/* Select Song Dropdown */}
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Select Sanctuary Track <span className="text-[#DC2626]">*</span>
                </label>
                <select
                  value={lyricsSongId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setLyricsSongId(id);
                    const s = songs.find((item) => item.id === id);
                    if (s) {
                      setLyricsHi(s.lyrics?.find((l) => l.language === 'hi')?.lyrics || '');
                      setLyricsEn(s.lyrics?.find((l) => l.language === 'en')?.lyrics || '');
                      setLyricsHinglish(s.lyrics?.find((l) => l.language === 'hinglish')?.lyrics || '');
                    }
                  }}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2.5 px-3.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] cursor-pointer"
                >
                  <option value="">-- Choose a Track to Edit Lyrics --</option>
                  {songs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} {s.hindi_title ? `(${s.hindi_title})` : ''} - {s.artist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Selection Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                    Lyrics Script / भाषा
                  </label>
                  <div className="flex items-center gap-1 bg-[var(--maroon-pill)] p-0.5 rounded-full border border-[var(--gold-border)]">
                    <button
                      type="button"
                      onClick={() => setActiveLyricsTab('hi')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeLyricsTab === 'hi'
                          ? 'bronze-pill text-white shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      हिंदी (Devanagari)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLyricsTab('en')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeLyricsTab === 'en'
                          ? 'bronze-pill text-white shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLyricsTab('hinglish')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeLyricsTab === 'hinglish'
                          ? 'bronze-pill text-white shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Hinglish
                    </button>
                  </div>
                </div>

                {/* Editor Textarea */}
                {activeLyricsTab === 'hi' && (
                  <div>
                    <textarea
                      rows={10}
                      value={lyricsHi}
                      onChange={(e) => setLyricsHi(e.target.value)}
                      placeholder="यहाँ भजन के सम्पूर्ण बोल हिंदी या संस्कृत देवनागरी में लिखें या पेस्ट करें...&#10;&#10;उदा:&#10;नमामीश्वरं सच्चिदानन्दरूपं&#10;लसत्कुण्डलं गोकुले भ्राजमानम्।&#10;यशोदाभियोलूखलाद्धावमानं&#10;परामृष्टमत्यन्ततो द्रुत्य गोप्या॥"
                      className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-2xl py-3 px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] font-devanagari leading-relaxed resize-y"
                    />
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">
                      Tip: Separate stanzas with a blank line for sacred formatting in the player.
                    </p>
                  </div>
                )}

                {activeLyricsTab === 'en' && (
                  <div>
                    <textarea
                      rows={10}
                      value={lyricsEn}
                      onChange={(e) => setLyricsEn(e.target.value)}
                      placeholder="Type or paste sacred verse translations, meaning, or English lyrics here...&#10;&#10;Example:&#10;To the Supreme Lord, whose form is pure consciousness and bliss,&#10;whose earrings dance upon His cheeks, who shines resplendent in Gokula..."
                      className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-2xl py-3 px-4 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] leading-relaxed resize-y"
                    />
                  </div>
                )}

                {activeLyricsTab === 'hinglish' && (
                  <div>
                    <textarea
                      rows={10}
                      value={lyricsHinglish}
                      onChange={(e) => setLyricsHinglish(e.target.value)}
                      placeholder="Type or paste phonetic romanized lyrics here...&#10;&#10;Example:&#10;Namamishvaram sach-chid-ananda-rupam&#10;lasat-kundalam gokule bhrajamanam&#10;yashoda-bhiyolukhalad dhavamanam..."
                      className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-2xl py-3 px-4 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] leading-relaxed resize-y"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSavingLyrics || !lyricsSongId}
                className="w-full py-3.5 rounded-full bronze-pill text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSavingLyrics ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Lyrics to Sanctuary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save Sacred Lyrics</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Live Player Preview of Lyrics */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-xl bg-[var(--bg-card)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-border)]">
              <h3 className="font-laila text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>Live Devotee Lyrics Preview</span>
              </h3>
              <span className="text-[10px] font-bold uppercase bronze-pill text-white px-2 py-0.5 rounded-full">
                {activeLyricsTab.toUpperCase()}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--gold-border)] min-h-[300px] max-h-[460px] overflow-y-auto">
              {(() => {
                const currentText =
                  activeLyricsTab === 'hi'
                    ? lyricsHi
                    : activeLyricsTab === 'en'
                    ? lyricsEn
                    : lyricsHinglish;

                if (!currentText.trim()) {
                  return (
                    <div className="py-16 text-center text-xs text-[var(--text-muted)] space-y-2">
                      <FileText className="w-8 h-8 opacity-40 mx-auto text-[var(--gold-primary)]" />
                      <p>Type or paste lyrics on the left to see the devotee live preview here.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4 font-devanagari text-sm leading-relaxed text-[var(--text-primary)]">
                    {currentText.split('\n\n').map((stanza, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[var(--maroon-pill)]/40 border border-[var(--gold-border)]/50"
                      >
                        <pre className="whitespace-pre-wrap font-inherit text-inherit">
                          {stanza}
                        </pre>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORY MANAGEMENT & ITEM ASSIGNMENTS */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Category + Quick Assign (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Create Category Form */}
            <div className="glass-panel rounded-3xl p-6 border border-[var(--gold-border)] shadow-xl bg-[var(--bg-card)] space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--gold-border)]">
                <FolderPlus className="w-5 h-5 text-[var(--gold-primary)]" />
                <h3 className="font-laila text-base font-bold text-[var(--text-primary)]">
                  Create New Category
                </h3>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                    Category Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shri Ram Bhajans, Morning Raga"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                    Category Name (Hindi / देवनागरी)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. श्री राम भजन एवं स्तुति"
                    value={newCatHindiName}
                    onChange={(e) => setNewCatHindiName(e.target.value)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] font-devanagari"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                    Tagline (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MARYADA & ANAND"
                    value={newCatTagline}
                    onChange={(e) => setNewCatTagline(e.target.value)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingCategory || !newCatName.trim()}
                  className="w-full py-2.5 rounded-full bronze-pill text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreatingCategory ? 'Creating...' : 'Create Category'}</span>
                </button>
              </form>
            </div>

            {/* Quick Assign Form */}
            <div className="glass-panel rounded-3xl p-6 border border-[var(--gold-border)] shadow-xl bg-[var(--bg-card)] space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--gold-border)]">
                <Tag className="w-5 h-5 text-[var(--gold-primary)]" />
                <h3 className="font-laila text-base font-bold text-[var(--text-primary)]">
                  Assign Track to Category
                </h3>
              </div>

              <form onSubmit={handleAssignItem} className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                    Select Target Category
                  </label>
                  <select
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(e.target.value)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.hindi_name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                    Select Song or Video to Assign
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] cursor-pointer"
                  >
                    {availableItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        [{item.type}] {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bronze-pill text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign to Category</span>
                </button>
              </form>
            </div>
          </div>

          {/* Existing Categories List with Assigned Tracks (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-xl bg-[var(--bg-card)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-border)]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[var(--gold-primary)]" />
                <h3 className="font-laila text-base font-bold text-[var(--text-primary)]">
                  Live Sanctuary Categories
                </h3>
              </div>
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                {categories.length} Categories
              </span>
            </div>

            <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl border border-[var(--gold-border)] bg-[var(--bg-surface)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[var(--gold-primary)] uppercase tracking-wider block">
                        {cat.tagline || 'CATEGORY'}
                      </span>
                      <h4 className="font-laila font-bold text-sm text-[var(--text-primary)]">
                        {cat.name}
                      </h4>
                      <p className="text-xs font-devanagari text-[var(--gold-primary)] font-semibold">
                        {cat.hindi_name}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--maroon-pill)] text-[var(--text-muted)]">
                      {cat.item_ids?.length || 0} Tracks Assigned
                    </span>
                  </div>

                  {/* Assigned tracks list inside this category */}
                  <div className="pt-2 border-t border-[var(--gold-border)]/40 space-y-1.5">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Assigned Tracks &amp; Videos:
                    </p>

                    {cat.item_ids && cat.item_ids.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {cat.item_ids.map((itemId) => {
                          const itemObj = availableItems.find((i) => i.id === itemId);
                          return (
                            <span
                              key={itemId}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--gold-border)]/60 text-[11px] text-[var(--text-secondary)]"
                            >
                              <span className="max-w-[160px] truncate">
                                {itemObj?.title || itemId}
                              </span>
                              <button
                                onClick={() => handleUnassignItem(cat.id, itemId)}
                                className="text-[var(--text-muted)] hover:text-[#DC2626] transition-colors cursor-pointer"
                                title="Remove from category"
                              >
                                &times;
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[11px] text-[var(--text-muted)] italic">
                        No songs explicitly assigned. System auto-matches by category keywords.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
