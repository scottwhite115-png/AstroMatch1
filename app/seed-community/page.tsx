"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeedCommunityPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSeed = async (clearFirst: boolean = false) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/seed/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clear: clearFirst }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to seed data");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-50 mb-2">
            Seed Community Test Data
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            This will create test posts, comments, and profiles across all community topics
            so you can test the UI and design layouts.
          </p>

          {result && (
            <div className="mb-6 rounded-xl border border-emerald-800 bg-emerald-950/20 p-4">
              <p className="text-sm font-semibold text-emerald-400 mb-2">
                ✅ Success!
              </p>
              <div className="text-xs text-emerald-300 space-y-1">
                <p>Profiles: {result.stats?.profiles || 0}</p>
                <p>Posts: {result.stats?.posts || 0}</p>
                <p>Comments: {result.stats?.comments || 0}</p>
              </div>
              <button
                onClick={() => router.push("/community")}
                className="mt-4 rounded-full px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                View Community →
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-rose-800 bg-rose-950/20 p-4">
              <p className="text-sm text-rose-400">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => handleSeed(false)}
              disabled={loading}
              className="w-full rounded-full px-4 py-3 text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors"
            >
              {loading ? "Seeding..." : "Add Test Data"}
            </button>

            <button
              onClick={() => handleSeed(true)}
              disabled={loading}
              className="w-full rounded-full px-4 py-3 text-sm font-semibold bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors"
            >
              {loading ? "Clearing & Seeding..." : "Clear & Re-seed (removes existing test data)"}
            </button>

            <button
              onClick={() => router.push("/community")}
              className="w-full rounded-full px-4 py-3 text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              Go to Community
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">
              What gets created:
            </h2>
            <ul className="text-xs text-slate-400 space-y-2">
              <li>• 5 test profiles with different astrological signs</li>
              <li>• 18 posts across all 6 topics</li>
              <li>• 8+ comments on various posts</li>
              <li>• 3 nested replies</li>
              <li>• Random like counts for engagement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

