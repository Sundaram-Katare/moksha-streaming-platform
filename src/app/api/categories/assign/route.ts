import { NextResponse } from 'next/server';
import { assignItemToCategory, unassignItemFromCategory } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { categoryId, itemId, action } = body;

    if (!categoryId || !itemId) {
      return NextResponse.json({ success: false, error: 'categoryId and itemId are required' }, { status: 400 });
    }

    if (action === 'remove') {
      const ok = unassignItemFromCategory(categoryId, itemId);
      return NextResponse.json({ success: ok });
    } else {
      const ok = assignItemToCategory(categoryId, itemId);
      return NextResponse.json({ success: ok });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
