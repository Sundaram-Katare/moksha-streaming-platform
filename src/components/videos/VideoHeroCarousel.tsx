'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, ChevronLeft, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { YoutubeVideo } from '@/features/youtube/youtubeService';
import { useLanguage } from '@/features/language/LanguageContext';
import { VideoPlayerModal } from './VideoPlayerModal';

interface VideoHeroCarouselProps {
  videos: YoutubeVideo[];
}

export function VideoHeroCarousel({ videos }: VideoHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<YoutubeVideo | null>(null);
  const { t } = useLanguage();

  const currentVideo = videos[currentIndex] || videos[0];

  // Auto advance every 8 seconds
  useEffect(() => {
    if (videos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [videos.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  if (!currentVideo || videos.length === 0) return null;

  return (
    <>
      <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 pt-4 pb-6">
        {/* Outer Banner Card */}
        <div className="relative w-full min-h-[360px] sm:min-h-[420px] rounded-3xl overflow-hidden border border-[var(--gold-border)] shadow-2xl bg-[var(--bg-card)]">
          {/* Ambient Background Blur Artwork */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVideo.id + '-bg'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src={currentVideo.thumbnail_url}
                  alt={currentVideo.title}
                  fill
                  unoptimized
                  className="object-cover opacity-20 filter blur-2xl scale-110"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-[var(--bg-void)]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-void)] via-[var(--bg-void)]/60 to-transparent" />
          </div>

          {/* Main Foreground Content */}
          <div className="relative z-10 p-5 sm:p-8 lg:p-12 flex flex-col justify-between min-h-[360px] sm:min-h-[420px]">
            {/* Top Row: Lineage Badge + Prev/Next Controls */}
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bronze-pill text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>{currentVideo.deity_focus ? `${currentVideo.deity_focus} Devotional Master` : 'Featured Sacred Video'}</span>
              </div>

              {videos.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 sm:p-2.5 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--gold-border)] text-[var(--gold-primary)] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    title="Previous Video"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 sm:p-2.5 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--gold-border)] text-[var(--gold-primary)] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    title="Next Video"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Middle Row: Video 16:9 Thumbnail Box + Video Info & CTA */}
            <div className="my-auto py-4 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 lg:gap-8">
              {/* 16:9 Crisp Video Thumbnail Artwork Box */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVideo.id + '-thumb'}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setPlayingVideo(currentVideo)}
                  className="relative w-56 sm:w-64 md:w-72 lg:w-80 aspect-video rounded-2xl overflow-hidden border-2 border-[var(--gold-border)] shadow-2xl shrink-0 group cursor-pointer bg-black"
                >
                  <Image
                    src={currentVideo.thumbnail_url}
                    alt={currentVideo.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  {/* Floating Play Button */}
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bronze-pill text-white flex items-center justify-center shadow-xl group-hover:scale-110 active:scale-95 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  {/* Duration badge */}
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-black/80 px-2 py-0.5 rounded-md">
                    {currentVideo.duration_formatted}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Video Details & Actions */}
              <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentVideo.id + '-meta'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-1.5"
                  >
                    <h1 className="font-laila text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-[var(--text-primary)] leading-tight drop-shadow-sm">
                      {currentVideo.title}
                    </h1>

                    {currentVideo.hindi_title && (
                      <p className="font-laila text-lg sm:text-xl text-[var(--gold-primary)] font-semibold tracking-wide drop-shadow-sm">
                        {currentVideo.hindi_title}
                      </p>
                    )}

                    <p className="font-laila text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 pt-1">
                      {currentVideo.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Actions: Watch Now CTA and External YouTube Link */}
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <button
                    onClick={() => setPlayingVideo(currentVideo)}
                    className="flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full bronze-pill text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>{t('Watch Video Now', 'अभी वीडियो देखें')}</span>
                  </button>

                  <a
                    href={currentVideo.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--gold-border)] bg-[var(--bg-card)] hover:bg-[var(--maroon-pill)] text-[var(--gold-primary)] text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Row: Carousel Dots */}
            {videos.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {videos.map((vid, idx) => (
                  <button
                    key={vid.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'w-6 bg-[var(--gold-primary)]'
                        : 'w-1.5 bg-[var(--gold-border)] hover:bg-[var(--gold-primary)]/50'
                    }`}
                    title={vid.title}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {playingVideo && (
        <VideoPlayerModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
      )}
    </>
  );
}
