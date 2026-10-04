-- ============================================================
-- MOKSHA MUSIC PLATFORM — MASTER DATABASE SCHEMA
-- File: supabase/schema.sql
-- ============================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE song_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE lyric_language AS ENUM ('hi', 'hinglish', 'sa', 'en');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE comment_status AS ENUM ('published', 'pending', 'hidden', 'deleted');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE platform_type AS ENUM ('youtube', 'spotify', 'apple_music', 'amazon_music', 'jiosaavn', 'wynk', 'other');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE sync_status_type AS ENUM ('pending', 'synced', 'failed', 'ignored');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- 2. HELPER FUNCTIONS & TRIGGERS
-- ============================================================

-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if the current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. TABLES
-- ============================================================

------------------------------------------------------------
-- PROFILES
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'user',
  devotee_tier TEXT DEFAULT 'Devotee Tier I',
  sadhana_streak_days INTEGER DEFAULT 0,
  total_meditation_minutes INTEGER DEFAULT 0,
  preferred_tuning TEXT DEFAULT '432Hz',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Auto create profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

------------------------------------------------------------
-- CATEGORIES / DEITIES
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  hindi_name TEXT,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  tagline TEXT,
  image_url TEXT,
  accent_color TEXT DEFAULT '#E5C378',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

------------------------------------------------------------
-- SONGS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  hindi_title TEXT,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  artist TEXT NOT NULL,
  raag TEXT,
  tala TEXT,
  deity_focus TEXT,
  master_tape_number TEXT,
  acoustic_notes TEXT,
  thumbnail_url TEXT NOT NULL,
  audio_url TEXT,
  youtube_video_id TEXT,
  youtube_url TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  plays_count INTEGER DEFAULT 0,
  audio_format TEXT DEFAULT 'Lossless 24-Bit / 96kHz',
  is_featured BOOLEAN DEFAULT FALSE,
  is_daily_darshan BOOLEAN DEFAULT FALSE,
  is_fresh_consecration BOOLEAN DEFAULT FALSE,
  status song_status NOT NULL DEFAULT 'published',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_songs_slug ON public.songs(slug);
CREATE INDEX IF NOT EXISTS idx_songs_status ON public.songs(status);
CREATE INDEX IF NOT EXISTS idx_songs_published_at ON public.songs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_songs_is_featured ON public.songs(is_featured);
CREATE INDEX IF NOT EXISTS idx_songs_plays_count ON public.songs(plays_count DESC);

DROP TRIGGER IF EXISTS update_songs_updated_at ON public.songs;
CREATE TRIGGER update_songs_updated_at
  BEFORE UPDATE ON public.songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

------------------------------------------------------------
-- SONG LYRICS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.song_lyrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  language lyric_language NOT NULL,
  lyrics TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  CONSTRAINT unique_song_language UNIQUE (song_id, language)
);

CREATE INDEX IF NOT EXISTS idx_song_lyrics_song_id ON public.song_lyrics(song_id);

DROP TRIGGER IF EXISTS update_song_lyrics_updated_at ON public.song_lyrics;
CREATE TRIGGER update_song_lyrics_updated_at
  BEFORE UPDATE ON public.song_lyrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

------------------------------------------------------------
-- SONG CATEGORIES (Many-to-Many)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.song_categories (
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_song_categories_category ON public.song_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_song_categories_song ON public.song_categories(song_id);

------------------------------------------------------------
-- SONG LIKES
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.song_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  CONSTRAINT unique_user_song_like UNIQUE (user_id, song_id)
);

CREATE INDEX IF NOT EXISTS idx_song_likes_song_id ON public.song_likes(song_id);
CREATE INDEX IF NOT EXISTS idx_song_likes_user_id ON public.song_likes(user_id);

------------------------------------------------------------
-- COMMENTS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  status comment_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_song_id ON public.comments(song_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);

DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

------------------------------------------------------------
-- PLAYLISTS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON public.playlists(user_id);

DROP TRIGGER IF EXISTS update_playlists_updated_at ON public.playlists;
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

------------------------------------------------------------
-- PLAYLIST SONGS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.playlist_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  CONSTRAINT unique_playlist_song UNIQUE (playlist_id, song_id)
);

CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON public.playlist_songs(playlist_id, position ASC);

------------------------------------------------------------
-- SONG PLATFORM LINKS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.song_platform_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  CONSTRAINT unique_song_platform UNIQUE (song_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_song_platform_links_song_id ON public.song_platform_links(song_id);

------------------------------------------------------------
-- YOUTUBE SYNC ITEMS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.youtube_sync_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_video_id TEXT NOT NULL UNIQUE,
  youtube_playlist_id TEXT,
  song_id UUID REFERENCES public.songs(id) ON DELETE SET NULL,
  youtube_title TEXT NOT NULL,
  youtube_description TEXT,
  youtube_thumbnail TEXT,
  youtube_published_at TIMESTAMP WITH TIME ZONE,
  sync_status sync_status_type NOT NULL DEFAULT 'pending',
  error_message TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_youtube_sync_status ON public.youtube_sync_items(sync_status);

DROP TRIGGER IF EXISTS update_youtube_sync_items_updated_at ON public.youtube_sync_items;
CREATE TRIGGER update_youtube_sync_items_updated_at
  BEFORE UPDATE ON public.youtube_sync_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_lyrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_platform_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_sync_items ENABLE ROW LEVEL SECURITY;

------------------------------------------------------------
-- PROFILES POLICIES
------------------------------------------------------------
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

------------------------------------------------------------
-- CATEGORIES POLICIES
------------------------------------------------------------
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert/update/delete categories" 
  ON public.categories FOR ALL 
  USING (is_admin());

------------------------------------------------------------
-- SONGS POLICIES
------------------------------------------------------------
CREATE POLICY "Published songs are viewable by everyone" 
  ON public.songs FOR SELECT 
  USING (status = 'published' OR is_admin());

CREATE POLICY "Admins can manage songs" 
  ON public.songs FOR ALL 
  USING (is_admin());

------------------------------------------------------------
-- SONG LYRICS POLICIES
------------------------------------------------------------
CREATE POLICY "Published song lyrics are viewable by everyone" 
  ON public.song_lyrics FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.songs 
      WHERE songs.id = song_lyrics.song_id 
      AND (songs.status = 'published' OR is_admin())
    )
  );

CREATE POLICY "Admins can manage lyrics" 
  ON public.song_lyrics FOR ALL 
  USING (is_admin());

------------------------------------------------------------
-- SONG CATEGORIES POLICIES
------------------------------------------------------------
CREATE POLICY "Song categories are viewable by everyone" 
  ON public.song_categories FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage song categories" 
  ON public.song_categories FOR ALL 
  USING (is_admin());

------------------------------------------------------------
-- SONG LIKES POLICIES
------------------------------------------------------------
CREATE POLICY "Likes are viewable by everyone" 
  ON public.song_likes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can toggle like for themselves" 
  ON public.song_likes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own like" 
  ON public.song_likes FOR DELETE 
  USING (auth.uid() = user_id);

------------------------------------------------------------
-- COMMENTS POLICIES
------------------------------------------------------------
CREATE POLICY "Published comments are viewable by everyone" 
  ON public.comments FOR SELECT 
  USING (status = 'published' OR auth.uid() = user_id OR is_admin());

CREATE POLICY "Authenticated users can create comments" 
  ON public.comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit their own comments" 
  ON public.comments FOR UPDATE 
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can delete their own comments" 
  ON public.comments FOR DELETE 
  USING (auth.uid() = user_id OR is_admin());

------------------------------------------------------------
-- PLAYLISTS POLICIES
------------------------------------------------------------
CREATE POLICY "Users can view public playlists or their own" 
  ON public.playlists FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id OR is_admin());

CREATE POLICY "Authenticated users can create their own playlists" 
  ON public.playlists FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" 
  ON public.playlists FOR UPDATE 
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can delete their own playlists" 
  ON public.playlists FOR DELETE 
  USING (auth.uid() = user_id OR is_admin());

------------------------------------------------------------
-- PLAYLIST SONGS POLICIES
------------------------------------------------------------
CREATE POLICY "Users can view songs in accessible playlists" 
  ON public.playlist_songs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists 
      WHERE playlists.id = playlist_songs.playlist_id 
      AND (playlists.is_public = true OR playlists.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Users can manage songs in their own playlists" 
  ON public.playlist_songs FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists 
      WHERE playlists.id = playlist_songs.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

------------------------------------------------------------
-- SONG PLATFORM LINKS POLICIES
------------------------------------------------------------
CREATE POLICY "Platform links are viewable by everyone" 
  ON public.song_platform_links FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage platform links" 
  ON public.song_platform_links FOR ALL 
  USING (is_admin());

------------------------------------------------------------
-- YOUTUBE SYNC POLICIES
------------------------------------------------------------
CREATE POLICY "Admins can view and manage youtube sync" 
  ON public.youtube_sync_items FOR ALL 
  USING (is_admin());
