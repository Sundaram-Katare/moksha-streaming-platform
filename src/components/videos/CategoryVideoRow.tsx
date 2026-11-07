'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, X, Sparkles, ExternalLink, Video, Share2 } from 'lucide-react';
import { YoutubeVideo } from '@/features/youtube/youtubeService';
import { useLanguage } from '@/features/language/LanguageContext';
import { VideoPlayerModal } from './VideoPlayerModal';
import { AestheticSocialCardModal } from '@/features/share-card/AestheticSocialCardModal';

interface CategoryVideoRowProps {
  title: string;
  hindiTitle?: string;
  tagline?: string;
  videos: YoutubeVideo[];
}

export function CategoryVideoRow({ title, hindiTitle, tagline, videos }: CategoryVideoRowProps) {
  const { t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo | null>(null);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [shareVideo, setShareVideo] = useState<YoutubeVideo | null>(null);

  if (!videos || videos.length === 0) return null;

  // Show exactly 5 videos in a row
  const rowVideos = videos.slice(0, 5);

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6">
        {/* Category Header */}
        <div className="flex items-end justify-between pb-3 mb-4 border-b border-[var(--gold-border)]">
          <div>
            {tagline && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold-primary)] block mb-1">
                {tagline}
              </span>
            )}
            <div className="flex items-baseline gap-3">
              <h3 className="font-laila text-lg sm:text-2xl font-bold text-[var(--text-primary)]">
                {title}
              </h3>
              {hindiTitle && (
                <span className="text-sm sm:text-base font-devanagari text-[var(--gold-primary)] font-semibold">
                  {hindiTitle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsViewAllOpen(true)}
              className="text-xs font-bold text-[var(--gold-primary)] hover:underline px-3 py-1.5 rounded-full hover:bg-[var(--maroon-pill)]/40 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{t('View All', 'सभी देखें')}</span>
              <span className="text-[10px] text-[var(--text-muted)]">({videos.length})</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* 5 Videos in a Row Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {rowVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="glass-panel rounded-2xl p-2.5 sm:p-3 border border-[var(--gold-border)] hover:border-[var(--gold-primary)] transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--gold-primary)]/15 flex flex-col justify-between bg-[var(--bg-card)]"
            >
              {/* 16:9 Thumbnail with Play overlay */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-[var(--gold-border)]/50">
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top-Right Share Card Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareVideo(video);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-[var(--gold-primary)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer shadow-md"
                  title="Create Sacred Card / शेयर कार्ड बनाएँ"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

                <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bronze-pill text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                <span className="absolute bottom-1.5 right-1.5 text-[9px] font-bold text-white bg-black/80 px-1.5 py-0.5 rounded">
                  {video.duration_formatted}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="mt-2.5 space-y-0.5 min-w-0">
                <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--gold-primary)] transition-colors line-clamp-2 leading-snug">
                  {video.title}
                </h4>
                {video.hindi_title && (
                  <p className="text-[11px] text-[var(--gold-primary)] font-devanagari truncate font-medium">
                    {video.hindi_title}
                  </p>
                )}
                <p className="text-[10px] text-[var(--text-muted)] truncate pt-0.5">
                  {video.views_formatted || video.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* "View All" Modal for Category */}
      {isViewAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[85vh] glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-2xl flex flex-col bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--gold-border)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bronze-pill text-white flex items-center justify-center shadow-sm">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-laila font-bold text-lg sm:text-xl text-[var(--text-primary)]">
                    {title} — {t('All Devotional Videos', 'सभी पावन वीडियो')}
                  </h3>
                  {hindiTitle && (
                    <p className="text-xs text-[var(--gold-primary)] font-devanagari font-semibold">
                      {hindiTitle}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsViewAllOpen(false)}
                className="p-2 rounded-full border border-[var(--gold-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--maroon-pill)] transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => {
                      setSelectedVideo(vid);
                      setIsViewAllOpen(false);
                    }}
                    className="glass-panel rounded-2xl p-3 border border-[var(--gold-border)] hover:border-[var(--gold-primary)] transition-all group cursor-pointer hover:-translate-y-1 hover:shadow-lg bg-[var(--bg-card)] flex flex-col justify-between"
                  >
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-[var(--gold-border)]/50">
                      <Image
                        src={vid.thumbnail_url}
                        alt={vid.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-9 h-9 rounded-full bronze-pill text-white flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white bg-black/80 px-1.5 py-0.2 rounded">
                        {vid.duration_formatted}
                      </span>
                    </div>

                    <div className="mt-2 space-y-0.5">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--gold-primary)] transition-colors line-clamp-2">
                        {vid.title}
                      </h4>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">{vid.views_formatted}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--gold-border)]/50 flex items-center justify-between text-xs text-[var(--text-muted)] shrink-0">
              <span>{videos.length} videos available</span>
              <button
                onClick={() => setIsViewAllOpen(false)}
                className="px-4 py-1.5 rounded-full bronze-pill text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

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
    </>
  );
}
