"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { MOTION_TIMING, EASING, triggerHaptic } from "@/lib/premiumFeel";

interface ConnectionCeremonyProps {
  profileName: string;
  tarotName: string;
  tarotScore: number;
  tarotSnippet: string;
  theme?: "light" | "dark";
  onViewProfile?: () => void;
  onOpenChat?: () => void;
  onClose?: () => void;
}

/**
 * 🔒 Connection Ceremony Screen
 * 
 * Appears when both users accept the symbolic connection.
 * Sacred, ceremonial tone - no confetti, no fireworks, no gamification.
 */
export default function ConnectionCeremony({
  profileName,
  tarotName,
  tarotScore,
  tarotSnippet,
  theme: themeProp,
  onViewProfile,
  onOpenChat,
  onClose,
}: ConnectionCeremonyProps) {
  const { theme: themeContext } = useTheme();
  const theme = themeProp || themeContext || "dark";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Gentle fade-in
    setTimeout(() => setIsVisible(true), 50);
    
    // 🔮 Haptic: Connection opened ceremony - soft success
    triggerHaptic('soft');
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          opacity: isVisible ? 1 : 0,
          transition: `opacity ${MOTION_TIMING.MODAL_SLIDE}ms ${EASING.FADE}`,
        }}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl p-8 ${
          theme === "light" ? "bg-white" : "bg-slate-900"
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: `transform ${MOTION_TIMING.MODAL_SLIDE}ms ${EASING.FADE}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-semibold mb-2 ${
            theme === "light" ? "text-slate-900" : "text-slate-100"
          }`}>
            Connection Opened
          </h2>
          <p className={`text-sm ${
            theme === "light" ? "text-slate-600" : "text-slate-400"
          }`}>
            You and {profileName} have accepted this symbolic connection.
          </p>
        </div>

        {/* Tarot Display */}
        <div className="text-center mb-6 py-4 border-y border-slate-200 dark:border-slate-700">
          <p className={`text-xl font-semibold mb-1 ${
            theme === "light" ? "text-slate-900" : "text-slate-100"
          }`}>
            {tarotName}
          </p>
          <p className={`text-lg font-medium mb-3 ${
            theme === "light" ? "text-slate-700" : "text-slate-300"
          }`}>
            {tarotScore}%
          </p>
          <p className={`text-sm leading-relaxed italic ${
            theme === "light" ? "text-slate-600" : "text-slate-400"
          }`} style={{ lineHeight: '1.6' }}>
            "{tarotSnippet}"
          </p>
        </div>

        {/* Message */}
        <p className={`text-sm text-center mb-6 ${
          theme === "light" ? "text-slate-600" : "text-slate-400"
        }`}>
          Your profiles and chat are now unlocked.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onViewProfile}
            className={`flex-1 px-4 py-3 rounded-full text-sm font-semibold transition-all ${
              theme === "light"
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            View Profile
          </button>
          <button
            onClick={onOpenChat}
            className={`flex-1 px-4 py-3 rounded-full text-sm font-semibold transition-all ${
              theme === "light"
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
            }`}
          >
            Open Chat
          </button>
        </div>

        {/* 🔒 Safety & Guidelines Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <a
            href="/safety"
            className={`text-xs text-center block ${
              theme === "light" ? "text-slate-500" : "text-slate-400"
            } hover:underline`}
          >
            Safety & Guidelines
          </a>
        </div>
      </div>
    </div>
  );
}
