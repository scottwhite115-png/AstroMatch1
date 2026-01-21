'use client';

import { useEffect, useState } from 'react';

type Longform = {
  pair_id: string;
  tier: 'soulmate'|'twin'|'excellent';
  headline: string;
  body: string;
  east_west_notes: {
    east: { label: string; text: string };
    west: { label: string; text: string };
  };
};

export function useCompatibility(pairId: string, enabled = true) {
  const [data, setData] = useState<Longform | null>(null);
  const [status, setStatus] = useState<'idle'|'loading'|'loaded'|'error'>('idle');

  useEffect(() => {
    if (!enabled || !pairId) return;
    setStatus('loading');

    const key = `compat_longform:${pairId}`;
    const cached = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (cached) {
      try { setData(JSON.parse(cached)); setStatus('loaded'); } catch {}
    }

    fetch(`/api/compat/${encodeURIComponent(pairId)}`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then((json) => {
        setData(json);
        try { localStorage.setItem(key, JSON.stringify(json)); } catch {}
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, [pairId, enabled]);

  return { data, status };
}
