'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Sparkles, ExternalLink, Video, Eye, Clock, Share2 } from 'lucide-react';
import { YoutubeVideo } from '@/features/youtube/youtubeService';
import { useLanguage } from '@/features/language/LanguageContext';
import { AestheticSocialCardModal } from '@/features/share-card/AestheticSocialCardModal';

interface LatestVideosSectionProps {
  videos: YoutubeVideo[];
}

export function LatestVideosSection({ videos }: LatestVideosSectionProps) {
  const { t } = useLanguage();
  const last10Videos = videos.slice(0, 10);
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo>(last10Videos[0] || videos[0]);
  const [shareVideo, setShareVideo] = useState<YoutubeVideo | null>(null);

  if (!selectedVideo || last10Videos.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Section Header (Image 2 T-Series style "LATEST VIDEOS ... MORE") */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-[var(--gold-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bronze-pill text-white flex items-center justify-center shadow-sm">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-laila font-bold text-lg sm:text-2xl text-[var(--text-primary)] tracking-wide">
              {t('LATEST DEVOTIONAL VIDEOS', 'नवीनतम पावन वीडियो')}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] font-normal">
              {t('Select any video on the right to play on the left', 'दाएं से वीडियो चुनें और बाएं स्क्रीन पर देखें')}
            </p>
          </div>
        </div>

        <Link
          href="/videos"
          className="text-xs font-bold text-[var(--gold-primary)] hover:underline flex items-center gap-1 group"
        >
          <span>{t('VIEW ALL VIDEOS', 'सभी वीडियो')}</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      {/* 2-Column Split Section matching Images 2 & 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (60-65%): Main Playable Interactive Video Player */}
        <div className="lg:col-span-7 xl:col-span-8 glass-panel rounded-3xl p-3 sm:p-5 border border-[var(--gold-border)] shadow-xl bg-[var(--bg-card)] space-y-4">
          {/* Responsive 16:9 Video Frame */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-[var(--gold-border)]/50">
            <iframe
              key={selectedVideo.videoId}
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Active Video Information Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bronze-pill text-white px-2.5 py-0.5 rounded-full">
                  {selectedVideo.deity_focus || 'Bhakti Video'}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {selectedVideo.duration_formatted}
                </span>
              </div>
              <h3 className="font-laila font-bold text-base sm:text-lg text-[var(--text-primary)] leading-snug">
                {selectedVideo.title}
              </h3>
              {selectedVideo.hindi_title && (
                <p className="text-xs text-[var(--gold-primary)] font-devanagari font-semibold">
                  {selectedVideo.hindi_title}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShareVideo(selectedVideo)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bronze-pill text-white text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                title="Create Sacred Card / शेयर कार्ड बनाएँ"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Create Sacred Card</span>
              </button>

              <a
                href={selectedVideo.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--gold-border)] hover:border-[var(--gold-primary)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--gold-primary)] hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (35-40%): Scrollable List of Last 10 Videos matching Image 3 */}
        <div className="lg:col-span-5 xl:col-span-4 glass-panel rounded-3xl p-3 sm:p-4 border border-[var(--gold-border)] shadow-xl bg-[var(--bg-card)] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--gold-border)]/60 px-1">
            <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('Top 10 Video Sanctuary', 'शीर्ष 10 वीडियो')}</span>
            </span>
            <span className="text-[11px] font-bold text-[var(--text-muted)] bg-[var(--maroon-pill)] px-2 py-0.5 rounded-full">
              10 Videos
            </span>
          </div>

          {/* Scrollable List Container (Image 3 card buttons) */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
            {last10Videos.map((video, idx) => {
              const isSelected = selectedVideo.videoId === video.videoId;

              return (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`w-full p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3 text-left group ${
                    isSelected
                      ? 'bg-[var(--maroon-pill)] border-[var(--gold-primary)] shadow-md shadow-[var(--gold-primary)]/15 scale-[1.01]'
                      : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border-[var(--gold-border)]/50 hover:border-[var(--gold-primary)]/60'
                  }`}
                >
                  {/* Video Thumbnail with Duration Badge */}
                  <div className="relative w-24 sm:w-28 aspect-video rounded-xl overflow-hidden shrink-0 bg-black border border-[var(--gold-border)]/40">
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-6 h-6 rounded-full bronze-pill text-white flex items-center justify-center shadow-md">
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white bg-black/75 px-1.5 py-0.2 rounded">
                      {video.duration_formatted}
                    </span>
                  </div>

                  {/* Video Title & Meta */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold text-[var(--gold-primary)]">
                        #{idx + 1}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          Playing
                        </span>
                      )}
                    </div>
                    <h4
                      className={`text-xs font-semibold line-clamp-2 leading-snug transition-colors ${
                        isSelected ? 'text-[var(--gold-primary)] font-bold' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {video.title}
                    </h4>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">
                      {video.views_formatted || video.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Shareable Aesthetic Social Card Modal */}
      {shareVideo && (
        <AestheticSocialCardModal
          isOpen={Boolean(shareVideo)}
          onClose={() => setShareVideo(null)}
          media={{
            id: shareVideo.id,
            title: shareVideo.title,
            hindi_title: shareVideo.hindi_title,
            artist: 'Moksha Music (@mokshamusic20)',
            thumbnail_url: shareVideo.thumbnail_url,
            type: 'video',
            url: shareVideo.video_url,
          }}
        />
      )}
    </section>
  );
}
