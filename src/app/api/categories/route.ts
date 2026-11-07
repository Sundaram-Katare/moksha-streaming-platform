import { NextResponse } from 'next/server';
import { getLocalCategories, saveLocalCategory, CategoryItem } from '@/lib/storage';

export async function GET() {
  try {
    const categories = getLocalCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, hindi_name, slug, description, tagline } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const newCategory: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      hindi_name: (hindi_name || name).trim(),
      slug: (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim(),
      description: (description || '').trim(),
      tagline: (tagline || 'BHAKTI & SHANTI').trim(),
      item_ids: [],
    };

    const saved = saveLocalCategory(newCategory);
    return NextResponse.json({ success: true, category: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
