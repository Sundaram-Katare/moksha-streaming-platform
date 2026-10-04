'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';

interface DeityExplorerSectionProps {
  categories: Category[];
}

export function DeityExplorerSection({ categories }: DeityExplorerSectionProps) {
  const deityData = [
    {
      name: 'Krishna',
      slug: 'krishna',
      bhava: 'PREM & ANAND',
      subtext: 'Raas, Flute, Kirtan',
      image: '/logo.png',
    },
    {
      name: 'Mahadeva Shiva',
      slug: 'shiva',
      bhava: 'DHYAN & VAIRAGYA',
      subtext: 'Damru, Stotrams, Tandav',
      image: '/logo.png',
    },
    {
      name: 'Shri Ram',
      slug: 'ram',
      bhava: 'MARYADA & SHANTI',
      subtext: 'Bhajans, Naam-Japa',
      image: '/logo.png',
    },
    {
      name: 'Durga & Devi',
      slug: 'durga',
      bhava: 'SHAKTI & TEJ',
      subtext: 'Kavach, Chandi, Aartis',
      image: '/logo.png',
    },
    {
      name: 'Mahavira Hanuman',
      slug: 'hanuman',
      bhava: 'BHAKTI & SANKALP',
      subtext: 'Chalisa, Ashtak, Baan',
      image: '/logo.png',
    },
    {
      name: 'Ganesh',
      slug: 'ganesh',
      bhava: 'MANGAL & SIDDHI',
      subtext: 'Atharvashirsha, Vandana',
      image: '/logo.png',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5C378]/15">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#E5C378] uppercase block mb-0.5">
            DIVINE BHAVAS &amp; LINEAGES
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-bold text-[#F8F5EE]">
            Explore By Devotion &amp; Deity
          </h2>
        </div>
        <p className="text-xs text-[#A89A8A] max-w-md md:text-right">
          Tune your conscious space to the specific emotional resonance of divine avatars, traditional temples, and transcendent lineages.
        </p>
      </div>

      {/* Grid of 6 Deity Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 pt-6">
        {deityData.map((d) => (
          <Link
            key={d.slug}
            href={`/category/${d.slug}`}
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#E5C378]/20 hover:border-[#E5C378]/60 transition-all duration-300 flex flex-col justify-end p-4 shadow-lg hover:shadow-2xl hover:shadow-[#E5C378]/15 hover:-translate-y-1"
          >
            {/* Deity Artwork Background */}
            <Image
              src={d.image}
              alt={d.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0708] via-[#1A0A0D]/70 to-transparent" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

            {/* Inner Content */}
            <div className="relative z-10 space-y-1">
              <span className="text-[9px] font-bold tracking-wider text-[#E5C378] uppercase block">
                {d.bhava}
              </span>
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#F8F5EE] group-hover:text-[#FFF6DD] leading-tight">
                {d.name}
              </h3>
              <p className="text-[10px] text-[#C5BAAD] group-hover:text-[#F8F5EE] transition-colors truncate">
                {d.subtext}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
