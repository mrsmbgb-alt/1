'use client';

import { useEffect, useState } from 'react';

interface AdSlotProps {
  adName: string;
  className?: string;
}

export default function AdSlot({ adName, className = '' }: AdSlotProps) {
  const [adCode, setAdCode] = useState<string>('');
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    // Fetch ad code from API
    fetch('/api/ads')
      .then(res => res.json())
      .then(ads => {
        const ad = ads.find((a: any) => a.name === adName);
        if (ad) {
          setAdCode(ad.code);
          setEnabled(ad.enabled);
        }
      })
      .catch(err => console.error('Error loading ad:', err));
  }, [adName]);

  if (!enabled || !adCode) {
    return null;
  }

  return (
    <div 
      className={`ad-container ${className}`}
      dangerouslySetInnerHTML={{ __html: adCode }}
    />
  );
}
