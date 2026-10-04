import { Database, LyricLanguage, UserRole, SongStatus, CommentStatus, PlatformType, SyncStatusType } from './database';
export type { UserRole, SongStatus, LyricLanguage, CommentStatus, PlatformType, SyncStatusType, Database };

export type Song = Database['public']['Tables']['songs']['Row'] & {
  categories?: Category[];
  lyrics?: SongLyric[];
  platform_links?: SongPlatformLink[];
  likes_count?: number;
  user_has_liked?: boolean;
};

export type Category = Database['public']['Tables']['categories']['Row'];
export type SongLyric = Database['public']['Tables']['song_lyrics']['Row'];
export type SongLike = Database['public']['Tables']['song_likes']['Row'];
export type Playlist = Database['public']['Tables']['playlists']['Row'] & {
  song_count?: number;
  songs?: Song[];
};
export type PlaylistSong = Database['public']['Tables']['playlist_songs']['Row'];
export type SongPlatformLink = Database['public']['Tables']['song_platform_links']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'] & {
  profile?: Profile;
  replies?: Comment[];
};
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type YouTubeSyncItem = Database['public']['Tables']['youtube_sync_items']['Row'];

export interface PlayerState {
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
}

export interface DivineCardConfig {
  song: Song;
  selectedVerse: string;
  hindiTitle: string;
  format: 'story' | 'square' | 'banner';
  theme: 'sacred-maroon' | 'golden-temple' | 'midnight-shiva' | 'vrindavan-forest';
  showQrCode: boolean;
  customQuote?: string;
}

export interface ActiveListeningStats {
  activeDevoteesCount: number;
  vedicChantsPercentage: number;
  meditativeRagaPercentage: number;
  templeKirtanPercentage: number;
  currentMuhurta: string;
  timezone: string;
}
