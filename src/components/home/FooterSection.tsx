'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function FooterSection() {
  return (
    <footer className="w-full bg-[var(--bg-card)] border-t border-[var(--gold-border)] mt-10 pt-10 pb-14 px-4 sm:px-6 lg:px-10 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-8 border-b border-[var(--gold-border)]/40">
        {/* Left Column: Brand (6 cols) */}
        <div className="md:col-span-6 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--gold-primary)]">
              <Image src="/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <span className="font-laila font-bold text-lg text-[var(--gold-primary)]">
              Moksha Music
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md">
            A sacred sonic sanctuary merging primordial Vedic resonance, classical Indian ragas, and meditative soundscapes in audiophile-grade high-fidelity acoustics.
          </p>

          <div className="pt-1">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold block mb-1.5">
              STREAM ON ECOSYSTEMS
            </span>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-secondary)]">
              <span className="px-2.5 py-1 rounded-full bg-[var(--maroon-pill)] border border-[var(--gold-border)]">Spotify HiFi</span>
              <span className="px-2.5 py-1 rounded-full bg-[var(--maroon-pill)] border border-[var(--gold-border)]">YouTube Master</span>
              <span className="px-2.5 py-1 rounded-full bg-[var(--maroon-pill)] border border-[var(--gold-border)]">Apple Music Spatial</span>
            </div>
          </div>
        </div>

        {/* Middle Column: Sanctuary Paths (3 cols) */}
        <div className="md:col-span-3 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--gold-primary)]">
            SANCTUARY PATHS
          </h4>
          <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
            <li>
              <Link href="/music" className="hover:text-[var(--gold-primary)] transition-colors">
                Spotify Music Catalog
              </Link>
            </li>
            <li>
              <Link href="/videos" className="hover:text-[var(--gold-primary)] transition-colors">
                Devotional Videos
              </Link>
            </li>
            <li>
              <Link href="/library" className="hover:text-[var(--gold-primary)] transition-colors">
                My Sacred Playlists
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[var(--gold-primary)] transition-colors">
                Our Story &amp; Philosophy
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column: Devotional Acoustic Science (3 cols) */}
        <div className="md:col-span-3 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--gold-primary)]">
            ACOUSTIC SCIENCE
          </h4>
          <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
            <li>
              <span className="hover:text-[var(--gold-primary)] transition-colors">
                432Hz Natural Healing Frequency
              </span>
            </li>
            <li>
              <span className="hover:text-[var(--gold-primary)] transition-colors">
                Vedic Chants in Classical Metres
              </span>
            </li>
            <li>
              <span className="hover:text-[var(--gold-primary)] transition-colors">
                Lossless Audiophile Mastering
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright & Legal */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)]">
        <p>© 2026 Moksha Music Inc. Eternal Devotional Resonance. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-[var(--gold-primary)]">About Us</Link>
          <Link href="/music" className="hover:text-[var(--gold-primary)]">Music</Link>
          <Link href="/videos" className="hover:text-[var(--gold-primary)]">Videos</Link>
        </div>
      </div>
    </footer>
  );
}
