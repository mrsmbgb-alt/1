'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdSetting {
  id: number;
  name: string;
  code: string;
  enabled: boolean;
}

const AD_DESCRIPTIONS: { [key: string]: string } = {
  popunder: 'Popunder - Opens new tab on click (non-intrusive)',
  native_4_1: 'Native Banner 4:1 - Blends with content',
  native_1_4: 'Native Banner 1:4 - Vertical native ad',
  social_bar: 'Social Bar - Social sharing widget',
  banner_468_60: 'Banner 468x60 - Medium banner (Tablet/Desktop)',
  banner_300_250: 'Banner 300x250 - Medium rectangle (Sidebar)',
  banner_160_300: 'Banner 160x300 - Wide skyscraper',
  banner_160_600: 'Banner 160x600 - Tall skyscraper (Sidebar)',
  smartlink: 'Smartlink - Text-based sponsored link',
  banner_320_50: 'Banner 320x50 - Mobile sticky banner',
  banner_728_90: 'Banner 728x90 - Leaderboard (Desktop header)',
};

export default function AdManagementPage() {
  const [ads, setAds] = useState<AdSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState('');
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
      loadAds();
    } catch (err) {
      router.push('/admin/login');
    }
  };

  const loadAds = async () => {
    try {
      const res = await fetch('/api/ads');
      const data = await res.json();
      setAds(data);
    } catch (err) {
      console.error('Error loading ads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (name: string, code: string, enabled: boolean) => {
    setSaving(name);
    setMessage('');

    try {
      const res = await fetch('/api/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, enabled }),
      });

      if (res.ok) {
        setMessage(`✓ ${name} updated successfully`);
        loadAds();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`✗ Failed to update ${name}`);
      }
    } catch (err) {
      setMessage(`✗ Error updating ${name}`);
    } finally {
      setSaving(null);
    }
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
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">Ad Management</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/admin"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Articles
          </Link>
          <Link
            href="/admin/ads"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Ad Management
          </Link>
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${
            message.startsWith('✓') 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Centralized Ad Code Management
            </h2>
            <p className="text-gray-600">
              Update ad codes here and they will automatically apply across all pages. 
              Toggle enabled/disabled to show or hide specific ads.
            </p>
          </div>

          <div className="space-y-8">
            {ads.map((ad) => (
              <AdEditor
                key={ad.id}
                ad={ad}
                description={AD_DESCRIPTIONS[ad.name] || ad.name}
                onSave={handleSave}
                isSaving={saving === ad.name}
              />
            ))}
          </div>
        </div>

        {/* Ad Placement Guidelines */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Smart Ad Placement Strategy</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <p><strong>Desktop:</strong> 728x90 header, 300x250 sidebar, 468x60 in-content</p>
            <p><strong>Tablet:</strong> 468x60 header, 300x250 in-content</p>
            <p><strong>Mobile:</strong> 320x50 sticky bottom banner OR 300x250 after content</p>
            <p><strong>Native Ads:</strong> Blend naturally with article content (4:1 or 1:4 ratio)</p>
            <p><strong>Popunder:</strong> Non-intrusive, opens on user click only</p>
            <p className="text-xs text-blue-700 mt-4">
              💡 Tip: Not all ads need to be active. Choose wisely based on user experience and revenue goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdEditor({ 
  ad, 
  description, 
  onSave, 
  isSaving 
}: { 
  ad: AdSetting; 
  description: string; 
  onSave: (name: string, code: string, enabled: boolean) => void;
  isSaving: boolean;
}) {
  const [code, setCode] = useState(ad.code);
  const [enabled, setEnabled] = useState(ad.enabled);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(code !== ad.code || enabled !== ad.enabled);
  }, [code, enabled, ad]);

  const handleSaveClick = () => {
    onSave(ad.name, code, enabled);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{ad.name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ad Code
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter ad code here..."
        />
      </div>

      {hasChanges && (
        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    </div>
  );
}
