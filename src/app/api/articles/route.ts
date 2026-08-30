import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

// GET all articles (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    let result;
    
    // Filter by featured and/or category
    if (featured === 'true' && category) {
      result = await db.select().from(articles)
        .where(and(eq(articles.featured, true), eq(articles.category, category)))
        .orderBy(desc(articles.createdAt));
    } else if (featured === 'true') {
      result = await db.select().from(articles)
        .where(eq(articles.featured, true))
        .orderBy(desc(articles.createdAt));
    } else if (category) {
      result = await db.select().from(articles)
        .where(eq(articles.category, category))
        .orderBy(desc(articles.createdAt));
    } else {
      result = await db.select().from(articles)
        .orderBy(desc(articles.createdAt));
    }

    // Apply limit if specified
    if (limit) {
      result = result.slice(0, parseInt(limit));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// POST create new article (protected)
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    
    const body = await request.json();
    const { title, content, category, featured } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    const newArticle = await db.insert(articles).values({
      title,
      content,
      category,
      featured: featured || false,
    }).returning();

    return NextResponse.json(newArticle[0], { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
