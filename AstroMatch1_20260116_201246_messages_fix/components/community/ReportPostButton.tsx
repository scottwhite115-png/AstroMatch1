"use client"

import { useState } from "react"

const Flag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

interface ReportPostButtonProps {
  postId: string
  postTitle?: string
  theme?: "light" | "dark"
}

const REPORT_REASONS = [
  "Spam or misleading",
  "Harassment or hate speech",
  "Violence or dangerous content",
  "Inappropriate or explicit content",
  "Misinformation",
  "Other (please specify)",
]

export function ReportPostButton({ postId, postTitle, theme = "light" }: ReportPostButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit() {
    const reason = selectedReason === "Other (please specify)" 
      ? customReason 
      : selectedReason

    if (!reason || reason.trim().length < 5) {
      alert("Please provide a reason (at least 5 characters)")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/community/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, reason }),
      })

      const data = await res.json()

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setIsOpen(false)
          setSubmitted(false)
          setSelectedReason("")
          setCustomReason("")
        }, 2000)
      } else {
        alert(data.error || "Failed to submit report")
      }
    } catch (error) {
      console.error("Report error:", error)
      alert("Failed to submit report")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
        theme === "light" 
          ? "bg-green-100 text-green-700" 
          : "bg-green-900/30 text-green-400"
      }`}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="text-xs font-medium">Report submitted</span>
      </div>
    )
  }

  return (
    <>
      {/* Report Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
          theme === "light"
            ? "text-gray-600 hover:text-red-600 hover:bg-red-50"
            : "text-gray-400 hover:text-red-400 hover:bg-red-900/20"
        }`}
      >
        <Flag className="w-3.5 h-3.5" />
        <span>Report</span>
      </button>

      {/* Report Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-xl shadow-xl ${
            theme === "light" 
              ? "bg-white" 
              : "bg-slate-800"
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              theme === "light" ? "border-gray-200" : "border-slate-700"
            }`}>
              <div className="flex items-center gap-2">
                <Flag className={`w-5 h-5 ${
                  theme === "light" ? "text-red-600" : "text-red-400"
                }`} />
                <h3 className={`font-semibold ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>
                  Report Post
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-lg transition-colors ${
                  theme === "light"
                    ? "hover:bg-gray-100 text-gray-500"
                    : "hover:bg-slate-700 text-gray-400"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {postTitle && (
                <div className={`text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}>
                  Reporting: <span className="font-medium">{postTitle}</span>
                </div>
              )}

              {/* Reason Selection */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}>
                  Why are you reporting this post?
                </label>
                <div className="space-y-2">
                  {REPORT_REASONS.map((reason) => (
                    <label
                      key={reason}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedReason === reason
                          ? theme === "light"
                            ? "bg-red-50 border-red-500"
                            : "bg-red-900/20 border-red-500"
                          : theme === "light"
                          ? "bg-white border-gray-200 hover:border-gray-300"
                          : "bg-slate-700/50 border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="mt-0.5"
                      />
                      <span className={`text-sm ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>
                        {reason}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Reason Input */}
              {selectedReason === "Other (please specify)" && (
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}>
                    Please provide details
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Describe why you're reporting this post..."
                    className={`w-full px-3 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-slate-700 border-slate-600 text-white"
                    }`}
                    rows={3}
                    maxLength={500}
                  />
                  <div className={`text-xs text-right ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}>
                    {customReason.length}/500
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex gap-3 p-4 border-t ${
              theme === "light" ? "border-gray-200" : "border-slate-700"
            }`}>
              <button
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === "light"
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedReason || loading}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === "light"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-red-500 text-white hover:bg-red-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

