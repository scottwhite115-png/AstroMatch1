"use client";

import { useState } from "react";
import { MOTION_TIMING, EASING } from "@/lib/premiumFeel";

interface SafetyMenuProps {
  userId: string;
  userName: string;
  theme?: "light" | "dark";
  position?: "top-right" | "bottom" | "header";
  onBlock?: () => void;
  onReport?: () => void;
}

/**
 * 🔒 Safety Menu Component
 * 
 * Must be visible everywhere - on every profile card, in every chat, on every profile screen.
 * Always one tap away. Works even before unlock.
 */
export default function SafetyMenu({
  userId,
  userName,
  theme = "dark",
  position = "top-right",
  onBlock,
  onReport,
}: SafetyMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {/* Menu Trigger Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(true);
        }}
        className={`flex items-center justify-center rounded-full transition-all ${
          theme === "light"
            ? "bg-white/90 text-slate-700 hover:bg-white"
            : "bg-slate-900/90 text-slate-200 hover:bg-slate-800"
        }`}
        style={{
          width: '32px',
          height: '32px',
          backdropFilter: 'blur(8px)',
          transition: `all ${MOTION_TIMING.BUTTON_PRESS}ms ${EASING.DEFAULT}`,
        }}
        aria-label="Safety menu"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {/* Menu Dropdown */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div
            className={`absolute z-50 rounded-lg shadow-lg ${
              theme === "light" ? "bg-white" : "bg-slate-900"
            }`}
            style={{
              ...(position === "top-right" && {
                top: '40px',
                right: '0',
              }),
              ...(position === "bottom" && {
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
              }),
              ...(position === "header" && {
                top: '100%',
                right: '0',
                marginTop: '8px',
              }),
              minWidth: '200px',
              border: `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`,
              transition: `opacity ${MOTION_TIMING.FADE_IN_OUT}ms ${EASING.FADE}, transform ${MOTION_TIMING.FADE_IN_OUT}ms ${EASING.FADE}`,
            }}
          >
            <div className="py-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onBlock?.();
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-all ${
                  theme === "light"
                    ? "text-slate-700 hover:bg-slate-100"
                    : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                Block user
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onReport?.();
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-all ${
                  theme === "light"
                    ? "text-slate-700 hover:bg-slate-100"
                    : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                Report user
              </button>
              <div className={`border-t my-1 ${theme === "light" ? "border-slate-200" : "border-slate-700"}`} />
              <a
                href="/safety"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition-all ${
                  theme === "light"
                    ? "text-slate-600 hover:bg-slate-100"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                Safety & Guidelines
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
