'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Flame, Clock, Radio, Sparkles, Shield, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { usePlayer } from '@/features/player/PlayerContext';

export default function ProfilePage() {
  const { user, profile, signOut, isLoading } = useAuth();
  const { audioTuning, setAudioTuning } = usePlayer();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--gold-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="glass-panel max-w-md w-full rounded-3xl p-8 border border-[var(--gold-border)] text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[var(--maroon-pill)] mx-auto flex items-center justify-center text-[var(--gold-primary)]">
            <User className="w-8 h-8 opacity-70" />
          </div>
          <div className="space-y-1">
            <h1 className="font-cinzel text-2xl font-bold text-[var(--text-primary)]">
              Devotee Profile
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Sign in to view your profile, manage your sadhana preferences, and see your playlists.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bronze-pill hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[var(--gold-primary)]/20 hover:scale-105 active:scale-95 transition-all"
          >
            <LogIn className="w-4 h-4 text-white" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
      {/* Header Profile Card */}
      <div className="glass-panel rounded-3xl p-8 border border-[#E5C378]/30 shadow-2xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#E5C378] shadow-xl shadow-[#E5C378]/20 shrink-0 bg-[var(--maroon-pill)] flex items-center justify-center text-[var(--gold-primary)] font-bold text-2xl">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Profile Avatar"
              fill
              className="object-cover"
            />
          ) : (
            <span>{(profile?.display_name || user.email || 'D')[0].toUpperCase()}</span>
          )}
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-cinzel text-2xl font-bold text-[#F8F5EE]">
              {profile?.display_name || user.email?.split('@')[0]}
            </h1>
            {profile?.role === 'admin' ? (
              <span className="px-3 py-0.5 rounded-full bg-[#381419] border border-[var(--gold-border)] text-[10px] font-bold text-[#E5C378] flex items-center gap-1">
                <Shield className="w-3 h-3" /> Sanctuary Admin
              </span>
            ) : (
              <span className="px-3 py-0.5 rounded-full bg-[#381419] border border-[#58242A] text-[10px] font-bold text-[#E5C378]">
                {profile?.devotee_tier || 'Devotee Tier I'}
              </span>
            )}
          </div>
          <p className="text-xs text-[#A89A8A]">
            {user.email} • Sanctuary Devotee
          </p>
        </div>

        <button
          onClick={signOut}
          className="px-4 py-2 rounded-full bg-[#2A1215] hover:bg-[#3D141A] border border-[#A83244]/40 text-xs font-semibold text-[#F87171] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Preferences Section */}
      <div className="glass-panel rounded-3xl p-6 border border-[#E5C378]/20 space-y-4">
        <h3 className="font-cinzel text-base font-bold text-[#E5C378] pb-2 border-b border-[#E5C378]/15">
          Devotee Acoustic Preferences
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div>
            <p className="text-xs font-semibold text-[#F8F5EE]">
              Default Acoustic Tuning Pitch
            </p>
            <p className="text-[11px] text-[#A89A8A]">
              Choose the base harmonic frequency for all stotram playback.
            </p>
          </div>

          <select
            value={audioTuning}
            onChange={(e) => setAudioTuning(e.target.value as any)}
            className="bg-[#1A0D0E] text-[#E5C378] border border-[#E5C378]/30 rounded-xl px-4 py-2 text-xs focus:outline-none cursor-pointer"
          >
            <option value="432Hz">432Hz (Sacred Cosmic Pitch)</option>
            <option value="528Hz">528Hz (Solfeggio Frequency)</option>
            <option value="Standard 440Hz">440Hz (Standard Concert)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
