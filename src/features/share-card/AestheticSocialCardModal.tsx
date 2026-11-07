'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Download,
  Copy,
  Check,
  Sparkles,
  Share2,
  Layers,
  Music,
  Video as VideoIcon,
  Quote,
  CheckCheck,
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { Song } from '@/types';
import { YoutubeVideo } from '@/features/youtube/youtubeService';

export interface CardMediaItem {
  id: string;
  title: string;
  hindi_title?: string | null;
  artist?: string;
  thumbnail_url: string;
  type: 'song' | 'video';
  quote?: string;
  url?: string;
  category?: string;
}

export interface AestheticSocialCardModalProps {
  isOpen?: boolean;
  onClose: () => void;
  media?: CardMediaItem;
  item?: CardMediaItem;
}

const PRESET_QUOTES = [
  {
    label: 'Mahamantra',
    devanagari: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।\nहरे राम हरे राम राम राम हरे हरे ॥',
    transliteration: 'Hare Krishna Hare Krishna Krishna Krishna Hare Hare | Hare Rama Hare Rama Rama Rama Hare Hare',
  },
  {
    label: 'Ganesh Invocation',
    devanagari: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
    transliteration: 'Vakratunda Mahakaya Suryakoti Samaprabha | Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada',
  },
  {
    label: 'Vasudev Mantra',
    devanagari: 'ॐ नमो भगवते वासुदेवाय ।\nसर्वं श्रीकृष्णार्पणमस्तु ॥',
    transliteration: 'Om Namo Bhagavate Vasudevaya | Sarvam Shri Krishnarpanamastu',
  },
  {
    label: 'Shiva Dhyan',
    devanagari: 'कर्पूरगौरं करुणावतारं संसारसारम् भुजगेन्द्रहारम् ।\nसदावसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि ॥',
    transliteration: 'Karpura Gauram Karunavataram Samsarasaram Bhujagendraharam | Sadavasantam Hridayaravinde Bhavam Bhavanisahitam Namami',
  },
  {
    label: 'Radhe Dhun',
    devanagari: 'राधे राधे जपो चले आएंगे बिहारी ।\nआएंगे बिहारी चले आएंगे बिहारी ॥',
    transliteration: 'Radhe Radhe Japo Chale Aayenge Bihari',
  },
  {
    label: 'Devi Stuti',
    devanagari: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके ।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥',
    transliteration: 'Sarvamangala Mangalye Shive Sarvarthasadhike | Sharanye Tryambake Gauri Narayani Namostu Te',
  },
];

type CardTheme = 'sandalwood-gold' | 'midnight-shiva' | 'temple-maroon' | 'vrindavan-emerald';
type CardFormat = 'story' | 'square' | 'banner';

export function AestheticSocialCardModal({
  isOpen = true,
  onClose,
  media: rawMedia,
  item,
}: AestheticSocialCardModalProps) {
  const media = rawMedia || item;
  if (!media || isOpen === false) return null;

  const [format, setFormat] = useState<CardFormat>('story');
  const [theme, setTheme] = useState<CardTheme>('sandalwood-gold');
  const [customQuote, setCustomQuote] = useState<string>(
    media.quote || PRESET_QUOTES[0].devanagari
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'image-copied' | 'text-copied'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (media.quote) {
      setCustomQuote(media.quote);
    }
  }, [media]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    setStatusMessage('Generating high-resolution card...');
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `moksha-${media.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${format}.png`;
      link.href = dataUrl;
      link.click();
      setStatusMessage('✦ Sacred Card downloaded successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('Download error:', err);
      setStatusMessage('Failed to render image. Please try copying instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    setStatusMessage('Rendering image to clipboard...');
    try {
      const blob = await toBlob(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
      });

      if (blob && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopyStatus('image-copied');
        setStatusMessage('✦ Image copied to clipboard! Paste directly into Instagram, WhatsApp, or Twitter.');
        setTimeout(() => {
          setCopyStatus('idle');
          setStatusMessage(null);
        }, 4000);
        return;
      }
      throw new Error('ClipboardItem not supported');
    } catch {
      // Fallback: copy formatted text
      const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://mokshamusic.com';
      const text = `✨ ${media.title} (${media.hindi_title || ''}) ✨\n\n❝ ${customQuote} ❞\n\nListen in 432Hz Lossless on Moksha Music:\n${shareUrl}`;
      await navigator.clipboard.writeText(text);
      setCopyStatus('text-copied');
      setStatusMessage('✦ Text quote copied to clipboard!');
      setTimeout(() => {
        setCopyStatus('idle');
        setStatusMessage(null);
      }, 3000);
    }
  };

  // Theme styling definitions inspired by traditional Indian temple art
  const themeStyles: Record<CardTheme, {
    container: string;
    border: string;
    goldAccent: string;
    textPrimary: string;
    textSecondary: string;
    quoteBg: string;
    mandalaOpacity: string;
    pillBg: string;
    filigreeColor: string;
  }> = {
    'sandalwood-gold': {
      container: 'bg-gradient-to-b from-[#FFFDF9] via-[#F8F1E5] to-[#EFE3D0]',
      border: 'border-[#B87C52]/50 shadow-[0_0_35px_rgba(184,124,82,0.2)]',
      goldAccent: 'text-[#8C5837]',
      textPrimary: 'text-[#2D1C13]',
      textSecondary: 'text-[#7D533C]',
      quoteBg: 'bg-[#F2E5D3]/90 border-[#8C5837]/30 text-[#3C2216]',
      mandalaOpacity: 'opacity-15',
      pillBg: 'bg-gradient-to-r from-[#B87C52] to-[#8C5837] text-white',
      filigreeColor: '#8C5837',
    },
    'midnight-shiva': {
      container: 'bg-gradient-to-b from-[#0B1220] via-[#060A14] to-[#020409]',
      border: 'border-[#F7D78A]/40 shadow-[0_0_40px_rgba(247,215,138,0.2)]',
      goldAccent: 'text-[#F7D78A]',
      textPrimary: 'text-[#FAF5EE]',
      textSecondary: 'text-[#C5BAAD]',
      quoteBg: 'bg-black/50 border-[#F7D78A]/25 text-[#FFF6DE]',
      mandalaOpacity: 'opacity-20',
      pillBg: 'bg-gradient-to-r from-[#E5C378] to-[#B88E3A] text-[#12090A]',
      filigreeColor: '#F7D78A',
    },
    'temple-maroon': {
      container: 'bg-gradient-to-b from-[#380E16] via-[#22060C] to-[#120206]',
      border: 'border-[#FCD34D]/40 shadow-[0_0_40px_rgba(252,211,77,0.22)]',
      goldAccent: 'text-[#FCD34D]',
      textPrimary: 'text-[#FFFBF2]',
      textSecondary: 'text-[#E2C7A8]',
      quoteBg: 'bg-[#180307]/80 border-[#FCD34D]/30 text-[#FFF9EB]',
      mandalaOpacity: 'opacity-20',
      pillBg: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#1C0509]',
      filigreeColor: '#FCD34D',
    },
    'vrindavan-emerald': {
      container: 'bg-gradient-to-b from-[#0A241C] via-[#051711] to-[#020A07]',
      border: 'border-[#FBBF24]/40 shadow-[0_0_40px_rgba(251,191,36,0.2)]',
      goldAccent: 'text-[#FBBF24]',
      textPrimary: 'text-[#F7FEE7]',
      textSecondary: 'text-[#D1E7DD]',
      quoteBg: 'bg-[#03130E]/80 border-[#FBBF24]/30 text-[#FEFCE8]',
      mandalaOpacity: 'opacity-20',
      pillBg: 'bg-gradient-to-r from-[#F59E0B] to-[#B45309] text-[#061F18]',
      filigreeColor: '#FBBF24',
    },
  };

  const currentStyle = themeStyles[theme];

  // Dynamic card dimensions for high aesthetic Instagram layout
  const dimensions = {
    story: 'w-[290px] h-[515px]',
    square: 'w-[320px] h-[320px]',
    banner: 'w-[360px] h-[202px]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-4xl glass-panel rounded-3xl p-5 sm:p-8 shadow-2xl border border-[var(--gold-border)] overflow-hidden flex flex-col lg:flex-row gap-6 sm:gap-8 items-center bg-[var(--bg-card)] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT: Live Aesthetic Card Canvas Preview */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="relative p-2 rounded-2xl bg-black/30 border border-[var(--gold-border)]/50 shadow-inner flex items-center justify-center">
            {/* The Actual Aesthetic Card to be Captured */}
            <div
              ref={cardRef}
              className={`relative rounded-2xl p-5 sm:p-6 border-2 flex flex-col justify-between items-center text-center transition-all overflow-hidden ${
                dimensions[format]
              } ${currentStyle.container} ${currentStyle.border}`}
            >
              {/* Traditional Indian Ornamental Filigree Corners */}
              <svg
                className="absolute top-2 left-2 w-8 h-8 pointer-events-none opacity-80"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path
                  d="M0,0 L35,0 C25,10 15,20 15,35 L15,100 L0,100 Z"
                  fill={currentStyle.filigreeColor}
                  opacity="0.3"
                />
                <path
                  d="M5,5 L45,5 C35,15 20,25 20,50 L5,50 Z"
                  fill={currentStyle.filigreeColor}
                  opacity="0.6"
                />
                <circle cx="12" cy="12" r="4" fill={currentStyle.filigreeColor} />
                <path
                  d="M2,2 L98,2 L98,8 L8,8 L8,98 L2,98 Z"
                  fill={currentStyle.filigreeColor}
                />
              </svg>

              <svg
                className="absolute top-2 right-2 w-8 h-8 pointer-events-none opacity-80 rotate-90"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path
                  d="M0,0 L35,0 C25,10 15,20 15,35 L15,100 L0,100 Z"
                  fill={currentStyle.filigreeColor}
                  opacity="0.3"
                />
                <path
                  d="M5,5 L45,5 C35,15 20,25 20,50 L5,50 Z"
                  fill={currentStyle.filigreeColor}
                  opacity="0.6"
                />
                <circle cx="12" cy="12" r="4" fill={currentStyle.filigreeColor} />
                <path
                  d="M2,2 L98,2 L98,8 L8,8 L8,98 L2,98 Z"
                  fill={currentStyle.filigreeColor}
                />
              </svg>

              <svg
                className="absolute bottom-2 left-2 w-8 h-8 pointer-events-none opacity-80 -rotate-90"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path
                  d="M0,0 L35,0 C25,10 15,20 15,35 L15,100 L0,100 Z"
                  fill={currentStyle.filigreeColor}
                  opacity="0.3"
                />
                <path
                  d="M5,5 L45,5 C35,15 20,25 20,50 L5,50 Z"
                  fill={currentStyle.filigreeColor}
                  opacity="0.6"
                />
                <circle cx="12" cy="12" r="4" fill={currentStyle.filigreeColor} />
                <path
                  d="M2,2 L98,2 L98,8 L8,8 L8,98 L2,98 Z"
                  fill={currentStyle.filigreeColor}
                />
              </svg>

              <svg
                className="absolute bottom-2 right-2 w-8 h-8 pointer-events-none opacity-80 rotate-180"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path
                  d="M0,0 L35,0 C25,10 15,20 15,35 L15,100 L0,100 Z"
                  fill={currentStyle.filigreeColor}
                  opacity="0.3"
                />
                <path
                  d="M5,5 L45,5 C35,15 20,25 20,50 L5,50 Z"
                  fill={currentStyle.filigreeColor}
                  opacity="0.6"
                />
                <circle cx="12" cy="12" r="4" fill={currentStyle.filigreeColor} />
                <path
                  d="M2,2 L98,2 L98,8 L8,8 L8,98 L2,98 Z"
                  fill={currentStyle.filigreeColor}
                />
              </svg>

              {/* Central Golden Mandala Watermark */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none ${currentStyle.mandalaOpacity}`}
              >
                <svg className="w-64 h-64 animate-spin-slow" viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="90" stroke={currentStyle.filigreeColor} strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="100" cy="100" r="70" stroke={currentStyle.filigreeColor} strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="50" stroke={currentStyle.filigreeColor} strokeWidth="1" />
                  <circle cx="100" cy="100" r="25" stroke={currentStyle.filigreeColor} strokeWidth="1.5" />
                  {/* 12 Petal rays */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <line
                      key={deg}
                      x1="100"
                      y1="10"
                      x2="100"
                      y2="190"
                      stroke={currentStyle.filigreeColor}
                      strokeWidth="0.7"
                      transform={`rotate(${deg} 100 100)`}
                    />
                  ))}
                </svg>
              </div>

              {/* Card Header: Brand Emblem & Sacred Seal */}
              <div className="relative z-10 flex items-center justify-between w-full pt-1 px-2 border-b border-black/10 dark:border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden relative border border-current shadow-sm">
                    <Image src="/logo.png" alt="Logo" fill unoptimized className="object-cover" />
                  </div>
                  <span className={`font-laila font-black text-[11px] tracking-wider ${currentStyle.goldAccent}`}>
                    MOKSHA MUSIC
                  </span>
                </div>

                <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border border-current/30 ${currentStyle.goldAccent}`}>
                  {media.type === 'video' ? 'Sacred Darshan' : '432Hz Master'}
                </span>
              </div>

              {/* Center Content: Thumbnail, Titles, and Shloka Quote */}
              <div className="relative z-10 flex flex-col items-center gap-2.5 my-auto max-w-full px-2">
                {/* Artwork Thumbnail with Golden Ring */}
                <div
                  className={`relative rounded-2xl overflow-hidden border-2 shadow-2xl shrink-0 ${
                    currentStyle.border
                  } ${
                    format === 'story'
                      ? 'w-28 h-28 sm:w-32 sm:h-32'
                      : format === 'square'
                      ? 'w-20 h-20'
                      : 'w-16 h-16'
                  }`}
                >
                  <Image
                    src={media.thumbnail_url || '/logo.png'}
                    alt={media.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Song / Video Title */}
                <div className="space-y-0.5 max-w-[240px]">
                  <h3
                    className={`font-laila font-black text-xs sm:text-sm tracking-wide truncate ${currentStyle.textPrimary}`}
                  >
                    {media.title}
                  </h3>
                  {media.hindi_title && (
                    <p
                      className={`font-devanagari text-xs sm:text-sm font-bold truncate ${currentStyle.goldAccent}`}
                    >
                      {media.hindi_title}
                    </p>
                  )}
                  {media.artist && (
                    <p className={`text-[10px] ${currentStyle.textSecondary}`}>
                      {media.artist}
                    </p>
                  )}
                </div>

                {/* Shloka / Lyrics Quote Box with Traditional Quotation Marks */}
                {format !== 'banner' && (
                  <div
                    className={`relative px-3.5 py-2.5 rounded-2xl border max-w-[250px] shadow-sm backdrop-blur-md ${currentStyle.quoteBg}`}
                  >
                    <span className="text-sm font-serif leading-none block text-center opacity-70">❝</span>
                    <p className="font-devanagari text-[11px] sm:text-xs leading-relaxed whitespace-pre-line font-medium text-center -mt-1">
                      {customQuote}
                    </p>
                    <span className="text-sm font-serif leading-none block text-center opacity-70 mt-1">❞</span>
                  </div>
                )}
              </div>

              {/* Card Footer: Frequency Waveform & Website Branding */}
              <div className="relative z-10 w-full flex items-center justify-between text-[9px] border-t border-black/10 dark:border-white/10 pt-2 px-1">
                {/* Audio Waveform Bars */}
                <div className="flex items-center gap-0.5 opacity-70">
                  <span className="w-0.5 h-2 bg-current rounded-full" />
                  <span className="w-0.5 h-3.5 bg-current rounded-full" />
                  <span className="w-0.5 h-2 bg-current rounded-full" />
                  <span className="w-0.5 h-4 bg-current rounded-full" />
                  <span className="w-0.5 h-2.5 bg-current rounded-full" />
                  <span className="w-0.5 h-1.5 bg-current rounded-full" />
                  <span className="ml-1 text-[8px] font-mono font-semibold">432Hz</span>
                </div>

                <div className={`font-mono text-[9px] tracking-wide ${currentStyle.goldAccent}`}>
                  mokshamusic.com
                </div>
              </div>
            </div>
          </div>

          {statusMessage && (
            <p className="text-xs font-semibold text-[var(--gold-primary)] mt-3 text-center animate-in fade-in">
              {statusMessage}
            </p>
          )}
        </div>

        {/* RIGHT: Customization Controls & Instant Export */}
        <div className="w-full lg:w-80 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--gold-border)]">
            <h3 className="font-laila text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--gold-primary)]" />
              <span>Sacred Social Card</span>
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--maroon-pill)] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Format Selector */}
          <div>
            <label className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1.5">
              Card Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setFormat('story')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  format === 'story'
                    ? 'bronze-pill text-white shadow-md'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--gold-border)] hover:border-[var(--gold-primary)]'
                }`}
              >
                Story (9:16)
              </button>
              <button
                onClick={() => setFormat('square')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  format === 'square'
                    ? 'bronze-pill text-white shadow-md'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--gold-border)] hover:border-[var(--gold-primary)]'
                }`}
              >
                Post (1:1)
              </button>
              <button
                onClick={() => setFormat('banner')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  format === 'banner'
                    ? 'bronze-pill text-white shadow-md'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--gold-border)] hover:border-[var(--gold-primary)]'
                }`}
              >
                Banner (16:9)
              </button>
            </div>
          </div>

          {/* Traditional Aesthetic Theme Selector */}
          <div>
            <label className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1.5">
              Aesthetic Temple Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme('sandalwood-gold')}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                  theme === 'sandalwood-gold'
                    ? 'border-[#8C5837] bg-[#F6EFE7] dark:bg-[#3D2517] ring-2 ring-[#8C5837]/30'
                    : 'bg-[var(--bg-surface)] border-[var(--gold-border)]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#8C5837] border border-white/50" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">चन्दन स्वर्ण</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">Sandalwood &amp; Gold</span>
              </button>

              <button
                onClick={() => setTheme('midnight-shiva')}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                  theme === 'midnight-shiva'
                    ? 'border-[#F7D78A] bg-[#0E1726] ring-2 ring-[#F7D78A]/30'
                    : 'bg-[var(--bg-surface)] border-[var(--gold-border)]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#0B1220] border border-[#F7D78A]" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">निशीथ नील</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">Midnight Cosmic</span>
              </button>

              <button
                onClick={() => setTheme('temple-maroon')}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                  theme === 'temple-maroon'
                    ? 'border-[#FCD34D] bg-[#2E0B12] ring-2 ring-[#FCD34D]/30'
                    : 'bg-[var(--bg-surface)] border-[var(--gold-border)]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#380E16] border border-[#FCD34D]" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">सिन्दूरी मरु</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">Temple Vermilion</span>
              </button>

              <button
                onClick={() => setTheme('vrindavan-emerald')}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                  theme === 'vrindavan-emerald'
                    ? 'border-[#FBBF24] bg-[#0A241C] ring-2 ring-[#FBBF24]/30'
                    : 'bg-[var(--bg-surface)] border-[var(--gold-border)]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#0A241C] border border-[#FBBF24]" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">कदम्ब कुंज</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">Peacock Emerald</span>
              </button>
            </div>
          </div>

          {/* Shloka / Quote Customizer */}
          <div>
            <label className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1.5">
              Sacred Shloka / Quote / भजन के बोल
            </label>

            {/* Preset Quotes Quick Selector */}
            <select
              onChange={(e) => {
                const found = PRESET_QUOTES.find((p) => p.label === e.target.value);
                if (found) setCustomQuote(found.devanagari);
              }}
              className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-1.5 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] mb-2 cursor-pointer"
            >
              <option value="">Select Sacred Verse Preset...</option>
              {PRESET_QUOTES.map((q) => (
                <option key={q.label} value={q.label}>
                  {q.label} ({q.devanagari.split('\n')[0]})
                </option>
              ))}
            </select>

            <textarea
              rows={3}
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              placeholder="Write or paste your sacred shloka, lyrics, or quote here..."
              className="w-full bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] font-devanagari resize-none"
            />
          </div>

          {/* ACTION BUTTONS: Download Image & Copy to Clipboard */}
          <div className="space-y-2 pt-2">
            {/* Copy Image Button */}
            <button
              onClick={handleCopyImage}
              className="w-full py-3 rounded-full bronze-pill text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              {copyStatus === 'image-copied' ? (
                <>
                  <CheckCheck className="w-4 h-4 text-emerald-300" />
                  <span>Image Copied to Clipboard!</span>
                </>
              ) : copyStatus === 'text-copied' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Text Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Image to Clipboard</span>
                </>
              )}
            </button>

            {/* Download High-Res PNG Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-2.5 rounded-full border border-[var(--gold-border)] hover:border-[var(--gold-primary)] bg-[var(--bg-surface)] hover:bg-[var(--maroon-pill)] text-[var(--gold-primary)] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Rendering Image...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download High-Res PNG</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
