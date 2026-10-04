'use client';

import React from 'react';
import Link from 'next/link';

export function BhaktiParivarSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <div className="relative py-12 sm:py-20 px-4 sm:px-8 flex flex-col items-center text-center bg-transparent">
        {/* Giant Subtle OM (ॐ) Watermark in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-10 filter blur-[0.5px]">
          <span className="font-laila text-[240px] sm:text-[380px] lg:text-[460px] font-bold text-[var(--gold-primary)] leading-none block">
            ॐ
          </span>
        </div>

        {/* Relative Content Container */}
        <div className="relative z-10 flex flex-col items-center space-y-6 max-w-3xl">
          {/* Top Pill Badge: YouTube Bhakti Parivar in English */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--maroon-pill)] border border-[var(--gold-border)] shadow-md backdrop-blur-md">
            {/* Red YouTube Icon */}
            <svg className="w-4 h-4 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="font-laila text-xs sm:text-sm font-semibold text-[var(--text-primary)] tracking-wide">
              YouTube Bhakti Parivar
            </span>
          </div>

          {/* Center 21K+ Grand Typography */}
          <div className="pt-2">
            <h2 className="font-laila text-6xl sm:text-8xl lg:text-9xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5DC] via-[var(--gold-primary)] to-[#B38734] drop-shadow-2xl">
              21K+
            </h2>
          </div>

          {/* Hindi Headline */}
          <h3 className="font-laila text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] tracking-wide drop-shadow-md">
            भक्तों का आध्यात्मिक परिवार
          </h3>

          {/* Golden Ornamental Divider */}
          <div className="flex items-center justify-center gap-3 w-full max-w-xs py-1">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[var(--gold-primary)]/60 to-[var(--gold-primary)]" />
            <div className="flex items-center gap-1.5 text-[var(--gold-primary)]">
              <span className="text-[9px]">◇</span>
              <span className="text-sm">✦</span>
              <span className="text-[9px]">◇</span>
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[var(--gold-primary)]/60 to-[var(--gold-primary)]" />
          </div>

          {/* Subtitle Description */}
          <p className="font-laila text-sm sm:text-base text-[var(--text-secondary)] font-normal leading-relaxed max-w-xl">
            हजारों श्रोताओं के साथ भजन, मंत्र और दिव्य संगीत की इस यात्रा से जुड़ें।
          </p>

          {/* Solid Golden Pill CTA Button */}
          <div className="pt-3">
            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[var(--gold-primary)] hover:opacity-90 text-[#12090A] font-bold text-sm tracking-wider uppercase shadow-xl shadow-[var(--gold-primary)]/30 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <svg className="w-4 h-4 fill-[#12090A]" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="font-laila font-bold">YOUTUBE पर देखें</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
