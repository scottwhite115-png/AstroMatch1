'use client';
import React, { useEffect, useState } from 'react';
import { loadCachedLocation, LocationRecord } from '@/lib/location';

type Props = {
  value?: string;
  onChange: (v: string) => void;
  onStructured?: (loc: LocationRecord | null) => void;
};

export default function ProfileLocationField({ value, onChange, onStructured }: Props) {
  useEffect(() => {
    const cached = loadCachedLocation();
    if (cached && !value) {
      onChange(cached.formatted);
      onStructured?.(cached);
    }
  }, [value, onChange, onStructured]);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Location</label>
      <input
        type="text"
        className="w-full rounded-md border px-3 py-2"
        placeholder="e.g., Southport QLD, Australia"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-gray-500">You can edit this anytime.</p>
    </div>
  );
}


