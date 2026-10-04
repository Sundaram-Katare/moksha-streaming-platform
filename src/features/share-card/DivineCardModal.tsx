'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Download, Copy, Check, Sparkles, Share2, Layers } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Song } from '@/types';

interface DivineCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
}

export function DivineCardModal({ isOpen, onClose, song }: DivineCardModalProps) {
  const [format, setFormat] = useState<'story' | 'square'>('story');
  const [theme, setTheme] = useState<'sacred-maroon' | 'golden-temple' | 'midnight-shiva'>('sacred-maroon');
  const [selectedVerse, setSelectedVerse] = useState<string>(
    'नमामीश्वरं सच्चिदानन्दरूपं\nलसत्कुण्डलं गोकुले भ्राजमानम्॥'
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.98, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `moksha-${song.slug}-${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = () => {
    const text = `✨ Sacred Darshan on Moksha Music ✨\n${song.title} (${song.hindi_title || ''})\n\n"${selectedVerse}"\n\nListen in 432Hz Lossless at https://mokshamusic.com/song/${song.slug}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const themeClasses = {
    'sacred-maroon': 'bg-gradient-to-b from-[#381419] via-[#1A090C] to-[#0A0505] border-[#E5C378]/40',
    'golden-temple': 'bg-gradient-to-b from-[#2A180C] via-[#1A0E07] to-[#0A0505] border-[#F59E0B]/40',
    'midnight-shiva': 'bg-gradient-to-b from-[#0D1624] via-[#080D15] to-[#05080E] border-[#93C5FD]/40',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl glass-panel rounded-3xl p-6 shadow-2xl border border-[#E5C378]/30 overflow-hidden flex flex-col lg:flex-row gap-8 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Card Live Preview */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            ref={cardRef}
            className={`relative rounded-2xl p-6 shadow-2xl border flex flex-col items-center text-center justify-between transition-all overflow-hidden ${
              themeClasses[theme]
            } ${format === 'story' ? 'w-[280px] h-[498px]' : 'w-[320px] h-[320px]'}`}
          >
            {/* Top Branding Header */}
            <div className="flex items-center gap-2 pt-1">
              <div className="w-5 h-5 rounded-full overflow-hidden relative border border-[#E5C378]">
                <Image src="/logo.png" alt="Logo" fill className="object-cover" />
              </div>
              <span className="font-cinzel text-xs font-bold tracking-widest text-[#E5C378]">
                MOKSHA MUSIC
              </span>
            </div>

            {/* Center Sacred Artwork & Verse */}
            <div className="flex flex-col items-center gap-3 my-auto">
              <div
                className={`relative rounded-2xl overflow-hidden border border-[#E5C378]/40 shadow-lg ${
                  format === 'story' ? 'w-36 h-36' : 'w-24 h-24'
                }`}
              >
                <Image
                  src={song.thumbnail_url || '/logo.png'}
                  alt={song.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1 max-w-[240px]">
                <h3 className="font-cinzel text-sm font-bold text-[#F8F5EE] tracking-wide">
                  {song.title}
                </h3>
                {song.hindi_title && (
                  <p className="font-devanagari text-xs text-[#E5C378]">
                    {song.hindi_title}
                  </p>
                )}
              </div>

              {/* Sanskrit Verse Quote */}
              <div className="px-3 py-2 rounded-xl bg-black/40 border border-[#E5C378]/15 max-w-[250px]">
                <p className="font-devanagari text-[11px] leading-relaxed text-[#FFF6DD] whitespace-pre-line italic">
                  &ldquo;{selectedVerse}&rdquo;
                </p>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="w-full flex items-center justify-between text-[9px] text-[#A89A8A] border-t border-[#E5C378]/15 pt-2">
              <span className="font-mono text-[#E5C378]">432Hz Lossless Master</span>
              <span>mokshamusic.com</span>
            </div>
          </div>
        </div>

        {/* Right Side: Customization Controls */}
        <div className="w-full lg:w-80 flex flex-col space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5C378]/15">
            <h3 className="font-cinzel text-lg font-bold text-[#E5C378] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Create Divine Card</span>
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#A89A8A] hover:text-[#F8F5EE] hover:bg-[#2A1417]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Format Selector */}
          <div>
            <label className="text-[11px] font-semibold text-[#A89A8A] uppercase tracking-wider block mb-2">
              Card Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat('story')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  format === 'story'
                    ? 'bg-[#E5C378] text-[#12090A] border-[#E5C378]'
                    : 'bg-[#1A0D0E] text-[#C5BAAD] border-[#E5C378]/20 hover:border-[#E5C378]/40'
                }`}
              >
                Story / WhatsApp (9:16)
              </button>
              <button
                onClick={() => setFormat('square')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  format === 'square'
                    ? 'bg-[#E5C378] text-[#12090A] border-[#E5C378]'
                    : 'bg-[#1A0D0E] text-[#C5BAAD] border-[#E5C378]/20 hover:border-[#E5C378]/40'
                }`}
              >
                Square Post (1:1)
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-[11px] font-semibold text-[#A89A8A] uppercase tracking-wider block mb-2">
              Sanctuary Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('sacred-maroon')}
                className={`py-2 px-2 rounded-xl text-[11px] font-medium border text-center transition-all ${
                  theme === 'sacred-maroon'
                    ? 'bg-[#381419] text-[#E5C378] border-[#E5C378]'
                    : 'bg-[#1A0D0E] text-[#C5BAAD] border-[#E5C378]/15'
                }`}
              >
                Sacred Maroon
              </button>
              <button
                onClick={() => setTheme('golden-temple')}
                className={`py-2 px-2 rounded-xl text-[11px] font-medium border text-center transition-all ${
                  theme === 'golden-temple'
                    ? 'bg-[#2A180C] text-[#F59E0B] border-[#F59E0B]'
                    : 'bg-[#1A0D0E] text-[#C5BAAD] border-[#E5C378]/15'
                }`}
              >
                Golden Temple
              </button>
              <button
                onClick={() => setTheme('midnight-shiva')}
                className={`py-2 px-2 rounded-xl text-[11px] font-medium border text-center transition-all ${
                  theme === 'midnight-shiva'
                    ? 'bg-[#0D1624] text-[#93C5FD] border-[#93C5FD]'
                    : 'bg-[#1A0D0E] text-[#C5BAAD] border-[#E5C378]/15'
                }`}
              >
                Midnight Shiva
              </button>
            </div>
          </div>

          {/* Verse Text Customizer */}
          <div>
            <label className="text-[11px] font-semibold text-[#A89A8A] uppercase tracking-wider block mb-2">
              Sacred Verse / Mantra
            </label>
            <textarea
              rows={3}
              value={selectedVerse}
              onChange={(e) => setSelectedVerse(e.target.value)}
              className="w-full bg-[#1A0D0E] border border-[#E5C378]/20 rounded-xl p-2.5 text-xs text-[#FFF6DD] font-devanagari focus:outline-none focus:border-[#E5C378]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 py-2.5 rounded-full bg-[#E5C378] hover:bg-[#F7D78A] text-[#12090A] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E5C378]/20 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating...' : 'Download High-Res'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2.5 rounded-full bg-[#1D0F11] hover:bg-[#2D161A] border border-[#E5C378]/25 text-[#E5C378] transition-all"
              title="Copy Devotional Text"
            >
              {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
