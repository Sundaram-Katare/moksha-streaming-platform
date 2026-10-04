export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'user' | 'admin';
export type SongStatus = 'draft' | 'published' | 'archived';
export type LyricLanguage = 'hi' | 'hinglish' | 'sa' | 'en';
export type CommentStatus = 'published' | 'pending' | 'hidden' | 'deleted';
export type PlatformType = 'youtube' | 'spotify' | 'apple_music' | 'amazon_music' | 'jiosaavn' | 'wynk' | 'other';
export type SyncStatusType = 'pending' | 'synced' | 'failed' | 'ignored';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          devotee_tier: string | null;
          sadhana_streak_days: number;
          total_meditation_minutes: number;
          preferred_tuning: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          devotee_tier?: string | null;
          sadhana_streak_days?: number;
          total_meditation_minutes?: number;
          preferred_tuning?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          devotee_tier?: string | null;
          sadhana_streak_days?: number;
          total_meditation_minutes?: number;
          preferred_tuning?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          hindi_name: string | null;
          slug: string;
          description: string | null;
          tagline: string | null;
          image_url: string | null;
          accent_color: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          hindi_name?: string | null;
          slug: string;
          description?: string | null;
          tagline?: string | null;
          image_url?: string | null;
          accent_color?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          hindi_name?: string | null;
          slug?: string;
          description?: string | null;
          tagline?: string | null;
          image_url?: string | null;
          accent_color?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      songs: {
        Row: {
          id: string;
          title: string;
          hindi_title: string | null;
          slug: string;
          description: string | null;
          artist: string;
          raag: string | null;
          tala: string | null;
          deity_focus: string | null;
          master_tape_number: string | null;
          acoustic_notes: string | null;
          thumbnail_url: string;
          audio_url: string | null;
          youtube_video_id: string | null;
          youtube_url: string | null;
          duration_seconds: number;
          plays_count: number;
          audio_format: string;
          is_featured: boolean;
          is_daily_darshan: boolean;
          is_fresh_consecration: boolean;
          status: SongStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          hindi_title?: string | null;
          slug: string;
          description?: string | null;
          artist: string;
          raag?: string | null;
          tala?: string | null;
          deity_focus?: string | null;
          master_tape_number?: string | null;
          acoustic_notes?: string | null;
          thumbnail_url: string;
          audio_url?: string | null;
          youtube_video_id?: string | null;
          youtube_url?: string | null;
          duration_seconds?: number;
          plays_count?: number;
          audio_format?: string;
          is_featured?: boolean;
          is_daily_darshan?: boolean;
          is_fresh_consecration?: boolean;
          status?: SongStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          hindi_title?: string | null;
          slug?: string;
          description?: string | null;
          artist?: string;
          raag?: string | null;
          tala?: string | null;
          deity_focus?: string | null;
          master_tape_number?: string | null;
          acoustic_notes?: string | null;
          thumbnail_url?: string;
          audio_url?: string | null;
          youtube_video_id?: string | null;
          youtube_url?: string | null;
          duration_seconds?: number;
          plays_count?: number;
          audio_format?: string;
          is_featured?: boolean;
          is_daily_darshan?: boolean;
          is_fresh_consecration?: boolean;
          status?: SongStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      song_lyrics: {
        Row: {
          id: string;
          song_id: string;
          language: LyricLanguage;
          lyrics: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          song_id: string;
          language: LyricLanguage;
          lyrics: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          song_id?: string;
          language?: LyricLanguage;
          lyrics?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      song_categories: {
        Row: {
          song_id: string;
          category_id: string;
        };
        Insert: {
          song_id: string;
          category_id: string;
        };
        Update: {
          song_id?: string;
          category_id?: string;
        };
      };
      song_likes: {
        Row: {
          id: string;
          song_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          song_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          song_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          song_id: string;
          user_id: string;
          content: string;
          parent_id: string | null;
          status: CommentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          song_id: string;
          user_id: string;
          content: string;
          parent_id?: string | null;
          status?: CommentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          song_id?: string;
          user_id?: string;
          content?: string;
          parent_id?: string | null;
          status?: CommentStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      playlists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          cover_url: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          cover_url?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          cover_url?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      playlist_songs: {
        Row: {
          id: string;
          playlist_id: string;
          song_id: string;
          position: number;
          added_at: string;
        };
        Insert: {
          id?: string;
          playlist_id: string;
          song_id: string;
          position?: number;
          added_at?: string;
        };
        Update: {
          id?: string;
          playlist_id?: string;
          song_id?: string;
          position?: number;
          added_at?: string;
        };
      };
      song_platform_links: {
        Row: {
          id: string;
          song_id: string;
          platform: PlatformType;
          url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          song_id: string;
          platform: PlatformType;
          url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          song_id?: string;
          platform?: PlatformType;
          url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      youtube_sync_items: {
        Row: {
          id: string;
          youtube_video_id: string;
          youtube_playlist_id: string | null;
          song_id: string | null;
          youtube_title: string;
          youtube_description: string | null;
          youtube_thumbnail: string | null;
          youtube_published_at: string | null;
          sync_status: SyncStatusType;
          error_message: string | null;
          last_synced_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          youtube_video_id: string;
          youtube_playlist_id?: string | null;
          song_id?: string | null;
          youtube_title: string;
          youtube_description?: string | null;
          youtube_thumbnail?: string | null;
          youtube_published_at?: string | null;
          sync_status?: SyncStatusType;
          error_message?: string | null;
          last_synced_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          youtube_video_id?: string;
          youtube_playlist_id?: string | null;
          song_id?: string | null;
          youtube_title?: string;
          youtube_description?: string | null;
          youtube_thumbnail?: string | null;
          youtube_published_at?: string | null;
          sync_status?: SyncStatusType;
          error_message?: string | null;
          last_synced_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
