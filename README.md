# Moksha Music (मोक्ष संगीत) — Sanctuary of Sound

> **जहाँ भक्ति संगीत बन जाती है**
> Lossless master recordings of Bhajans, Vedic Stotrams, Aartis, and Meditative Ragas crafted in pristine 432Hz sacred acoustic tuning for deep inner stillness.

---

## 🌟 Features & Design Specifications

- **Pixel-Close Visual Implementation**: Authentic dark maroon, sacred gold, and temple ambience aesthetic faithfully reproduced from design specifications.
- **Global Music Player**:
  - Persistent Mini-Player across navigation.
  - Atmospheric Full-Screen Player with blurred cover backdrop and sacred glow.
  - C# Tanpura & Bamboo Flute Ambient Drone Resonance Layer.
  - 108 Sacred Japa Loop Counter with interactive bead ticking.
  - 432Hz Cosmic Natural Frequency tuning simulation.
- **Bilingual Sacred Lyrics**: Synchronized Devotional Hindi (Devanagari) and Hinglish tabs with one-click copy.
- **Explore Streaming Experience**: Cinematic hero carousel with auto-play preview, categorized horizontal rails (Krishna, Shiva, Ram, Durga & Devi, Hanuman, Ganesh, 432Hz Meditation, Vedic Mantras, Sacred Aartis).
- **Create Divine Card**: Generate customizable 9:16 Story / WhatsApp status cards and 1:1 square posts with Sanskrit verses and high-res export (`html-to-image`).
- **Devotee Sanctuary Sangha**: Live synchronous listening metrics (`21,480+ Souls`) with active Brahma Muhurta Concentric Synchrony gauge.
- **Supabase Integration**: Complete PostgreSQL schema (`supabase/schema.sql`) and sample dataset (`supabase/seed.sql`) with Row Level Security (RLS) policies.
- **Server-Side YouTube Sync Engine**: Staging pipeline for importing new devotional audio releases.

---

## 🚀 Quick Start & Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
*(Note: If Supabase credentials are not provided initially, the application will automatically run seamlessly with its built-in rich mock sanctuary dataset!)*

### 3. Initialize Supabase Database
1. Open your Supabase Dashboard at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor**.
3. Copy and run `supabase/schema.sql` to generate all tables, enums, triggers, and Row Level Security policies.
4. Copy and run `supabase/seed.sql` to populate the sanctuary with 15+ devotional master songs and categories.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Architecture (`supabase/schema.sql`)

- `profiles`: Devotee tier, sadhana streaks, meditation minutes, preferred tuning (432Hz/528Hz).
- `songs`: Title, Hindi title, slug, artist, raga, tala, deity focus, master tape number, acoustic notes, audio format, status.
- `song_lyrics`: Bilingual lyrics (`hi`, `hinglish`) with unique constraint on `(song_id, language)`.
- `categories`: Krishna, Mahadeva Shiva, Shri Ram, Durga & Devi, Hanuman, Ganesh, Meditation, Mantra, Aarti, Bhajan.
- `song_categories`: Many-to-many relationship mapping songs to deity lineages.
- `song_likes`: Unique user likes with RLS constraints.
- `comments`: Community reflections with nested replies and moderation states.
- `playlists` & `playlist_songs`: Private devotion playlists with custom sequencing.
- `song_platform_links`: Apple Music Spatial, Spotify HiFi, YouTube Music master URLs.
- `youtube_sync_items`: Server-side YouTube sync items staging pipeline.

---

## ⌨️ Keyboard Shortcuts

- `⌘K` or `Ctrl+K`: Open Sacred Search Command Palette.
- `Space`: Play / Pause active consecration.
- `Esc`: Close modals.

---

## 📜 License
© 2025 Moksha Music Inc. Eternal Resonance. All Sacred Rights Reserved.
