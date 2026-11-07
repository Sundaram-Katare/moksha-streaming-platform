import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Music, Heart, Shield, Radio, ArrowRight, Play } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story & Sacred Heritage — Moksha Music | हमारे बारे में',
  description: 'The journey, philosophy, 432Hz acoustic science, and Vedic roots behind Moksha Music.',
};

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col items-center pb-20">
      {/* 1. Header Hero Story Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-12">
        <div className="relative rounded-3xl p-8 sm:p-14 lg:p-16 border border-[var(--gold-border)] bg-[var(--bg-card)] shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold-primary)]/10 rounded-full filter blur-3xl pointer-events-none" />

          {/* Left Text */}
          <div className="space-y-4 max-w-2xl relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bronze-pill text-white text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>THE MOKSHA STORY • मोक्ष संगीत गाथा</span>
            </div>

            <h1 className="font-laila text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] leading-tight tracking-wide">
              जहाँ भक्ति संगीत बन जाती है
            </h1>

            <p className="font-laila text-base sm:text-lg text-[var(--gold-primary)] font-semibold tracking-wide">
              Where Devotion Becomes Music — Eternal Sonic Sanctuary
            </p>

            <p className="font-laila text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal pt-1">
              Moksha Music was consecrated with a singular sacred purpose: to restore the primordial stillness, authentic raga aesthetics, and Sanskrit acoustic science of Indian devotional music in audiophile-grade high-fidelity sound.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="/music"
                className="px-6 py-3 rounded-full bronze-pill text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Explore Spotify Music
              </Link>
              <Link
                href="/videos"
                className="px-6 py-3 rounded-full border border-[var(--gold-border)] hover:border-[var(--gold-primary)] bg-[var(--bg-surface)] text-[var(--gold-primary)] font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                Watch YouTube Videos
              </Link>
            </div>
          </div>

          {/* Right Emblem Card */}
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-[var(--gold-border)] shadow-2xl shrink-0 bg-[var(--maroon-pill)] flex items-center justify-center p-4">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56">
              <Image
                src="/logo.png"
                alt="Moksha Music Sacred Emblem"
                fill
                sizes="240px"
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Pillars of Moksha Music */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pillar 1 */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] space-y-3 bg-[var(--bg-card)] hover:border-[var(--gold-primary)] transition-all">
            <div className="w-12 h-12 rounded-2xl bronze-pill text-white flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-laila text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Pure Sattvic Bhakti (श्रीमद् भक्ति)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Every bhajan, kirtan, and stotram is performed not for commercial entertainment, but as an offering of unadulterated devotion (Seva) to the Divine, invoking peace and inner stillness.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] space-y-3 bg-[var(--bg-card)] hover:border-[var(--gold-primary)] transition-all">
            <div className="w-12 h-12 rounded-2xl bronze-pill text-white flex items-center justify-center shadow-md">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-laila text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              432Hz Natural Healing (नाद ब्रह्म)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Unlike modern synthetic 440Hz tuning, our master recordings honor 432Hz pitch calibration. This ancient tuning resonates with the heart chakra, nature rhythms, and mental tranquility.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] space-y-3 bg-[var(--bg-card)] hover:border-[var(--gold-primary)] transition-all">
            <div className="w-12 h-12 rounded-2xl bronze-pill text-white flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-laila text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Classical Raga Roots (शास्त्रीय परम्परा)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Grounding our music in authentic Indian classical ragas (Bhairav, Yaman, Kafi, Darbari) performed on authentic acoustic instruments: bamboo bansuri, tanpura, mridangam, and veena.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Narrative Chapter: The Artist & The Journey */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-[var(--gold-border)] bg-[var(--bg-card)] space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-primary)]">
              THE ARTISTS &amp; VOCALISTS
            </span>
            <h2 className="font-laila text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
              AK Chandra &amp; The Moksha Devotional Ensemble
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            <div className="space-y-4">
              <p>
                Led by devotional vocalist and composer <strong>AK Chandra</strong>, Moksha Music has captivated hundreds of thousands of listeners across India and the diaspora. With hits like <em>&ldquo;Shyam Aaye Re&rdquo;</em>, <em>&ldquo;Govind Bolo Gopal Bolo&rdquo;</em>, and <em>&ldquo;सच्चिदानंद रूपाय&rdquo;</em>, our releases have become morning prayers in temples, households, and yoga ashrams.
              </p>
              <p>
                Each production undergoes rigorous acoustic mastering, ensuring that every flute breath, tanpura harmonic, and Sanskrit vowel is reproduced with spatial depth and spiritual clarity.
              </p>
            </div>

            <div className="space-y-4">
              <p>
                Our community of over <strong>21,000+ devotees</strong> on YouTube and thousands on Spotify continues to grow as seekers look for a genuine alternative to loud, commercialized remixes.
              </p>
              <p>
                Whether you are starting your morning sadhana, practicing pranayama, or seeking evening peace, Moksha Music serves as your personal temple sanctuary.
              </p>
            </div>
          </div>

          {/* Social Platforms Connect */}
          <div className="pt-4 border-t border-[var(--gold-border)]/40 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[var(--text-muted)] font-medium">
              Join the Moksha Music Devotional Family worldwide:
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://www.youtube.com/@mokshamusic20"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bronze-pill text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <span>YouTube @mokshamusic20</span>
              </a>
              <a
                href="https://open.spotify.com/artist/3n12VKEDUVES1qNzSdneYV"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#1DB954] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-[#1AA34A]"
              >
                <span>Spotify Artist</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
