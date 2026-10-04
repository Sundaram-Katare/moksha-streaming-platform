'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Check, ShieldCheck, Flame } from 'lucide-react';

export function SacredInvitationSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="relative rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-r from-[#2C1014] via-[#1E0B0D] to-[#250E12] border border-[#E5C378]/30 shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E5C378]/10 rounded-full filter blur-[80px] pointer-events-none" />

        {/* Left Content */}
        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D141A] border border-[#58242A]">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
            <span className="text-[10px] font-bold tracking-wider text-[#E5C378] uppercase">
              SACRED INVITATION
            </span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-[#F8F5EE] tracking-tight">
            Begin Your Journey Inward
          </h2>

          <p className="text-xs sm:text-sm text-[#C5BAAD] leading-relaxed">
            Experience 14 days of uncompressed, ad-free divine audio masters. High-definition 432Hz playback, downloadable sadhana japa loops, and offline temple devotion.
          </p>

          {/* 3 Guarantees */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-[#E5C378]">
            <div className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-[#E5C378]" />
              <span>Pure Devotion Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-[#E5C378]" />
              <span>Lossless Master Audio</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-[#E5C378]" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>

        {/* Right CTA Box */}
        <div className="flex flex-col items-center lg:items-end shrink-0 relative z-10">
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-full bg-[#E5C378] hover:bg-[#F7D78A] text-[#12090A] font-bold text-sm tracking-wide shadow-xl shadow-[#E5C378]/25 hover:scale-105 active:scale-95 transition-all text-center"
          >
            Start 14-Day Free Sadhana
          </Link>
          <span className="text-[11px] text-[#A89A8A] font-medium pt-2 text-center lg:text-right">
            Then ₹299 / month or ₹2,499 / year
          </span>
        </div>
      </div>
    </section>
  );
}
