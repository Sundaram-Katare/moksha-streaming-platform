'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/features/language/LanguageContext';
import { Song } from '@/types';

interface HomeHeroProps {
  featuredSong?: Song | null;
}

export function HomeHero({ featuredSong }: HomeHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-14 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side Content (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-start space-y-6">
          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="font-laila text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-[var(--text-primary)] leading-tight">
              MOKSHA MUSIC
            </h1>
            <p className="font-laila text-2xl sm:text-3xl text-[var(--gold-primary)] font-semibold tracking-wide">
              जहाँ भक्ति संगीत बन जाती है
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl font-normal">
            {t(
              'Lossless master recordings of Bhajans, Vedic Stotrams, Aartis, and Meditative Ragas crafted for deep inner stillness and divine devotion.',
              'भजनों, वैदिक स्तोत्रों, आरतियों और ध्यानमय रागों का पवित्र संग्रह, जो मन को असीम शांति और भक्ति में लीन कर दे।'
            )}
          </p>

          {/* Single CTA: Explore Sacred Catalog */}
          <div className="pt-2">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[var(--gold-primary)] hover:opacity-90 text-[#12090A] font-bold text-sm tracking-wide shadow-lg shadow-[var(--gold-primary)]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {t('Explore Sacred Catalog', 'पवित्र संग्रह देखें')}
            </Link>
          </div>
        </div>

        {/* Right Side: Clean Image Only */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[520px] h-[480px] sm:h-[560px] lg:h-[620px]">
            <Image
              src="/images/krishna-hero.png"
              alt="Lord Krishna playing the flute - Moksha Music"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
              className="object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
