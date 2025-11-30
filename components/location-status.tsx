/**
 * Location status component
 * Shows current location info and update controls
 */

import { useState } from "react";
import { useLocationWithCache } from "@/lib/hooks/use-location";
import { formatDistance, reverseGeocode } from "@/lib/location";
import { updateMyLocation } from "@/lib/location";

export function LocationStatus() {
  const { location, source, loading, error, refresh } = useLocationWithCache();
  const [city, setCity] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch city name when location available
  useState(() => {
    if (location && !city) {
      reverseGeocode(location.lat, location.lon).then(setCity);
    }
  });

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateMyLocation();
      await refresh();
    } catch (err) {
      console.error("Failed to update location:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !location) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
        <span>Getting your location...</span>
      </div>
    );
  }

  if (error && !location) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  if (!location) {
    return (
      <button
        onClick={refresh}
        className="text-sm text-purple-600 hover:text-purple-700"
      >
        Enable location
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2 text-gray-700">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>{city || "Location enabled"}</span>
        {source === "cached" && (
          <span className="text-xs text-gray-500">(cached)</span>
        )}
      </div>

      <button
        onClick={handleUpdate}
        disabled={updating}
        className="text-purple-600 hover:text-purple-700 disabled:opacity-50"
        title="Update location"
      >
        {updating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

/**
 * Compact location badge
 */
export function LocationBadge({ className = "" }: { className?: string }) {
  const { location, source } = useLocationWithCache();

  if (!location) return null;

  return (
    <div className={`inline-flex items-center gap-1 text-xs ${className}`}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
      {source === "live" ? "📍" : "📌"}
    </div>
  );
}

