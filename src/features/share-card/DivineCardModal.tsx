'use client';

import React from 'react';
import { Song } from '@/types';
import { AestheticSocialCardModal } from './AestheticSocialCardModal';

interface DivineCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
}

export function DivineCardModal({ isOpen, onClose, song }: DivineCardModalProps) {
  return (
    <AestheticSocialCardModal
      isOpen={isOpen}
      onClose={onClose}
      media={{
        id: song.id,
        title: song.title,
        hindi_title: song.hindi_title,
        artist: song.artist,
        thumbnail_url: song.thumbnail_url,
        type: 'song',
        quote: song.lyrics?.[0]?.lyrics?.split('\n\n')?.[0] || undefined,
        url: typeof window !== 'undefined' ? `${window.location.origin}/song/${song.slug}` : undefined,
      }}
    />
  );
}
