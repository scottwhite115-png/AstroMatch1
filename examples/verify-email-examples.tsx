/**
 * Email Verification Page Examples
 * Shows different patterns for email verification UI
 */

// ============================================
// Basic Version (Your Example, Enhanced)
// ============================================

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { resendConfirmation } from "@/lib/auth";
import { useAuth } from "@/lib/hooks/use-auth";

export default function VerifyEmailBasic() {
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setResending(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: user.email,
        });

        if (error) throw error;

        setMessage("✓ Verification email re-sent. Check your inbox.");
      } else {
        setMessage("⚠ No email found. Please sign up again.");
      }
    } catch (error: any) {
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-2">Check your email</h1>
      <p className="mb-4">
        We've sent a verification link. Click it to continue.
      </p>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.startsWith("✓")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <button
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        onClick={handleResend}
        disabled={resending}
      >
        {resending ? "Sending..." : "Resend email"}
      </button>
    </div>
  );
}

// ============================================
// Full-Featured Version
// ============================================

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export function VerifyEmailComplete() {
  const router = useRouter();
  const { user } = useAuth();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Check if already verified
  useEffect(() => {
    if (user?.email_confirmed_at) {
      router.replace("/matches");
    }
  }, [user, router]);

  // Countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    setResending(true);
    setMessage("");

    try {
      const { user } = await getCurrentUser();

      if (!user?.email) {
        setMessage("No email found. Please sign up again.");
        return;
      }

      const { error } = await resendConfirmation(user.email);

      if (error) throw error;

      setMessage("✓ Verification email sent! Check your inbox and spam folder.");
      setCountdown(60); // 60 second cooldown
    } catch (error: any) {
      console.error("Resend error:", error);
      setMessage(`Error: ${error.message || "Failed to send email"}`);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Icon */}
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2">
          Check your email
        </h1>

        {/* Email address */}
        {user?.email && (
          <p className="text-center text-gray-600 mb-4">
            We sent a verification link to{" "}
            <span className="font-medium text-gray-900">{user.email}</span>
          </p>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Next steps:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Check your inbox for our email</li>
            <li>Click the verification link</li>
            <li>You'll be redirected back to the app</li>
          </ol>
        </div>

        {/* Didn't receive email? */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">Didn't receive the email?</p>
          <ul className="text-sm text-gray-600 space-y-2 mb-4 list-disc list-inside">
            <li>Check your spam or junk folder</li>
            <li>Make sure you entered the correct email</li>
            <li>Wait a few minutes and try again</li>
          </ul>

          {/* Message display */}
          {message && (
            <div
              className={`mb-4 p-3 rounded text-sm ${
                message.startsWith("✓")
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Resend button */}
          <button
            onClick={handleResend}
            disabled={resending || countdown > 0}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {resending
              ? "Sending..."
              : countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend verification email"}
          </button>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-6 border-t text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Minimal Version
// ============================================

export function VerifyEmailMinimal() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    if (!user?.email) return;

    await supabase.auth.resend({
      type: "signup",
      email: user.email,
    });

    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <div className="mb-4">
        <svg
          className="w-16 h-16 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      <h1 className="text-xl font-semibold mb-2">Verify your email</h1>
      <p className="text-gray-600 mb-6">
        Check your inbox for a verification link.
      </p>

      {sent && (
        <p className="text-green-600 text-sm mb-4">✓ Email sent!</p>
      )}

      <button
        onClick={handleResend}
        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
      >
        Resend email
      </button>
    </div>
  );
}

// ============================================
// Auto-Check Version (Polls for verification)
// ============================================

export function VerifyEmailAutoCheck() {
  const router = useRouter();
  const { user } = useAuth();
  const [checking, setChecking] = useState(false);

  // Auto-check every 3 seconds
  useEffect(() => {
    const checkVerification = async () => {
      setChecking(true);
      const { user } = await getCurrentUser();

      if (user?.email_confirmed_at) {
        router.replace("/matches");
      }

      setChecking(false);
    };

    // Check immediately
    checkVerification();

    // Then check every 3 seconds
    const interval = setInterval(checkVerification, 3000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-2">Verify your email</h1>
      <p className="text-gray-600 mb-4">
        Check your inbox and click the verification link.
      </p>

      {checking && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
          <span>Checking verification status...</span>
        </div>
      )}
    </div>
  );
}

// ============================================
// RECOMMENDED: Full-Featured with Auto-Check
// ============================================

export default function VerifyEmailPage() {
  return <VerifyEmailComplete />;
}

