"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { MOTION_TIMING, EASING } from "@/lib/premiumFeel";

/**
 * 🔒 Moderation Back Room (Admin Panel v1)
 * 
 * Apple loves when this exists, even if basic.
 * Minimum required fields and actions for report management.
 */

export type ReportStatus = "open" | "reviewing" | "resolved";

export interface ReportRecord {
  reportId: string;
  reporterUserId: string;
  reportedUserId: string;
  reasonCategory: string;
  optionalText?: string;
  timestamp: string;
  matchChatContextId?: string;
  status: ReportStatus;
  moderatorNotes?: string;
  resolutionAction?: string;
}

export type ModeratorAction = "warning" | "suspend" | "ban" | "dismiss";

export default function ModerationPage() {
  const { theme } = useTheme();
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Fetch reports from backend
  useEffect(() => {
    // Simulated data for now
    setIsLoading(false);
  }, []);

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    // TODO: Update report status in backend
    setReports(reports.map(r => r.reportId === reportId ? { ...r, status: newStatus } : r));
  };

  const handleAction = async (reportId: string, action: ModeratorAction) => {
    // TODO: Execute moderator action in backend
    const actionMap: Record<ModeratorAction, string> = {
      warning: "Warning issued",
      suspend: "User suspended",
      ban: "User banned",
      dismiss: "Report dismissed",
    };
    
    setReports(reports.map(r => 
      r.reportId === reportId 
        ? { ...r, status: "resolved", resolutionAction: actionMap[action] }
        : r
    ));
  };

  const handleSaveNotes = async (reportId: string) => {
    // TODO: Save moderator notes to backend
    setReports(reports.map(r => 
      r.reportId === reportId 
        ? { ...r, moderatorNotes }
        : r
    ));
    setModeratorNotes("");
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "light" ? "bg-white" : "bg-slate-950"
      }`}>
        <p className={theme === "light" ? "text-slate-600" : "text-slate-400"}>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === "light" ? "bg-white" : "bg-slate-950"
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-6 ${
          theme === "light" ? "text-slate-900" : "text-slate-100"
        }`}>
          Moderation Back Room
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-2">
            <div className={`rounded-lg ${
              theme === "light" ? "bg-slate-50" : "bg-slate-900"
            } p-4`}>
              <h2 className={`text-xl font-semibold mb-4 ${
                theme === "light" ? "text-slate-900" : "text-slate-100"
              }`}>
                Reports ({reports.length})
              </h2>

              {reports.length === 0 ? (
                <p className={`text-sm ${
                  theme === "light" ? "text-slate-600" : "text-slate-400"
                }`}>
                  No reports to review.
                </p>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.reportId}
                      onClick={() => {
                        setSelectedReport(report);
                        setModeratorNotes(report.moderatorNotes || "");
                      }}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        theme === "light"
                          ? selectedReport?.reportId === report.reportId
                            ? "bg-slate-200 border-2 border-slate-300"
                            : "bg-white border border-slate-200 hover:bg-slate-100"
                          : selectedReport?.reportId === report.reportId
                          ? "bg-slate-800 border-2 border-slate-600"
                          : "bg-slate-800/50 border border-slate-700 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${
                          theme === "light" ? "text-slate-700" : "text-slate-200"
                        }`}>
                          {report.reasonCategory}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          report.status === "open"
                            ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                            : report.status === "reviewing"
                            ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                            : "bg-green-500/20 text-green-600 dark:text-green-400"
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className={`text-xs ${
                        theme === "light" ? "text-slate-500" : "text-slate-400"
                      }`}>
                        {new Date(report.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Report Details Panel */}
          <div className="lg:col-span-1">
            {selectedReport ? (
              <div className={`rounded-lg ${
                theme === "light" ? "bg-slate-50" : "bg-slate-900"
              } p-4 sticky top-4`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === "light" ? "text-slate-900" : "text-slate-100"
                }`}>
                  Report Details
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className={`text-xs mb-1 ${
                      theme === "light" ? "text-slate-500" : "text-slate-400"
                    }`}>
                      Reason
                    </p>
                    <p className={`text-sm ${
                      theme === "light" ? "text-slate-700" : "text-slate-200"
                    }`}>
                      {selectedReport.reasonCategory}
                    </p>
                  </div>

                  {selectedReport.optionalText && (
                    <div>
                      <p className={`text-xs mb-1 ${
                        theme === "light" ? "text-slate-500" : "text-slate-400"
                      }`}>
                        Details
                      </p>
                      <p className={`text-sm ${
                        theme === "light" ? "text-slate-700" : "text-slate-200"
                      }`}>
                        {selectedReport.optionalText}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className={`text-xs mb-1 ${
                      theme === "light" ? "text-slate-500" : "text-slate-400"
                    }`}>
                      Reporter ID
                    </p>
                    <p className={`text-sm font-mono ${
                      theme === "light" ? "text-slate-700" : "text-slate-200"
                    }`}>
                      {selectedReport.reporterUserId}
                    </p>
                  </div>

                  <div>
                    <p className={`text-xs mb-1 ${
                      theme === "light" ? "text-slate-500" : "text-slate-400"
                    }`}>
                      Reported User ID
                    </p>
                    <p className={`text-sm font-mono ${
                      theme === "light" ? "text-slate-700" : "text-slate-200"
                    }`}>
                      {selectedReport.reportedUserId}
                    </p>
                  </div>

                  <div>
                    <p className={`text-xs mb-2 ${
                      theme === "light" ? "text-slate-500" : "text-slate-400"
                    }`}>
                      Status
                    </p>
                    <select
                      value={selectedReport.status}
                      onChange={(e) => handleStatusChange(selectedReport.reportId, e.target.value as ReportStatus)}
                      className={`w-full p-2 rounded-lg text-sm ${
                        theme === "light"
                          ? "bg-white border border-slate-300 text-slate-900"
                          : "bg-slate-800 border border-slate-700 text-slate-100"
                      }`}
                    >
                      <option value="open">Open</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <p className={`text-xs mb-2 ${
                      theme === "light" ? "text-slate-500" : "text-slate-400"
                    }`}>
                      Moderator Notes
                    </p>
                    <textarea
                      value={moderatorNotes}
                      onChange={(e) => setModeratorNotes(e.target.value)}
                      placeholder="Add notes..."
                      className={`w-full p-2 rounded-lg text-sm resize-none ${
                        theme === "light"
                          ? "bg-white border border-slate-300 text-slate-900 placeholder-slate-400"
                          : "bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500"
                      }`}
                      rows={4}
                    />
                    <button
                      onClick={() => handleSaveNotes(selectedReport.reportId)}
                      className={`mt-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        theme === "light"
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                      }`}
                    >
                      Save Notes
                    </button>
                  </div>
                </div>

                {/* Moderator Actions */}
                <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className={`text-xs mb-3 ${
                    theme === "light" ? "text-slate-500" : "text-slate-400"
                  }`}>
                    Actions
                  </p>
                  <button
                    onClick={() => {
                      // TODO: View profile
                      window.open(`/profile/${selectedReport.reportedUserId}`, '_blank');
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      theme === "light"
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      // TODO: View recent messages
                      window.open(`/messages/${selectedReport.reportedUserId}`, '_blank');
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      theme === "light"
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    View Messages
                  </button>
                  <button
                    onClick={() => {
                      // TODO: View report history
                      console.log('View report history for:', selectedReport.reportedUserId);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      theme === "light"
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    Report History
                  </button>
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => handleAction(selectedReport.reportId, "warning")}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        theme === "light"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50"
                      }`}
                    >
                      Issue Warning
                    </button>
                    <button
                      onClick={() => handleAction(selectedReport.reportId, "suspend")}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        theme === "light"
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          : "bg-orange-900/30 text-orange-400 hover:bg-orange-900/50"
                      }`}
                    >
                      Suspend User
                    </button>
                    <button
                      onClick={() => handleAction(selectedReport.reportId, "ban")}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        theme === "light"
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                      }`}
                    >
                      Ban User
                    </button>
                    <button
                      onClick={() => handleAction(selectedReport.reportId, "dismiss")}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        theme === "light"
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                      }`}
                    >
                      Dismiss Report
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-lg ${
                theme === "light" ? "bg-slate-50" : "bg-slate-900"
              } p-4`}>
                <p className={`text-sm ${
                  theme === "light" ? "text-slate-600" : "text-slate-400"
                }`}>
                  Select a report to view details and take action.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
