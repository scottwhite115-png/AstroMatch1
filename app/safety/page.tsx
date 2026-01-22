"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { MOTION_TIMING, EASING } from "@/lib/premiumFeel";

/**
 * 🔒 Safety & Guidelines Screen
 * 
 * Accessible from:
 * - Profile menu
 * - Match card menu
 * - Settings
 * - Report modal
 */
export default function SafetyPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${
      theme === "light" ? "bg-white" : "bg-slate-950"
    }`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-6 ${
          theme === "light" ? "text-slate-900" : "text-slate-100"
        }`}>
          Happy Cards Community Guidelines
        </h1>

        <div className={`space-y-6 ${
          theme === "light" ? "text-slate-700" : "text-slate-300"
        }`}>
          <p className="text-lg leading-relaxed">
            Happy Cards is a reflective social discovery app designed to support respectful, meaningful connections.
          </p>

          <div>
            <h2 className={`text-xl font-semibold mb-4 ${
              theme === "light" ? "text-slate-900" : "text-slate-100"
            }`}>
              We do not allow:
            </h2>
            <ul className="space-y-2 list-disc list-inside ml-2">
              <li>Harassment, bullying, or abusive behavior</li>
              <li>Hate speech or discrimination</li>
              <li>Sexually explicit content</li>
              <li>Impersonation or misleading profiles</li>
              <li>Spam, scams, or promotional content</li>
              <li>Threats or encouragement of harm</li>
            </ul>
          </div>

          <div>
            <h2 className={`text-xl font-semibold mb-4 ${
              theme === "light" ? "text-slate-900" : "text-slate-100"
            }`}>
              Reporting
            </h2>
            <p className="leading-relaxed">
              Users may report any behavior or content that feels unsafe, inappropriate, or misleading.
            </p>
            <p className="leading-relaxed mt-2">
              Our moderation team reviews reports and may take action including warnings, content removal, or account suspension.
            </p>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === "light" ? "bg-slate-50" : "bg-slate-900"
          }`}>
            <p className="leading-relaxed">
              We are committed to maintaining a respectful and safe environment for all users.
            </p>
          </div>

          {/* Links to Privacy Policy and Terms of Service */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-3">
              <a
                href="/privacy"
                className={`text-sm underline ${
                  theme === "light" ? "text-slate-600" : "text-slate-400"
                } hover:${theme === "light" ? "text-slate-900" : "text-slate-200"}`}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className={`text-sm underline ${
                  theme === "light" ? "text-slate-600" : "text-slate-400"
                } hover:${theme === "light" ? "text-slate-900" : "text-slate-200"}`}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
