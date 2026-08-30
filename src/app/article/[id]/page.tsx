import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleId = parseInt(id);

  // Fetch the article
  const result = await db.select().from(articles).where(eq(articles.id, articleId));
  const article = result[0];

  if (!article) {
    notFound();
  }

  // Fetch related articles from same category
  const relatedArticles = await db.select().from(articles)
    .where(eq(articles.category, article.category))
    .orderBy(desc(articles.createdAt))
    .limit(4);

  const filteredRelated = relatedArticles.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            Canada Easy Guide
          </Link>
        </div>
      </header>

      {/* Desktop Top Banner */}
      <div className="hidden lg:block container mx-auto px-4 my-6">
        <div className="flex justify-center">
          <AdSlot adName="banner_728_90" className="ad-desktop" />
        </div>
      </div>

      {/* Tablet Top Banner */}
      <div className="hidden md:block lg:hidden container mx-auto px-4 my-6">
        <div className="flex justify-center">
          <AdSlot adName="banner_468_60" className="ad-tablet" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <article className="flex-1 bg-white rounded-lg shadow-md p-8 max-w-4xl">
            {/* Category Badge */}
            <Link 
              href={`/category/${encodeURIComponent(article.category)}`}
              className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors mb-4"
            >
              {article.category}
            </Link>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center text-gray-600 text-sm mb-8 pb-6 border-b border-gray-200">
              <time dateTime={article.createdAt.toISOString()}>
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {article.updatedAt && article.updatedAt.getTime() !== article.createdAt.getTime() && (
                <span className="ml-4">
                  Updated: {new Date(article.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-gray-700 prose-li:mb-2
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Middle Article Ad - Desktop */}
            <div className="hidden lg:block my-12">
              <div className="text-xs text-gray-500 text-center mb-2">Advertisement</div>
              <div className="flex justify-center">
                <AdSlot adName="banner_468_60" className="ad-desktop" />
              </div>
            </div>

            {/* Native Ad - Mobile/Tablet */}
            <div className="lg:hidden my-12">
              <div className="text-xs text-gray-500 text-center mb-2">Advertisement</div>
              <AdSlot adName="native_4_1" className="ad-mobile ad-tablet" />
            </div>

            {/* Sponsored Content Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Sponsored Content</p>
              <AdSlot adName="smartlink" />
            </div>
          </article>

          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-80 space-y-8">
            {/* Sidebar Ad */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-xs text-gray-500 text-center mb-2">Advertisement</div>
              <AdSlot adName="banner_300_250" className="ad-desktop" />
            </div>

            {/* Related Articles */}
            {filteredRelated.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {filteredRelated.map((related) => (
                    <Link
                      key={related.id}
                      href={`/article/${related.id}`}
                      className="block group"
                    >
                      <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                        {related.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(related.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tall Sidebar Ad */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-xs text-gray-500 text-center mb-2">Advertisement</div>
              <AdSlot adName="banner_160_600" className="ad-desktop" />
            </div>
          </aside>
        </div>

        {/* Related Articles - Mobile/Tablet */}
        {filteredRelated.length > 0 && (
          <div className="lg:hidden mt-12 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {filteredRelated.map((related) => (
                <Link
                  key={related.id}
                  href={`/article/${related.id}`}
                  className="block group"
                >
                  <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                    {related.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {new Date(related.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 mb-16 md:mb-0 text-center">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Mobile Sticky Bottom Ad */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg">
        <div className="flex justify-center">
          <AdSlot adName="banner_320_50" className="ad-mobile" />
        </div>
      </div>

      {/* Popunder Ad */}
      <AdSlot adName="popunder" />
    </div>
  );
}
