'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function FooterSection() {
  return (
    <footer className="w-full bg-[#0A0505] border-t border-[#E5C378]/15 mt-12 pt-12 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#E5C378]/10">
        {/* Left Column: Brand (6 cols) */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#E5C378]">
              <Image src="/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <span className="font-cinzel text-lg font-bold text-[#E5C378]">
              Moksha Music
            </span>
          </div>

          <p className="text-xs text-[#A89A8A] leading-relaxed max-w-md">
            A sacred sonic sanctuary merging primordial Vedic resonance, classical Indian ragas, and meditative soundscapes in audiophile-grade high-fidelity master acoustics.
          </p>

          <div className="pt-2">
            <span className="text-[10px] uppercase tracking-wider text-[#A89A8A] font-bold block mb-2">
              STREAM ON ECOSYSTEMS
            </span>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#C5BAAD]">
              <span className="px-2.5 py-1 rounded bg-[#170D0E] border border-[#E5C378]/15">Apple Music Spatial</span>
              <span className="px-2.5 py-1 rounded bg-[#170D0E] border border-[#E5C378]/15">Spotify HiFi</span>
              <span className="px-2.5 py-1 rounded bg-[#170D0E] border border-[#E5C378]/15">YouTube Master</span>
            </div>
          </div>
        </div>

        {/* Middle Column: Sanctuary Paths (3 cols) */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#E5C378]">
            SANCTUARY PATHS
          </h4>
          <ul className="space-y-2 text-xs text-[#A89A8A]">
            <li>
              <Link href="/category/krishna" className="hover:text-[#F8F5EE] transition-colors">
                Morning Raga Bhairav
              </Link>
            </li>
            <li>
              <Link href="/category/shiva" className="hover:text-[#F8F5EE] transition-colors">
                Pradosham Shiva Stotrams
              </Link>
            </li>
            <li>
              <Link href="/category/meditation" className="hover:text-[#F8F5EE] transition-colors">
                Vedic Chants in 432Hz
              </Link>
            </li>
            <li>
              <Link href="/category/mantra" className="hover:text-[#F8F5EE] transition-colors">
                Kundalini Flute &amp; Drone
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column: Audiophile & Spirit (3 cols) */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#E5C378]">
            AUDIOPHILE &amp; SPIRIT
          </h4>
          <ul className="space-y-2 text-xs text-[#A89A8A]">
            <li>
              <Link href="/explore" className="hover:text-[#F8F5EE] transition-colors">
                Devotional Master Tape Archive
              </Link>
            </li>
            <li>
              <Link href="/sadhana" className="hover:text-[#F8F5EE] transition-colors">
                Acoustic Science of Sanskrit
              </Link>
            </li>
            <li>
              <Link href="/sadhana" className="hover:text-[#F8F5EE] transition-colors">
                Sadhana Timer Companion
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright & Legal */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8E8275]">
        <p>© 2025 Moksha Music Inc. Eternal Resonance. All Sacred Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-[#C5BAAD]">Divine Privacy</Link>
          <Link href="#" className="hover:text-[#C5BAAD]">Terms of Sanctuary</Link>
          <Link href="#" className="hover:text-[#C5BAAD]">Licensing Master Ragas</Link>
        </div>
      </div>
    </footer>
  );
}
