'use client';

import React from 'react';
import { Sparkles, Radio, Music, Shield } from 'lucide-react';
import { mockListeningStats } from '@/lib/mockData';

export function LiveDevoteeSyncSection() {
  const stats = mockListeningStats;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E5C378]/25 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#381419] border border-[#58242A]">
            <span className="w-2 h-2 rounded-full bg-[#E5C378] animate-ping" />
            <span className="text-[10px] font-bold tracking-wider text-[#E5C378] uppercase">
              GLOBAL SADHANA SANGHA • LIVE FEED
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black text-[#F8F5EE] tracking-tight">
              {stats.activeDevoteesCount.toLocaleString()}+ Souls
            </h2>
            <p className="font-cinzel italic text-base sm:text-lg text-[#E5C378] leading-relaxed">
              &ldquo;Music that dissolves the ego and brings the mind straight to the eternal lotus feet.&rdquo;
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#C5BAAD] leading-relaxed max-w-xl">
            Every second, devotees across Haridwar, London, San Francisco, Rishikesh, and Singapore converge in synchronous listening to cultivate collective peace and sacred resonance.
          </p>

          {/* Ecosystem Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A89A8A]">
              ECOSYSTEM MASTERS:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1A0D0E] border border-[#E5C378]/20 text-[11px] text-[#C5BAAD] font-medium flex items-center gap-1.5">
                <span></span>
                <span>Apple Lossless Spatial</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1A0D0E] border border-[#E5C378]/20 text-[11px] text-[#C5BAAD] font-medium flex items-center gap-1.5">
                <span>≈</span>
                <span>Spotify HiFi Audio</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1A0D0E] border border-[#E5C378]/20 text-[11px] text-[#C5BAAD] font-medium flex items-center gap-1.5">
                <span>▶</span>
                <span>YouTube Music Master</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Brahma Muhurta Synchrony Concentric Rings (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center bg-[#13090A]/90 p-6 rounded-2xl border border-[#E5C378]/20 shadow-inner">
          <div className="w-full flex items-center justify-between pb-3 border-b border-[#E5C378]/15 mb-4">
            <div>
              <span className="text-[9px] font-bold tracking-widest text-[#A89A8A] uppercase block">
                ACTIVE SACRED ZONES
              </span>
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#E5C378]">
                {stats.currentMuhurta}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#381419] border border-[#58242A] text-[9px] font-mono font-bold text-[#F87171]">
              {stats.timezone}
            </span>
          </div>

          {/* Concentric Circular Rings */}
          <div className="relative w-48 h-48 my-2 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              {/* Outer Ring: Vedic Chants (48%) */}
              <circle
                cx="96"
                cy="96"
                r="74"
                fill="none"
                stroke="#2A1417"
                strokeWidth="7"
              />
              <circle
                cx="96"
                cy="96"
                r="74"
                fill="none"
                stroke="#E5C378"
                strokeWidth="7"
                strokeDasharray="465"
                strokeDashoffset={465 - (465 * stats.vedicChantsPercentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />

              {/* Middle Ring: Meditative Raga (34%) */}
              <circle
                cx="96"
                cy="96"
                r="56"
                fill="none"
                stroke="#2A1417"
                strokeWidth="7"
              />
              <circle
                cx="96"
                cy="96"
                r="56"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="7"
                strokeDasharray="351"
                strokeDashoffset={351 - (351 * stats.meditativeRagaPercentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />

              {/* Inner Ring: Temple Kirtan (18%) */}
              <circle
                cx="96"
                cy="96"
                r="38"
                fill="none"
                stroke="#2A1417"
                strokeWidth="7"
              />
              <circle
                cx="96"
                cy="96"
                r="38"
                fill="none"
                stroke="#F87171"
                strokeWidth="7"
                strokeDasharray="238"
                strokeDashoffset={238 - (238 * stats.templeKirtanPercentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            <div className="absolute text-center">
              <Sparkles className="w-5 h-5 text-[#E5C378] mx-auto animate-pulse" />
              <span className="text-[10px] font-bold text-[#A89A8A] uppercase tracking-wider block mt-1">
                SYNCHRONY
              </span>
            </div>
          </div>

          {/* 3 Stats Legend Row */}
          <div className="w-full grid grid-cols-3 gap-2 pt-4 border-t border-[#E5C378]/15 text-center text-[10px]">
            <div>
              <span className="text-[#A89A8A] block">VEDIC CHANTS</span>
              <span className="font-bold text-sm text-[#E5C378]">{stats.vedicChantsPercentage}%</span>
            </div>
            <div>
              <span className="text-[#A89A8A] block">MEDITATIVE RAGA</span>
              <span className="font-bold text-sm text-[#F59E0B]">{stats.meditativeRagaPercentage}%</span>
            </div>
            <div>
              <span className="text-[#A89A8A] block">TEMPLE KIRTAN</span>
              <span className="font-bold text-sm text-[#F87171]">{stats.templeKirtanPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
