"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function OnboardingBanner() {
  const searchParams = useSearchParams();
  const show = searchParams.get("onboarding") === "1";

  useEffect(() => {
    if (show) {
      // Scroll to essentials block
      const el = document.getElementById("essentials");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-900 text-sm px-3 py-2 rounded-md mb-3 flex items-center gap-2">
      <span>👋 Welcome! Please complete a few essentials to unlock matches.</span>
      <button
        className="ml-auto underline"
        onClick={() => {
          const q = new URLSearchParams(window.location.search);
          q.delete("onboarding");
          history.replaceState(null, "", `${location.pathname}${q.size ? `?${q}` : ""}`);
        }}
      >
        Dismiss
      </button>
    </div>
  );
}

