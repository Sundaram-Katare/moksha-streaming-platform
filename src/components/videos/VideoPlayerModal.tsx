'use client';

import React from 'react';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { YoutubeVideo } from '@/features/youtube/youtubeService';

interface VideoPlayerModalProps {
  video: YoutubeVideo | null;
  onClose: () => void;
}

export function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl p-4 sm:p-6 border border-[var(--gold-border)] shadow-2xl bg-[var(--bg-card)] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-border)]">
          <div className="flex items-center gap-2 min-w-0 pr-4">
            <span className="text-[10px] font-bold uppercase tracking-wider bronze-pill text-white px-2.5 py-0.5 rounded-full shrink-0">
              {video.deity_focus || 'Bhakti Video'}
            </span>
            <h3 className="font-laila font-bold text-sm sm:text-base text-[var(--text-primary)] truncate">
              {video.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-[var(--gold-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--maroon-pill)] transition-all cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16:9 Responsive Video Frame */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-[var(--gold-border)]/50 shadow-inner">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs text-[var(--text-secondary)]">
          <p className="line-clamp-1">{video.description || 'Moksha Music official release.'}</p>
          <a
            href={video.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[var(--gold-primary)] font-bold hover:underline shrink-0"
          >
            <span>Open on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
