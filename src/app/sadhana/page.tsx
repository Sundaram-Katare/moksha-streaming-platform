'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Moon,
  Sun,
  Shield,
} from 'lucide-react';
import { usePlayer } from '@/features/player/PlayerContext';

export default function SadhanaPage() {
  const {
    japaCount,
    incrementJapa,
    resetJapa,
    isTanpuraActive,
    toggleTanpura,
    tanpuraVolume,
    setTanpuraVolume,
    audioTuning,
    setAudioTuning,
    play,
  } = usePlayer();

  const [targetCycles, setTargetCycles] = useState(108);

  const japaPercentage = Math.min(100, Math.round((japaCount / targetCycles) * 100));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5C378]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#381419] border border-[#58242A] mb-2">
            <Flame className="w-3.5 h-3.5 text-[#E5C378]" />
            <span className="text-[10px] font-bold tracking-wider text-[#E5C378] uppercase">
              DAILY SADHANA COMPANION
            </span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-[#F8F5EE]">
            Sadhana &amp; Japa Meditation
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#A89A8A] max-w-md md:text-right">
          Cultivate unbroken presence through 108 sacred repetitions, 432Hz harmonic drone layers, and synchronized Vedic japa.
        </p>
      </div>

      {/* Main Grid: 108 Bead Mala Counter + Drone Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 108 Japa Counter (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-10 border border-[#E5C378]/25 shadow-2xl flex flex-col items-center text-center space-y-8">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-[#E5C378] uppercase">
              SACRED JAPA MALA
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F8F5EE]">
              108 Repetition Cycle
            </h3>
          </div>

          {/* Big Interactive Bead Circle */}
          <div
            onClick={incrementJapa}
            className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-[#2D1619] bg-[#160B0D] flex flex-col items-center justify-center cursor-pointer select-none hover:border-[#E5C378]/40 shadow-2xl transition-all group active:scale-95"
            title="Click or Tap to Count Bead"
          >
            {/* SVG Progress Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                fill="none"
                stroke="#E5C378"
                strokeWidth="6"
                strokeDasharray="750"
                strokeDashoffset={750 - (750 * japaCount) / targetCycles}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>

            {/* Center Count */}
            <span className="font-cinzel text-5xl sm:text-6xl font-black text-[#E5C378] group-hover:scale-105 transition-transform">
              {japaCount}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#A89A8A] font-semibold mt-1">
              / {targetCycles} BEADS
            </span>
            <span className="text-[11px] text-[#F87171] font-bold mt-2">
              {japaPercentage}% Completed
            </span>
          </div>

          {/* Counter Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={incrementJapa}
              className="px-8 py-3 rounded-full bg-[#E5C378] hover:bg-[#F7D78A] text-[#12090A] font-bold text-sm shadow-xl shadow-[#E5C378]/25 hover:scale-105 active:scale-95 transition-all"
            >
              + Tap Japa Bead
            </button>

            <button
              onClick={resetJapa}
              className="flex items-center gap-1.5 px-5 py-3 rounded-full bg-[#1F1013] hover:bg-[#2F1418] border border-[#E5C378]/25 text-[#C5BAAD] text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Counter</span>
            </button>
          </div>

          {/* Quick Sadhana Stotram Launcher */}
          <div className="w-full pt-4 border-t border-[#E5C378]/15 text-left flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#A89A8A] uppercase tracking-wider">
              SACRED JAPA RESONANCE
            </span>
            <Link
              href="/explore"
              className="text-xs font-semibold text-[#E5C378] hover:underline"
            >
              Explore Sanctuary Tracks &rarr;
            </Link>
          </div>
        </div>

        {/* Right Column: 432Hz Drone Generator & Streak Status (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tanpura & Drone Generator Box */}
          <div className="glass-panel rounded-3xl p-6 border border-[#E5C378]/20 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5C378]/15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E5C378]" />
                <h3 className="font-cinzel text-base font-bold text-[#F8F5EE]">
                  Nadabrahma Drone Layer
                </h3>
              </div>
              <button
                onClick={toggleTanpura}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                  isTanpuraActive
                    ? 'bg-[#381419] text-[#E5C378] border-[#A83244]'
                    : 'bg-[#180D0F] text-[#8E8275] border-[#E5C378]/20'
                }`}
              >
                {isTanpuraActive ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#C5BAAD]">Harmonic Tuning Frequency:</span>
                <select
                  value={audioTuning}
                  onChange={(e) => setAudioTuning(e.target.value as any)}
                  className="bg-[#180D0F] text-[#E5C378] border border-[#E5C378]/20 rounded-full px-3 py-1 text-xs focus:outline-none"
                >
                  <option value="432Hz">432Hz (Cosmic Natural)</option>
                  <option value="528Hz">528Hz (Miracle DNA)</option>
                  <option value="Standard 440Hz">440Hz (Standard Concert)</option>
                </select>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs text-[#A89A8A]">
                  <span>Tanpura Resonance Level</span>
                  <span>{Math.round(tanpuraVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={tanpuraVolume}
                  onChange={(e) => setTanpuraVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#2A1518] accent-[#E5C378] rounded-full cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Sadhana Streak & Devotee Tier Card */}
          <div className="glass-panel rounded-3xl p-6 border border-[#E5C378]/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5C378]/15">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#E5C378]" />
                <h3 className="font-cinzel text-base font-bold text-[#F8F5EE]">
                  Consecrated Devotee Streak
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#3D141A] border border-[#E5C378]/30 text-[10px] font-bold text-[#E5C378]">
                Devotee Tier I
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#170C0E] border border-[#E5C378]/15">
                <span className="font-cinzel text-2xl font-bold text-[#E5C378] block">
                  19
                </span>
                <span className="text-[10px] text-[#A89A8A] uppercase">
                  Consecutive Days
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#170C0E] border border-[#E5C378]/15">
                <span className="font-cinzel text-2xl font-bold text-[#F8F5EE] block">
                  38.4h
                </span>
                <span className="text-[10px] text-[#A89A8A] uppercase">
                  Hours Listened
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
