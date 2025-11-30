'use client';
import React, { useState } from 'react';
import { getGpsPosition, reverseGeocode, saveCachedLocation, LocationRecord } from '@/lib/location';

type Props = { onLocationReady?: (loc: LocationRecord) => void };

export default function LocationConsent({ onLocationReady }: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleAllow = async () => {
    setErr(null);
    setLoading(true);
    try {
      const pos = await getGpsPosition();
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const rg = await reverseGeocode(lat, lon);
      const loc: LocationRecord = { ...rg, source: 'gps', timestamp: Date.now() };
      saveCachedLocation(loc);
      onLocationReady?.(loc);
    } catch (e: any) {
      setErr(e?.message || 'Unable to get location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border p-4 bg-white/60 backdrop-blur">
      <h3 className="font-semibold mb-2">Find nearby matches</h3>
      <p className="text-sm text-gray-600 mb-3">
        Allow location to auto-detect your suburb/city so we can show you nearby people. You can edit this later.
      </p>
      {err && <p className="text-sm text-red-600 mb-2">{err}</p>}
      <div className="flex gap-2">
        <button onClick={handleAllow} disabled={loading} className="px-3 py-2 rounded-md border">
          {loading ? 'Detecting…' : 'Allow GPS'}
        </button>
        {/* Your own “No thanks” or manual mode handled by the parent */}
      </div>
    </div>
  );
}


