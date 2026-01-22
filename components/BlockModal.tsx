"use client";

import { useState } from "react";
import { MOTION_TIMING, EASING, triggerHaptic } from "@/lib/premiumFeel";

interface BlockModalProps {
  userName: string;
  theme?: "light" | "dark";
  onClose: () => void;
  onConfirm?: () => Promise<void>;
}

/**
 * 🔒 Block Modal - Ceremonial, Calm, Non-Dramatic
 */
export default function BlockModal({
  userName,
  theme = "dark",
  onClose,
  onConfirm,
}: BlockModalProps) {
  const [isBlocking, setIsBlocking] = useState(false);

  const handleBlock = async () => {
    setIsBlocking(true);
    triggerHaptic('rigid'); // Error/block haptic

    try {
      await onConfirm?.();
      // Show confirmation toast: "User blocked."
      // TODO: Implement toast notification
      onClose();
    } catch (error) {
      console.error("Error blocking user:", error);
      // TODO: Show error message
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl p-6 ${
          theme === "light" ? "bg-white" : "bg-slate-900"
        }`}
        style={{
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          transition: `opacity ${MOTION_TIMING.MODAL_SLIDE}ms ${EASING.FADE}, transform ${MOTION_TIMING.MODAL_SLIDE}ms ${EASING.FADE}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={`text-xl font-semibold mb-2 ${
          theme === "light" ? "text-slate-900" : "text-slate-100"
        }`}>
          Block This User?
        </h2>
        <div className={`text-sm mb-6 space-y-3 ${
          theme === "light" ? "text-slate-600" : "text-slate-400"
        }`}>
          <p>They will no longer be able to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>View your profile</li>
            <li>Send you messages</li>
            <li>Request a connection</li>
          </ul>
          <p className="mt-3">
            This action is reversible from your privacy settings.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              theme === "light"
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleBlock}
            disabled={isBlocking}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              theme === "light"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-700 text-white hover:bg-red-800"
            }`}
          >
            {isBlocking ? "Blocking..." : "Block"}
          </button>
        </div>
      </div>
    </div>
  );
}
