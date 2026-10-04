'use client';

import React from 'react';
import { Sparkles, Volume2, X } from 'lucide-react';
import { usePlayer } from '@/features/player/PlayerContext';

export function AmbientDroneOverlay() {
  const { isTanpuraActive, toggleTanpura, tanpuraVolume, setTanpuraVolume, audioTuning } = usePlayer();

  if (!isTanpuraActive) return null;

  return (
    <div className="fixed top-20 right-4 lg:right-10 z-30 flex items-center gap-3 px-4 py-2 rounded-2xl glass-panel border border-[#A83244]/40 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C378] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E5C378]" />
        </span>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#E5C378] tracking-wider uppercase">
            C# Tanpura Drone Active
          </span>
          <span className="text-[9px] text-[#A89A8A]">
            {audioTuning} Resonance Layer
          </span>
        </div>
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-1.5 pl-2 border-l border-[#E5C378]/20">
        <Volume2 className="w-3.5 h-3.5 text-[#E5C378]" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={tanpuraVolume}
          onChange={(e) => setTanpuraVolume(parseFloat(e.target.value))}
          className="w-14 h-1 bg-[#2A1518] accent-[#E5C378] rounded-full cursor-pointer"
        />
      </div>

      <button
        onClick={toggleTanpura}
        className="p-1 text-[#A89A8A] hover:text-[#F8F5EE] rounded-full hover:bg-[#2A1417]"
        title="Stop Tanpura"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
