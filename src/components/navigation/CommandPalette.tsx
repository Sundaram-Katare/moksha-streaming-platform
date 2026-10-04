'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Music, Play, Sparkles } from 'lucide-react';
import { mockCategories } from '@/lib/mockData';
import { Song } from '@/types';
import { usePlayer } from '@/features/player/PlayerContext';

export function CommandPalette() {
  const router = useRouter();
  const { play } = usePlayer();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/songs', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSongs(data.songs);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredSongs = query.trim()
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.hindi_title?.toLowerCase().includes(query.toLowerCase()) ||
          s.artist.toLowerCase().includes(query.toLowerCase()) ||
          s.raag?.toLowerCase().includes(query.toLowerCase()) ||
          s.deity_focus?.toLowerCase().includes(query.toLowerCase())
      )
    : songs.slice(0, 5);

  const filteredCategories = query.trim()
    ? mockCategories.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.hindi_name?.toLowerCase().includes(query.toLowerCase()) ||
          c.tagline?.toLowerCase().includes(query.toLowerCase())
      )
    : mockCategories.slice(0, 4);

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl glass-panel rounded-3xl p-5 shadow-2xl border border-[#E5C378]/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#E5C378]/15">
          <Search className="w-5 h-5 text-[#E5C378]" />
          <input
            type="text"
            autoFocus
            placeholder="Search stotrams, ragas, deities (Krishna, Shiva)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#F8F5EE] placeholder-[#8E8275] text-sm focus:outline-none font-medium"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full text-[#8E8275] hover:text-[#F8F5EE] hover:bg-[#201114] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="py-4 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Songs Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A89A8A] px-2 block">
              SACRED RECORDINGS
            </span>

            {filteredSongs.length === 0 ? (
              <p className="text-xs text-[#8E8275] px-2 py-1">No matching recordings found.</p>
            ) : (
              <div className="space-y-1">
                {filteredSongs.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => {
                      play(song, songs);
                      setIsOpen(false);
                      router.push(`/song/${song.slug}`);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#261418] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#1E0D10] shrink-0 border border-[#E5C378]/20">
                        <Image
                          src={song.thumbnail_url || '/logo.png'}
                          alt={song.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-[#F8F5EE] group-hover:text-[#E5C378] truncate transition-colors">
                          {song.title}
                        </h4>
                        <p className="text-[11px] text-[#A89A8A] truncate">
                          {song.hindi_title ? `${song.hindi_title} • ` : ''}
                          {song.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#E5C378] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                        Play &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deity Categories */}
          <div className="space-y-2 pt-2 border-t border-[#E5C378]/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A89A8A] px-2 block">
              DEITY LINEAGES
            </span>
            <div className="grid grid-cols-2 gap-2">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/category/${cat.slug}`);
                  }}
                  className="p-3 rounded-2xl bg-[#1C0E10] border border-[#E5C378]/15 hover:border-[#E5C378] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F8F5EE] group-hover:text-[#E5C378] transition-colors">
                      {cat.name}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#E5C378] opacity-60" />
                  </div>
                  <p className="text-[10px] text-[#8E8275] pt-0.5 truncate">{cat.hindi_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="pt-3 border-t border-[#E5C378]/15 flex items-center justify-between text-[11px] text-[#8E8275]">
          <span>Press ESC to close</span>
          <span>Moksha Sacred Search</span>
        </div>
      </div>
    </div>
  );
}
