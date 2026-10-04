-- ============================================================
-- MOKSHA MUSIC PLATFORM — DATABASE SEED SCRIPT (CLEAN)
-- File: supabase/seed.sql
-- ============================================================

-- TRUNCATE TABLES TO REMOVE ANY STALE DUMMY DATA
TRUNCATE TABLE public.playlist_songs CASCADE;
TRUNCATE TABLE public.song_categories CASCADE;
TRUNCATE TABLE public.song_lyrics CASCADE;
TRUNCATE TABLE public.song_platform_links CASCADE;
TRUNCATE TABLE public.comments CASCADE;
TRUNCATE TABLE public.song_likes CASCADE;
TRUNCATE TABLE public.songs CASCADE;

-- Categories (Lineages)
INSERT INTO public.categories (id, name, hindi_name, slug, description, tagline, display_order) VALUES
('11111111-1111-1111-1111-111111111101', 'Krishna', 'श्री कृष्ण', 'krishna', 'Sacred flutes, ecstatic Raas Leela hymns, and Vrindavan kirtans.', 'PREM & ANAND', 1),
('11111111-1111-1111-1111-111111111102', 'Mahadeva Shiva', 'महादेव शिव', 'shiva', 'Primordial damru beats, cosmic Tandava stotrams, and deep Himalayan meditative stillness.', 'DHYAN & VAIRAGYA', 2),
('11111111-1111-1111-1111-111111111103', 'Shri Ram', 'श्री राम', 'ram', 'Sattvic chants, Maryada Purushottam bhajans, and transcendent Ramanama japa.', 'MARYADA & SHANTI', 3),
('11111111-1111-1111-1111-111111111104', 'Durga & Devi', 'माँ दुर्गा एवं देवी', 'durga', 'Shakti kavachs, Mahishasuramardini stotras, Lalita Sahasranama, and roaring temple aartis.', 'SHAKTI & TEJ', 4),
('11111111-1111-1111-1111-111111111105', 'Mahavira Hanuman', 'महावीर हनुमान', 'hanuman', 'Awakening Sankat Mochan stotras, slow meditative Chalisas, and Bajrang Baan in classical Awadhi.', 'BHAKTI & SANKALP', 5),
('11111111-1111-1111-1111-111111111106', 'Ganesh', 'श्री गणेश', 'ganesh', 'Vighnaharta Atharvashirsha, Modak Priya stutis, and sacred morning invocations.', 'MANGAL & SIDDHI', 6)
ON CONFLICT (id) DO NOTHING;

-- Songs are added dynamically via Admin Dashboard!
