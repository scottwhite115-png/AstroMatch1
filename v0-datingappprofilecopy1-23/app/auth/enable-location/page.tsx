/**
 * Location Permission Component
 * UI for requesting and managing location access
 */
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  requestLocationPermission,
  updateMyLocation,
  checkLocationPermission,
} from "@/lib/location";

export default function LocationPermissionPage() {
  const router = useRouter();
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");
  const [permission, setPermission] = useState<PermissionState>("prompt");

  useEffect(() => {
    // Check current permission
    checkLocationPermission().then(setPermission);
  }, []);

  // Auto-redirect if already granted
  useEffect(() => {
    if (permission === "granted") {
      router.replace("/profile-builder");
    }
  }, [permission, router]);

  const handleRequest = async () => {
    setRequesting(true);
    setError("");

    try {
      const granted = await requestLocationPermission();

      if (granted) {
        // Update location in database
        await updateMyLocation();

        // Redirect to next step
        router.push("/profile-builder");
      } else {
        setError(
          "Location access is required to find matches near you. Please enable location in your browser settings."
        );
        setPermission("denied");
      }
    } catch (err: any) {
      console.error("Location request error:", err);
      setError("Failed to access location. Please try again.");
    } finally {
      setRequesting(false);
    }
  };

  const handleSkip = () => {
    // Allow skipping but warn about limited functionality
    router.push("/profile-builder");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Icon */}
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2">
          Enable Location
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Find compatible matches near you
        </p>

        {/* Benefits */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-purple-900 mb-3">
            Why we need your location:
          </h3>
          <ul className="space-y-2 text-sm text-purple-800">
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Show you matches in your area</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Display distance to potential matches</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Improve match relevance and quality</span>
            </li>
          </ul>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex gap-2">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Your privacy matters</p>
              <p className="text-blue-700">
                We never share your exact location. Only approximate distance is shown to matches.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRequest}
            disabled={requesting || permission === "granted"}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {requesting
              ? "Requesting access..."
              : permission === "granted"
              ? "Location enabled ✓"
              : "Enable Location"}
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium"
          >
            Skip for now
          </button>
        </div>

        {/* Instructions for denied permission */}
        {permission === "denied" && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
            <p className="font-medium mb-2">Location access blocked</p>
            <p className="mb-2">To enable location:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Click the lock icon in your browser's address bar</li>
              <li>Find "Location" in the permissions list</li>
              <li>Select "Allow" and refresh this page</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

