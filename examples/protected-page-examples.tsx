/**
 * Example: Matches Page with Guards
 * Shows different ways to protect a page
 */

// ============================================
// Method 1: Manual Guard Check (Your Example)
// ============================================

import { useEffect, useState } from "react";
import { requireEmailVerified } from "@/lib/guards";
import { useRouter } from "next/navigation";

export function MatchesPageManual() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const g = await requireEmailVerified();
      if (!g.allowed) {
        router.replace("/verify-email");
      } else {
        setChecking(false);
      }
    })();
  }, [router]);

  if (checking) return <div className="p-6">Loading…</div>;
  return <div>Your Matches</div>;
}

// ============================================
// Method 2: Using Hook (RECOMMENDED)
// ============================================

import { useRequireEmailVerified } from "@/lib/hooks/use-guards";

export function MatchesPageWithHook() {
  const { allowed, loading } = useRequireEmailVerified(true); // auto-redirect

  if (loading) return <div className="p-6">Loading…</div>;
  if (!allowed) return null; // Will redirect

  return <div>Your Matches</div>;
}

// ============================================
// Method 3: Using GuardGate Component
// ============================================

import { GuardGate } from "@/lib/hooks/use-guards";
import { requireMatchReady } from "@/lib/guards";

export function MatchesPageWithGate() {
  return (
    <GuardGate
      guardFn={requireMatchReady}
      loadingFallback={<div className="p-6">Loading…</div>}
      fallback={<div className="p-6">Redirecting…</div>}
    >
      <div>Your Matches</div>
    </GuardGate>
  );
}

// ============================================
// Method 4: Multiple Guards
// ============================================

import { useRequireMatchReady } from "@/lib/hooks/use-guards";

export function MatchesPageComplete() {
  // This checks: auth + email verified + location + zodiac
  const { allowed, loading, errorMessage } = useRequireMatchReady(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking your profile...</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600">{errorMessage}</p>
          <p className="text-gray-600 mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
      {/* Your matches content */}
    </div>
  );
}

// ============================================
// Method 5: Server Component (Next.js App Router)
// ============================================

import { requireMatchReadyServer, getGuardErrorMessage } from "@/lib/guards-server";
import { redirect } from "next/navigation";

export default async function MatchesPageServer() {
  const guard = await requireMatchReadyServer();

  if (!guard.allowed) {
    // Redirect on server-side (faster, better SEO)
    if (guard.reason === "not_signed_in") {
      redirect("/login");
    } else if (guard.reason === "email_unverified") {
      redirect("/verify-email");
    } else if (guard.reason === "location_required") {
      redirect("/enable-location");
    } else if (guard.reason === "zodiac_required") {
      redirect("/profile-builder");
    }
  }

  // If we get here, user passed all checks
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
      {/* Your matches content */}
    </div>
  );
}

// ============================================
// Method 6: With Custom Error Handling
// ============================================

import { useGuard } from "@/lib/hooks/use-guards";
import { requireMatchReady, getGuardErrorMessage } from "@/lib/guards";
import { toast } from "sonner"; // or your toast library

export function MatchesPageWithToast() {
  const { allowed, loading } = useGuard(requireMatchReady, {
    redirect: true,
    onFail: (result) => {
      toast.error(getGuardErrorMessage(result));
    },
  });

  if (loading) return <div className="p-6">Loading…</div>;
  if (!allowed) return null;

  return <div>Your Matches</div>;
}

// ============================================
// RECOMMENDED for most cases:
// ============================================

// Use Method 2 (useRequireMatchReady hook) for client components
// Use Method 5 (Server component) for app router pages

export default function MatchesPage() {
  const { allowed, loading, errorMessage } = useRequireMatchReady(true);

  if (loading) return <LoadingSpinner />;
  if (!allowed) return null; // Will redirect

  return <MatchesContent />;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
    </div>
  );
}

function MatchesContent() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
      {/* Your actual matches UI */}
    </div>
  );
}

