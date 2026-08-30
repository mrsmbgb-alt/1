import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch all articles and featured articles
  const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));
  const featuredArticles = await db.select().from(articles)
    .where(eq(articles.featured, true))
    .orderBy(desc(articles.createdAt))
    .limit(3);
  
  const latestArticles = allArticles.slice(0, 6);

  // Get unique categories
  const categories = Array.from(new Set(allArticles.map((a) => a.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Canada Easy Guide
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Your Complete Resource for Canadian Immigration
            </p>
            <p className="text-lg text-blue-200">
              Navigate your path to Canada with comprehensive guides on immigration, 
              work permits, student visas, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Desktop Top Banner Ad */}
      <div className="hidden lg:block container mx-auto px-4 my-8">
        <div className="flex justify-center">
          <AdSlot adName="banner_728_90" className="ad-desktop" />
        </div>
      </div>

      {/* Tablet Top Banner Ad */}
      <div className="hidden md:block lg:hidden container mx-auto px-4 my-8">
        <div className="flex justify-center">
          <AdSlot adName="banner_468_60" className="ad-tablet" />
        </div>
      </div>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category: string) => (
            <Link
              key={category}
              href={`/category/${encodeURIComponent(category)}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 text-center border-t-4 border-blue-600"
            >
              <h3 className="font-semibold text-gray-800">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                  <span className="inline-block bg-white text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Middle Content Ad - Desktop */}
      <div className="hidden lg:block container mx-auto px-4 my-8">
        <div className="flex justify-center">
          <AdSlot adName="banner_300_250" className="ad-desktop" />
        </div>
      </div>

      {/* Latest Articles */}
      <section className="container mx-auto px-4 py-12 bg-gray-50 rounded-xl my-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Latest Articles
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500"
            >
              <span className="text-xs text-blue-600 font-semibold">
                {article.category}
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-2 mb-3 hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-500 text-sm">
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-blue-600 text-white py-16 mt-12 mb-16 md:mb-0">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest immigration guides and updates
          </p>
        </div>
      </section>

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
