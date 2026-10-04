'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Heart, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { usePlayer } from '@/features/player/PlayerContext';
import { Song } from '@/types';

interface PopularAndFreshSectionProps {
  songs: Song[];
}

export function PopularAndFreshSection({ songs }: PopularAndFreshSectionProps) {
  const { play, currentSong, isPlaying } = usePlayer();

  const topSongs = [
    {
      rank: '01',
      song: songs[6] || songs[0], // Hanuman Chalisa
      title: 'Shree Hanuman Chalisa (Slow Meditative C...',
      artist: 'Hariharan • Raag Bageshree • Traditional Awadhi',
      playsToday: '1.2M Plays Today',
      duration: '09:44',
    },
    {
      rank: '02',
      song: songs[7] || songs[0], // Gayatri Mantra
      title: 'Gayatri Mantra (108 Chants in Brahma Muhu...',
      artist: 'Veda Scholars of Varanasi • Rigvedic Swaras',
      playsToday: '880k Plays Today',
      duration: '36:12',
    },
    {
      rank: '03',
      song: songs[8] || songs[0], // Karpura Gauram
      title: 'Karpura Gauram Karunavataram (Evening ...',
      artist: 'Anuradha Paudwal • Raag Darbari Kanada',
      playsToday: '740k Plays Today',
      duration: '07:18',
    },
    {
      rank: '04',
      song: songs[9] || songs[0], // Maha Ganga Aarti
      title: 'Maha Ganga Aarti (Live at Dashashwamedh...',
      artist: 'Kashi Archakas • Acoustic Binaural 3D Capture',
      playsToday: '620k Plays Today',
      duration: '15:50',
    },
    {
      rank: '05',
      song: songs[10] || songs[0], // Vishnu Sahasranamam
      title: 'Vishnu Sahasranamam (1000 Holy Names) •...',
      artist: 'M.S. Subbulakshmi Remastered Master Tapes',
      playsToday: '580k Plays Today',
      duration: '29:14',
    },
  ];

  const freshConsecrationSong = songs[11] || songs[0]; // Midnight Shiva Stuti

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Popular on Moksha (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-end justify-between pb-2 border-b border-[#E5C378]/15">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#E5C378] uppercase block mb-0.5">
                DAILY DEVOTEE STREAM METRICS
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F8F5EE]">
                Popular On Moksha (Top Today)
              </h2>
            </div>
            <span className="text-[10px] font-semibold text-[#E5C378] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#201013] border border-[#E5C378]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Real-time Ashram Feed</span>
            </span>
          </div>

          {/* List of Ranked Songs */}
          <div className="space-y-2 pt-1">
            {topSongs.map((item, idx) => {
              const isItemPlaying = isPlaying && currentSong?.id === item.song.id;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#170D0E]/80 hover:bg-[#231215] border border-[#E5C378]/10 hover:border-[#E5C378]/30 transition-all group cursor-pointer"
                  onClick={() => play(item.song, songs)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-cinzel text-sm font-bold text-[#A89A8A] w-6 text-center shrink-0">
                      {item.rank}
                    </span>

                    <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-[#E5C378]/15 bg-[#120809]">
                      <Image
                        src={item.song.thumbnail_url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-semibold text-[#F8F5EE] group-hover:text-[#E5C378] truncate transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#A89A8A] truncate">
                        {item.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                    {/* Plays Today Badge */}
                    <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-[#381419] border border-[#58242A] text-[9px] font-bold text-[#F87171] tracking-tight">
                      {item.playsToday}
                    </span>

                    <span className="text-[11px] font-mono text-[#8E8275]">
                      {item.duration}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1 rounded-full text-[#8E8275] hover:text-[#F87171] hover:bg-[#2A1417] transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-7 h-7 rounded-full bg-[#1F1013] group-hover:bg-[#E5C378] text-[#E5C378] group-hover:text-[#12090A] flex items-center justify-center transition-all border border-[#E5C378]/30 group-hover:border-transparent">
                      {isItemPlaying ? (
                        <span className="w-2 h-2 bg-current" />
                      ) : (
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Fresh Consecrations Master Tape Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex items-end justify-between pb-2 border-b border-[#E5C378]/15">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#E5C378] uppercase block mb-0.5">
                NEW ARCHIVE RELEASE
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F8F5EE]">
                Fresh Consecrations
              </h2>
            </div>
            <button className="text-[#A89A8A] hover:text-[#E5C378] p-1 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Master Tape #419 Feature Card */}
          <div className="glass-panel rounded-3xl p-5 border border-[#E5C378]/25 shadow-2xl space-y-4 group">
            {/* Artwork with Master Tape badge */}
            <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden border border-[#E5C378]/20 bg-[#120809]">
              <Image
                src={freshConsecrationSong.thumbnail_url || '/logo.png'}
                alt={freshConsecrationSong.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120809] via-transparent to-transparent" />

              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/70 border border-[#E5C378]/30 text-[9px] font-mono font-bold text-[#E5C378]">
                MASTER TAPE #419
              </div>

              {/* Title inside card bottom */}
              <div className="absolute bottom-3 left-4 right-16">
                <span className="text-[9px] font-bold tracking-widest text-[#E5C378] uppercase block">
                  RAAG MALKAUNS
                </span>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#F8F5EE] leading-tight">
                  Midnight Shiva Stuti
                </h3>
              </div>

              {/* Play button */}
              <button
                onClick={() => play(freshConsecrationSong, songs)}
                className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#E5C378] hover:bg-[#F7D78A] text-[#12090A] flex items-center justify-center shadow-lg shadow-[#E5C378]/30 transition-transform hover:scale-110 active:scale-95"
              >
                <Play className="w-4 h-4 fill-[#12090A] ml-0.5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-[#C5BAAD] leading-relaxed">
              Recorded in total darkness during the Pradosham night in Chidambaram Nataraja Temple, using dual Neumann vintage ribbon microphones directly to analog 2-inch tape.
            </p>

            {/* Audio notes & format */}
            <div className="pt-2 border-t border-[#E5C378]/15 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-[#E5C378] font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Native DSD 5.6MHz</span>
              </div>

              <Link
                href={`/song/${freshConsecrationSong.slug}`}
                className="text-xs font-semibold text-[#E5C378] hover:text-[#FFF6DD] flex items-center gap-1 group/link"
              >
                <span>READ ACOUSTIC NOTES</span>
                <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
