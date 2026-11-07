'use client';

import React from 'react';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import { usePlayer } from '@/features/player/PlayerContext';

export function LyricsModal() {
  const {
    currentSong,
    isLyricsModalOpen,
    closeLyricsModal,
    activeLyricsLanguage,
    setActiveLyricsLanguage,
  } = usePlayer();

  const [copied, setCopied] = React.useState(false);

  if (!isLyricsModalOpen || !currentSong) return null;

  const currentLyricsObj = currentSong.lyrics?.find((l) => l.language === activeLyricsLanguage);
  const lyricsText: string =
    currentLyricsObj?.lyrics ||
    (currentLyricsObj as any)?.text ||
    currentSong.lyrics?.[0]?.lyrics ||
    (currentSong.lyrics?.[0] as any)?.text ||
    `नमामीश्वरं सच्चिदानन्दरूपं\nलसत्कुण्डलं गोकुले भ्राजमानम्।\nयशोदाभियोलूखलाद्धावमानं\nपरामृष्टमत्यन्ततो द्रुत्य गोप्या॥१॥\n\nरुदन्तं मुहुर्नेत्रयुग्मं मृजन्तं\nकराम्भोजयुग्मेन सातङ्कनेत्रम्।\nमुहुः श्वासकम्पत्रिरेखाङ्ककण्ठ-\nस्थितग्रैवं दामोदरं भक्तिबद्धम्॥२॥`;

  const handleCopy = () => {
    navigator.clipboard.writeText(lyricsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 shadow-2xl border border-[var(--gold-border)] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--gold-border)]">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-[var(--gold-primary)]">
              {currentSong.title}
            </h3>
            {currentSong.hindi_title && (
              <p className="font-devanagari text-xs text-[var(--text-muted)]">
                {currentSong.hindi_title}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Language switch */}
            <div className="flex items-center bg-[var(--maroon-pill)] p-1 rounded-full border border-[var(--gold-border)]">
              {(['hi', 'en', 'hinglish'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLyricsLanguage(lang as any)}
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold transition-all ${
                    activeLyricsLanguage === lang
                      ? 'bronze-pill text-white'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {lang === 'hi' ? 'हिंदी' : lang === 'en' ? 'English' : 'Hinglish'}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="p-2 rounded-full bg-[#1D0F12] border border-[#E5C378]/20 text-[#E5C378] hover:bg-[#2C1418] transition-all"
              title="Copy Lyrics"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={closeLyricsModal}
              className="p-2 rounded-full text-[#A89A8A] hover:text-[#F8F5EE] hover:bg-[#2A1417]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto mt-4 pr-2 space-y-4 font-devanagari text-base leading-relaxed text-[#FFF6DD]">
          {lyricsText.split('\n\n').map((stanza: string, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#1A0D10]/80 border border-[#E5C378]/10 hover:border-[#E5C378]/30 transition-all"
            >
              <pre className="whitespace-pre-wrap font-inherit text-[#F8F5EE]">
                {stanza}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
