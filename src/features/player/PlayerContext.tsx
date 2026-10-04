'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Song, LyricLanguage } from '@/types';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  queue: Song[];
  currentIndex: number;
  isShuffled: boolean;
  isLooping: boolean;
  isLoop108Active: boolean;
  japaCount: number;
  isTanpuraActive: boolean;
  tanpuraVolume: number;
  audioTuning: '432Hz' | '528Hz' | 'Standard 440Hz';
  isFullPlayerOpen: boolean;
  isLyricsModalOpen: boolean;
  activeLyricsLanguage: LyricLanguage;
  isBottomPlayerDismissed: boolean;

  // Actions
  play: (song?: Song, customQueue?: Song[]) => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  toggleLoop108: () => void;
  incrementJapa: () => void;
  resetJapa: () => void;
  toggleTanpura: () => void;
  setTanpuraVolume: (val: number) => void;
  setAudioTuning: (tuning: '432Hz' | '528Hz' | 'Standard 440Hz') => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  toggleFullPlayer: () => void;
  openLyricsModal: () => void;
  closeLyricsModal: () => void;
  toggleLyricsModal: () => void;
  setActiveLyricsLanguage: (lang: LyricLanguage) => void;
  addToQueue: (song: Song) => void;
  dismissBottomPlayer: () => void;
  restoreBottomPlayer: () => void;
  toggleBottomPlayer: () => void;
  closeCurrentSong: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isLoop108Active, setIsLoop108Active] = useState<boolean>(false);
  const [japaCount, setJapaCount] = useState<number>(0);
  const [isTanpuraActive, setIsTanpuraActive] = useState<boolean>(false);
  const [tanpuraVolume, setTanpuraVolumeState] = useState<number>(0.4);
  const [audioTuning, setAudioTuning] = useState<'432Hz' | '528Hz' | 'Standard 440Hz'>('432Hz');
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState<boolean>(false);
  const [activeLyricsLanguage, setActiveLyricsLanguage] = useState<LyricLanguage>('hi');
  const [isBottomPlayerDismissed, setIsBottomPlayerDismissed] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tanpuraAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize main audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const tanpura = new Audio();
    tanpura.loop = true;
    tanpura.src = '/audio/tanpura-drone.mp3';
    tanpura.volume = 0.4;
    tanpuraAudioRef.current = tanpura;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (isLoop108Active) {
        setJapaCount((prev) => {
          const nextCount = prev + 1;
          if (nextCount < 108) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
            return nextCount;
          } else {
            setIsPlaying(false);
            return 108;
          }
        });
      } else if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        next();
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      tanpura.pause();
    };
  }, [isLoop108Active, isLooping]);

  // Handle current song audio source change
  useEffect(() => {
    if (audioRef.current && currentSong?.audio_url) {
      audioRef.current.src = currentSong.audio_url;
      if (currentSong.duration_seconds) {
        setDuration(currentSong.duration_seconds);
      }
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Auto-play might be restricted by browser policy
        });
      }
    }
  }, [currentSong]);

  // Tanpura ambient drone state synchronization
  useEffect(() => {
    if (tanpuraAudioRef.current) {
      tanpuraAudioRef.current.volume = isMuted ? 0 : tanpuraVolume;
      if (isTanpuraActive && isPlaying) {
        tanpuraAudioRef.current.play().catch(() => {});
      } else {
        tanpuraAudioRef.current.pause();
      }
    }
  }, [isTanpuraActive, isPlaying, tanpuraVolume, isMuted]);

  const play = (song?: Song, customQueue?: Song[]) => {
    if (customQueue && customQueue.length > 0) {
      setQueue(customQueue);
    }
    if (song) {
      setCurrentSong(song);
      const idx = (customQueue || queue).findIndex((s) => s.id === song.id);
      if (idx !== -1) setCurrentIndex(idx);
    }
    setIsBottomPlayerDismissed(false); // Auto restore player on new play
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const pause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentSong) {
        play(currentSong);
      } else if (queue.length > 0) {
        play(queue[0]);
      }
    }
  };

  const next = () => {
    if (queue.length === 0) return;
    let nextIdx = currentIndex + 1;
    if (isShuffled) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      nextIdx = 0;
    }
    setCurrentIndex(nextIdx);
    setCurrentSong(queue[nextIdx]);
    setIsPlaying(true);
  };

  const previous = () => {
    if (queue.length === 0) return;
    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    setCurrentIndex(prevIdx);
    setCurrentSong(queue[prevIdx]);
    setIsPlaying(true);
  };

  const seek = (seconds: number) => {
    setCurrentTime(seconds);
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume || 0.8;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const toggleShuffle = () => setIsShuffled((prev) => !prev);
  const toggleLoop = () => setIsLooping((prev) => !prev);
  const toggleLoop108 = () => setIsLoop108Active((prev) => !prev);
  const incrementJapa = () => setJapaCount((prev) => (prev >= 108 ? 108 : prev + 1));
  const resetJapa = () => setJapaCount(0);

  const toggleTanpura = () => setIsTanpuraActive((prev) => !prev);
  const setTanpuraVolume = (val: number) => setTanpuraVolumeState(val);

  const openFullPlayer = () => setIsFullPlayerOpen(true);
  const closeFullPlayer = () => setIsFullPlayerOpen(false);
  const toggleFullPlayer = () => setIsFullPlayerOpen((prev) => !prev);

  const openLyricsModal = () => setIsLyricsModalOpen(true);
  const closeLyricsModal = () => setIsLyricsModalOpen(false);
  const toggleLyricsModal = () => setIsLyricsModalOpen((prev) => !prev);

  const addToQueue = (song: Song) => {
    setQueue((prev) => [...prev, song]);
  };

  const dismissBottomPlayer = () => {
    setIsBottomPlayerDismissed(true);
  };

  const restoreBottomPlayer = () => {
    setIsBottomPlayerDismissed(false);
  };

  const toggleBottomPlayer = () => {
    setIsBottomPlayerDismissed((prev) => !prev);
  };

  const closeCurrentSong = () => {
    pause();
    setCurrentSong(null);
    setIsBottomPlayerDismissed(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        duration,
        currentTime,
        volume,
        isMuted,
        queue,
        currentIndex,
        isShuffled,
        isLooping,
        isLoop108Active,
        japaCount,
        isTanpuraActive,
        tanpuraVolume,
        audioTuning,
        isFullPlayerOpen,
        isLyricsModalOpen,
        activeLyricsLanguage,
        isBottomPlayerDismissed,
        play,
        pause,
        togglePlay,
        next,
        previous,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleLoop,
        toggleLoop108,
        incrementJapa,
        resetJapa,
        toggleTanpura,
        setTanpuraVolume,
        setAudioTuning,
        openFullPlayer,
        closeFullPlayer,
        toggleFullPlayer,
        openLyricsModal,
        closeLyricsModal,
        toggleLyricsModal,
        setActiveLyricsLanguage,
        addToQueue,
        dismissBottomPlayer,
        restoreBottomPlayer,
        toggleBottomPlayer,
        closeCurrentSong,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
