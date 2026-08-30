import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);

  // Fetch articles in this category
  const categoryArticles = await db.select().from(articles)
    .where(eq(articles.category, categoryName))
    .orderBy(desc(articles.createdAt));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            Canada Easy Guide
          </Link>
        </div>
      </header>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h1>
          <p className="text-xl text-blue-100">
            {categoryArticles.length} {categoryArticles.length === 1 ? 'article' : 'articles'} in this category
          </p>
        </div>
      </div>

      {/* Desktop Top Banner */}
      <div className="hidden lg:block container mx-auto px-4 my-8">
        <div className="flex justify-center">
          <AdSlot adName="banner_728_90" className="ad-desktop" />
        </div>
      </div>

      {/* Tablet Top Banner */}
      <div className="hidden md:block lg:hidden container mx-auto px-4 my-8">
        <div className="flex justify-center">
          <AdSlot adName="banner_468_60" className="ad-tablet" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {categoryArticles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No articles found in this category
            </h2>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Articles
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryArticles.map((article, index) => (
                <div key={article.id}>
                  <Link
                    href={`/article/${article.id}`}
                    className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group h-full"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                      <span className="inline-block bg-white text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {new Date(article.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </Link>

                  {/* Insert ad after every 6 articles on desktop */}
                  {(index + 1) % 6 === 0 && index < categoryArticles.length - 1 && (
                    <div className="hidden lg:block col-span-3 my-8">
                      <div className="flex justify-center">
                        <AdSlot adName="banner_728_90" className="ad-desktop" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Ad */}
            <div className="hidden lg:block mt-12">
              <div className="flex justify-center">
                <AdSlot adName="banner_300_250" className="ad-desktop" />
              </div>
            </div>
          </>
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
