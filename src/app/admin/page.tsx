'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
      loadArticles();
    } catch (err) {
      router.push('/admin/login');
    }
  };

  const loadArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
      } else {
        alert('Failed to delete article');
      }
    } catch (err) {
      alert('Error deleting article');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/admin"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Articles
          </Link>
          <Link
            href="/admin/ads"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Ad Management
          </Link>
          <Link
            href="/"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
            target="_blank"
          >
            View Site →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Articles</h3>
            <p className="text-3xl font-bold text-blue-600">{articles.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Featured Articles</h3>
            <p className="text-3xl font-bold text-green-600">
              {articles.filter(a => a.featured).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Categories</h3>
            <p className="text-3xl font-bold text-purple-600">
              {new Set(articles.map(a => a.category)).size}
            </p>
          </div>
        </div>

        {/* Create New Article Button */}
        <div className="mb-6">
          <Link
            href="/admin/articles/new"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            + Create New Article
          </Link>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Title</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Featured</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Created</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{article.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {article.featured ? (
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/article/${article.id}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/articles/edit/${article.id}`}
                        className="text-green-600 hover:text-green-800 font-medium text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
