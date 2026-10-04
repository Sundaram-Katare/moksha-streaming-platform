-- ============================================================
-- MOKSHA MUSIC — DATABASE DUMMY DATA CLEANUP SCRIPT
-- Run this script in the Supabase SQL Editor to wipe all dummy data.
-- ============================================================

-- 1. Wipe all relational dependencies
TRUNCATE TABLE public.playlist_songs CASCADE;
TRUNCATE TABLE public.song_categories CASCADE;
TRUNCATE TABLE public.song_lyrics CASCADE;
TRUNCATE TABLE public.song_platform_links CASCADE;
TRUNCATE TABLE public.comments CASCADE;
TRUNCATE TABLE public.song_likes CASCADE;
TRUNCATE TABLE public.youtube_sync_items CASCADE;

-- 2. Wipe dummy songs
TRUNCATE TABLE public.songs CASCADE;

-- 3. (Optional) Wipe playlists
-- TRUNCATE TABLE public.playlists CASCADE;

-- ============================================================
-- NOTE ON ADMIN CREATION:
-- To make any registered user an administrator, run:
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<USER_UUID>';
-- ============================================================
