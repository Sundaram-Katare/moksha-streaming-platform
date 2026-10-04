'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Heart, Flame, Sparkles, ArrowRight } from 'lucide-react';
import { usePlayer } from '@/features/player/PlayerContext';
import { Song } from '@/types';

interface PersonalizedResonanceProps {
  songs: Song[];
}

export function PersonalizedResonance({ songs }: PersonalizedResonanceProps) {
  const { play, currentSong, isPlaying } = usePlayer();

  const featuredForYou = [
    {
      song: songs[1] || songs[0], // Shiva Tandava Stotram
      badges: ['Morning Sadhana', 'Raag Bhairav'],
      duration: '18:42',
      customTitle: 'Shiva Tandava Stotram • शिव ताण्डव स्तोत्रम्',
      subtitle: 'Pt. Jasraj & Vedic Sound Choir • Consecrated 432Hz',
    },
    {
      song: songs[2] || songs[0], // Achyutashtakam
      badges: ['Devotional Transcendence', 'Raag Yaman'],
      duration: '14:10',
      customTitle: 'Achyutashtakam (Deep Night Chant) • अच्युता...',
      subtitle: 'Sadhana Sargam & Flute Maestro Pravin Godkhindi',
    },
    {
      song: songs[3] || songs[0], // Lalita Sahasranama
      badges: ['Tantric Mantra', 'Raag Hansadhwani'],
      duration: '32:05',
      customTitle: 'Lalita Sahasranama Stotram • ललिता सहस्रनाम',
      subtitle: 'Sri Kanchi Kamakoti Peetham Scholars',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Featured For You (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          {/* Section Header */}
          <div className="flex items-end justify-between pb-1 border-b border-[#E5C378]/15">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#E5C378] uppercase block mb-0.5">
                PERSONALIZED RESONANCE
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F8F5EE]">
                Featured For You
              </h2>
            </div>
            <Link
              href="/explore"
              className="text-xs font-semibold text-[#E5C378] hover:text-[#F7D78A] flex items-center gap-1 transition-colors group"
            >
              <span>View Complete Darshan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* List of 3 Featured Items */}
          <div className="space-y-3 pt-1">
            {featuredForYou.map((item, idx) => {
              const isItemPlaying = isPlaying && currentSong?.id === item.song.id;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#170D0E]/90 hover:bg-[#231215] border border-[#E5C378]/15 hover:border-[#E5C378]/35 transition-all shadow-md group cursor-pointer"
                  onClick={() => play(item.song, songs)}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#E5C378]/20 bg-[#120809]">
                      <Image
                        src={item.song.thumbnail_url}
                        alt={item.song.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="min-w-0 space-y-1">
                      {/* Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.badges.map((b, bi) => (
                          <span
                            key={bi}
                            className={`px-2 py-0.2 rounded text-[9px] font-medium tracking-tight ${
                              bi === 0
                                ? 'bg-[#381419] text-[#F87171] border border-[#58242A]'
                                : 'bg-[#221410] text-[#E5C378] border border-[#482818]'
                            }`}
                          >
                            {b}
                          </span>
                        ))}
                      </div>

                      <h4 className="text-xs sm:text-sm font-semibold text-[#F8F5EE] group-hover:text-[#E5C378] truncate transition-colors">
                        {item.customTitle}
                      </h4>
                      <p className="text-[11px] text-[#A89A8A] truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Duration, Heart, Play */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                    <span className="text-[11px] font-mono text-[#8E8275] hidden sm:inline">
                      {item.duration}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1.5 rounded-full text-[#8E8275] hover:text-[#F87171] hover:bg-[#2A1417] transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-[#E5C378] text-[#12090A] flex items-center justify-center shadow-md shadow-[#E5C378]/25 group-hover:scale-110 active:scale-95 transition-transform">
                      {isItemPlaying ? (
                        <span className="w-2.5 h-2.5 bg-[#12090A]" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-[#12090A] ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Continue Listening (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          {/* Section Header */}
          <div className="flex items-end justify-between pb-1 border-b border-[#E5C378]/15">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#E5C378] uppercase block mb-0.5">
                UNBROKEN JAPA &amp; SADHANA
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F8F5EE]">
                Continue Listening
              </h2>
            </div>
            <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#201013] border border-[#E5C378]/20 text-[#E5C378] uppercase">
              2 ACTIVE IN PROGRESS
            </span>
          </div>

          {/* Cards */}
          <div className="space-y-3 pt-1">
            {/* Card 1: Madhurashtakam */}
            <div
              className="p-3.5 rounded-2xl bg-[#170D0E]/90 hover:bg-[#231215] border border-[#E5C378]/15 hover:border-[#E5C378]/35 transition-all shadow-md group cursor-pointer"
              onClick={() => play(songs[4] || songs[0], songs)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#3D141A] border border-[#58242A] flex items-center justify-center text-[#E5C378] shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#F8F5EE] group-hover:text-[#E5C378] transition-colors truncate">
                      Madhurashtakam • मधुराष्टकम्
                    </h4>
                    <p className="text-[11px] text-[#A89A8A] truncate">
                      Sadhana Recitation • 108 Repetitions
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#E5C378] text-[#12090A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-[#12090A] ml-0.5" />
                </div>
              </div>

              {/* Progress */}
              <div className="mt-3 pt-2 border-t border-[#E5C378]/10 flex items-center justify-between text-[11px] text-[#A89A8A]">
                <span>Completed 70 of 108 cycles</span>
                <span className="font-semibold text-[#E5C378]">65% Progress</span>
              </div>
              <div className="mt-1.5 w-full h-1 bg-[#281316] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#C49746] to-[#E5C378] w-[65%]" />
              </div>
            </div>

            {/* Card 2: Maha Mrityunjaya */}
            <div
              className="p-3.5 rounded-2xl bg-[#170D0E]/90 hover:bg-[#231215] border border-[#E5C378]/15 hover:border-[#E5C378]/35 transition-all shadow-md group cursor-pointer"
              onClick={() => play(songs[5] || songs[0], songs)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#2A160E] border border-[#4A2616] flex items-center justify-center text-[#F59E0B] shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#F8F5EE] group-hover:text-[#E5C378] transition-colors truncate">
                      Maha Mrityunjaya Mantra (Pradosh)
                    </h4>
                    <p className="text-[11px] text-[#A89A8A] truncate">
                      Rigvedic Accented Chant • Pt. Rattan Mohan Sharma
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#E5C378] text-[#12090A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-[#12090A] ml-0.5" />
                </div>
              </div>

              {/* Progress */}
              <div className="mt-3 pt-2 border-t border-[#E5C378]/10 flex items-center justify-between text-[11px] text-[#A89A8A]">
                <span>11 of 54 minutes remaining</span>
                <span className="font-semibold text-[#E5C378]">22% Progress</span>
              </div>
              <div className="mt-1.5 w-full h-1 bg-[#281316] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#C49746] to-[#E5C378] w-[22%]" />
              </div>
            </div>

            {/* Streak Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#2A1116] to-[#1A0A0D] border border-[#58242A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-[#E5C378]" />
                <div className="text-[11px]">
                  <span className="font-bold text-[#E5C378] block">
                    CONSECRATED MEDITATION STREAK
                  </span>
                  <span className="text-[#C5BAAD]">
                    19 Consecutive Days • 38.4 Hours Listened
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#3D141A] border border-[#E5C378]/30 text-[10px] font-bold text-[#E5C378]">
                Devotee Tier I
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
