import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

// GET all ad settings (public)
export async function GET() {
  try {
    const result = await db.select().from(adSettings);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}

// PUT update ad setting (protected)
export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    
    const body = await request.json();
    const { name, code, enabled } = body;

    if (!name) {
      return NextResponse.json({ error: 'Ad name is required' }, { status: 400 });
    }

    // Check if ad setting exists
    const existing = await db.select().from(adSettings).where(eq(adSettings.name, name));

    if (existing.length > 0) {
      // Update existing
      const updated = await db
        .update(adSettings)
        .set({ code, enabled, updatedAt: new Date() })
        .where(eq(adSettings.name, name))
        .returning();
      
      return NextResponse.json(updated[0]);
    } else {
      // Create new
      const created = await db
        .insert(adSettings)
        .values({ name, code, enabled: enabled ?? true })
        .returning();
      
      return NextResponse.json(created[0], { status: 201 });
    }
  } catch (error) {
    console.error('Error updating ad:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update ad' }, { status: 500 });
  }
}
