"use client";

import { useState } from "react";
import { MOTION_TIMING, EASING, triggerHaptic } from "@/lib/premiumFeel";

interface ReportModalProps {
  userId: string;
  userName: string;
  theme?: "light" | "dark";
  onClose: () => void;
  onSubmit?: (reportData: ReportData) => Promise<void>;
}

export interface ReportData {
  reason: ReportReason;
  details?: string;
}

export type ReportReason =
  | "harassment"
  | "inappropriate_content"
  | "spam_scam"
  | "fake_profile"
  | "hate_discrimination"
  | "other";

/**
 * 🔒 Report Modal - Ceremonial, Calm, Non-Dramatic
 * 
 * Apple-safe tone: calm, non-accusatory, neutral, supportive, non-judgmental
 */
export default function ReportModal({
  userId,
  userName,
  theme = "dark",
  onClose,
  onSubmit,
}: ReportModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons: { value: ReportReason; label: string }[] = [
    { value: "harassment", label: "Harassment or abusive behavior" },
    { value: "inappropriate_content", label: "Inappropriate content" },
    { value: "spam_scam", label: "Spam or scam" },
    { value: "fake_profile", label: "Misleading or fake profile" },
    { value: "hate_discrimination", label: "Hate or discrimination" },
    { value: "other", label: "Other" },
  ];

  const handleContinue = () => {
    if (selectedReason) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    triggerHaptic('rigid'); // Error/block haptic

    try {
      // TODO: Send report to backend
      await onSubmit?.({
        reason: selectedReason,
        details: details.trim() || undefined,
      });

      setStep(3);
    } catch (error) {
      console.error("Error submitting report:", error);
      // TODO: Show error message
    } finally {
      setIsSubmitting(false);
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
        {/* Step 1: Select Reason */}
        {step === 1 && (
          <>
            <h2 className={`text-xl font-semibold mb-2 ${
              theme === "light" ? "text-slate-900" : "text-slate-100"
            }`}>
              Report This User
            </h2>
            <p className={`text-sm mb-6 ${
              theme === "light" ? "text-slate-600" : "text-slate-400"
            }`}>
              Help us keep Happy Cards safe and respectful for everyone.
            </p>

            <p className={`text-sm mb-4 font-medium ${
              theme === "light" ? "text-slate-700" : "text-slate-300"
            }`}>
              What best describes the issue?
            </p>

            <div className="space-y-2 mb-6">
              {reportReasons.map((reason) => (
                <label
                  key={reason.value}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                    theme === "light"
                      ? selectedReason === reason.value
                        ? "bg-slate-100 border-2 border-slate-300"
                        : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"
                      : selectedReason === reason.value
                      ? "bg-slate-800 border-2 border-slate-600"
                      : "bg-slate-800/50 border-2 border-transparent hover:bg-slate-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={() => setSelectedReason(reason.value)}
                    className="mr-3"
                  />
                  <span className={`text-sm ${
                    theme === "light" ? "text-slate-700" : "text-slate-200"
                  }`}>
                    {reason.label}
                  </span>
                </label>
              ))}
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
                onClick={handleContinue}
                disabled={!selectedReason}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedReason
                    ? theme === "light"
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    : theme === "light"
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {/* Step 2: Optional Details */}
        {step === 2 && (
          <>
            <h2 className={`text-xl font-semibold mb-2 ${
              theme === "light" ? "text-slate-900" : "text-slate-100"
            }`}>
              Tell us more (optional)
            </h2>
            <p className={`text-sm mb-4 ${
              theme === "light" ? "text-slate-600" : "text-slate-400"
            }`}>
              You can share any details that may help our moderation team review this report.
            </p>

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Share any additional information..."
              className={`w-full p-3 rounded-lg mb-6 text-sm resize-none ${
                theme === "light"
                  ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400"
                  : "bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500"
              }`}
              rows={4}
              style={{
                minHeight: "100px",
              }}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  theme === "light"
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  theme === "light"
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className={`text-xl font-semibold mb-2 ${
                theme === "light" ? "text-slate-900" : "text-slate-100"
              }`}>
                Report Submitted
              </h2>
              <p className={`text-sm ${
                theme === "light" ? "text-slate-600" : "text-slate-400"
              }`}>
                Thank you for helping keep Happy Cards safe and respectful.
              </p>
              <p className={`text-sm mt-2 ${
                theme === "light" ? "text-slate-600" : "text-slate-400"
              }`}>
                Our moderation team will review this report shortly.
              </p>
            </div>

            <button
              onClick={onClose}
              className={`w-full px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                theme === "light"
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
              }`}
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
