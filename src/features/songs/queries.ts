import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { getLocalSongs } from '@/lib/storage';
import { Song } from '@/types';

export async function getSongs(): Promise<Song[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('songs')
        .select('*, song_lyrics(*), song_categories(categories(*)), song_platform_links(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          lyrics: item.song_lyrics || [],
          categories: item.song_categories?.map((sc: any) => sc.categories) || [],
          platform_links: item.song_platform_links || [],
        }));
      }
    } catch {
      // Fallback to local
    }
  }

  // Server-side / fallback check
  try {
    return getLocalSongs();
  } catch {
    return [];
  }
}

export async function getSongBySlug(slug: string): Promise<Song | null> {
  const songs = await getSongs();
  const found = songs.find((s) => s.slug === slug);
  return found || null;
}

export async function getFeaturedSong(): Promise<Song | null> {
  const songs = await getSongs();
  if (songs.length === 0) return null;
  return songs.find((s) => s.is_featured) || songs[0];
}

export async function getSongsByCategory(categorySlug: string): Promise<Song[]> {
  const songs = await getSongs();
  return songs.filter(
    (s) =>
      s.categories?.some((c) => c.slug === categorySlug) ||
      s.deity_focus?.toLowerCase().includes(categorySlug.toLowerCase()) ||
      s.title.toLowerCase().includes(categorySlug.toLowerCase())
  );
}
