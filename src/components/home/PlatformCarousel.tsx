'use client';

import React from 'react';
import Link from 'next/link';

interface Platform {
  name: string;
  tagline: string;
  url: string;
  icon: React.ReactNode;
}

export function PlatformCarousel() {
  const platforms: Platform[] = [
    {
      name: 'YouTube',
      tagline: 'Devotional Videos & Masters',
      url: 'https://youtube.com',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF0000] drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'Spotify',
      tagline: '432Hz HiFi Streams',
      url: 'https://spotify.com',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#1DB954] drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.485 17.306c-.215.353-.674.464-1.027.25-2.82-1.722-6.37-2.112-10.55-1.157-.403.093-.807-.156-.9-.558-.093-.402.156-.807.558-.9 4.582-1.047 8.513-.598 11.66 1.328.354.214.465.674.25 1.027zm1.464-3.256c-.27.44-.848.58-1.288.31-3.227-1.984-8.147-2.557-11.964-1.398-.498.15-1.027-.134-1.178-.632-.151-.497.134-1.026.632-1.177 4.364-1.325 9.79-.686 13.488 1.588.44.27.58.848.31 1.288zm.126-3.41c-3.87-2.298-10.257-2.51-13.938-1.392-.593.18-1.223-.157-1.403-.75-.18-.594.157-1.224.75-1.404 4.238-1.286 11.288-1.037 15.74 1.606.535.318.708 1.01.39 1.545-.318.536-1.01.71-1.545.39z" />
        </svg>
      ),
    },
    {
      name: 'Apple Music',
      tagline: 'Lossless Spatial Audio',
      url: 'https://music.apple.com',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#FA243C] drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.85-.92.04-2.04.62-2.7 1.39-.58.67-1.09 1.74-1.01 2.78 1.03.08 2.08-.57 2.7-1.32z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      tagline: 'Sacred Daily Darshan',
      url: 'https://instagram.com',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#E4405F] drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'Amazon Music',
      tagline: 'HD Prime Acoustics',
      url: 'https://music.amazon.com',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF9900] drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.882 12.038c-.13-.104-.325-.091-.455.013-.767.624-1.662.962-2.64.962-1.922 0-3.325-1.39-3.325-3.3a3.32 3.32 0 0 1 3.325-3.313c.978 0 1.873.338 2.64.962.13.104.325.117.455.013l1.378-1.105c.13-.104.143-.299.039-.429-1.222-1.378-2.82-2.145-4.512-2.145-3.692 0-6.695 2.86-6.695 6.41s3.003 6.41 6.695 6.41c1.692 0 3.29-.767 4.512-2.145.104-.13.091-.325-.039-.429l-1.378-1.105v.208zm8.684 6.786c-4.94 3.653-12.142 5.564-18.325 3.536-.455-.143-.845-.559-.442-.975.39-.403 1.053-.169 1.482-.026 5.616 1.833 12.142.065 16.48-3.042.403-.286.91-.078.805.507zm.845-1.91c-.429-.546-2.82-1.287-4.108-.572-.26.143-.377.39-.143.611 1.404 1.365 3.731 1.287 4.316.598.156-.169.195-.39-.065-.637z" />
        </svg>
      ),
    },
    {
      name: 'JioSaavn',
      tagline: 'Devotional Ragas',
      url: 'https://jiosaavn.com',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#2BC5B4] drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
        </svg>
      ),
    },
  ];

  // Duplicate for seamless infinite loop
  const marqueeList = [...platforms, ...platforms, ...platforms];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 overflow-hidden">
      {/* Top Subtle Label */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-[var(--gold-primary)]/40" />
        <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[var(--gold-primary)] uppercase text-center">
          LISTEN ON YOUR SACRED PLATFORMS
        </span>
        <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-[var(--gold-primary)]/40" />
      </div>

      {/* Infinite Moving Carousel Container */}
      <div className="relative w-full overflow-hidden mask-gradient-x">
        {/* Gradient edge fades for smooth infinity illusion */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[var(--bg-void)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[var(--bg-void)] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-infinite flex items-center gap-6 sm:gap-10 py-3">
          {marqueeList.map((platform, idx) => (
            <Link
              key={idx}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--gold-border)] hover:border-[var(--gold-primary)] transition-all duration-300 group shadow-md hover:shadow-xl hover:shadow-[var(--gold-primary)]/15 shrink-0 hover:scale-105 active:scale-95"
            >
              {/* Big Transparent Vector Icon */}
              <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                {platform.icon}
              </div>

              {/* Platform Text Details */}
              <div className="flex flex-col text-left">
                <span className="font-laila text-sm sm:text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--gold-primary)] transition-colors whitespace-nowrap">
                  {platform.name}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[var(--text-muted)] font-medium tracking-tight whitespace-nowrap">
                  {platform.tagline}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
