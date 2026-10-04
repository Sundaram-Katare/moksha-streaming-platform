import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, Play, ChevronRight, Heart } from 'lucide-react';
import { getCategoryBySlug, getCategories } from '@/features/categories/queries';
import { getSongsByCategory, getSongs } from '@/features/songs/queries';
import { CategoryClientView } from '@/components/category/CategoryClientView';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Deity Sanctuary Not Found — Moksha Music',
    };
  }

  return {
    title: `${category.name} (${category.hindi_name || ''}) — Sacred Devotion & Stotrams | Moksha Music`,
    description: category.description || `Explore consecrated hymns, stotrams, and bhajans of ${category.name} in 432Hz master tuning.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const allSongs = await getSongs();
  const categorySongs = await getSongsByCategory(slug);
  const displaySongs = categorySongs.length > 0 ? categorySongs : allSongs.slice(0, 5);

  return <CategoryClientView category={category} songs={displaySongs} />;
}
