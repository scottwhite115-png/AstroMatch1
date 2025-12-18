"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Get the email from the user session or URL params
    const getUserEmail = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setEmail(user.email);
        } else {
          // Try to get from URL params if available
          const params = new URLSearchParams(window.location.search);
          const emailParam = params.get("email");
          if (emailParam) {
            setEmail(emailParam);
          }
        }
      } catch (err) {
        console.error("Error getting user email:", err);
      }
    };
    getUserEmail();

    // Check if user is already verified - check every 2 seconds
    const checkVerification = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error getting user:", error);
          return;
        }
        
        if (user?.email_confirmed_at) {
          // User is already verified, redirect to app
          console.log("User already verified, redirecting to matches");
          router.push("/matches");
          return;
        }
        
        // Also check session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email_confirmed_at) {
          console.log("Session user verified, redirecting to matches");
          router.push("/matches");
          return;
        }
      } catch (err) {
        console.error("Error checking verification:", err);
      }
    };
    
    // Check immediately
    checkVerification();
    
    // Also set up interval to check periodically
    const interval = setInterval(checkVerification, 2000);
    
    return () => clearInterval(interval);
  }, [supabase, router]);

  const handleResend = async () => {
    if (!email) {
      setError("Email address not found. Please sign up again.");
      return;
    }

    setIsResending(true);
    setError("");
    setMessage("");

    try {
      // Use production URL from env or fallback to current origin
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        : `${window.location.origin}/auth/callback`

      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (resendError) {
        setError(resendError.message || "Failed to resend email. Please try again.");
        console.error("Resend error:", resendError);
      } else {
        setMessage("Verification email sent! Please check your inbox (and spam folder) for an email from Supabase Authentication.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend email. Please try again.");
      console.error("Resend error:", err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-600 mb-1">
            We sent a verification link to:
          </p>
          {email && (
            <p className="text-gray-900 font-medium mb-4">{email}</p>
          )}
          <p className="text-sm text-gray-600 mb-6">
            Click the link in the email to verify your account and continue.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            <strong>Note:</strong> The email will come from <strong>Supabase Authentication</strong> - check your inbox and spam folder for this sender.
          </p>
        </div>

        {message && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{message}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleResend}
            disabled={isResending || !email}
            className="w-full px-4 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? "Sending..." : "Resend email"}
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Back to Sign Up
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Didn't receive the email?</p>
          <ul className="mt-2 space-y-1 text-left max-w-xs mx-auto">
            <li>• Look for an email from <strong>Supabase Authentication</strong></li>
            <li>• Check your spam/junk folder</li>
            <li>• Wait 1-2 minutes (emails can be delayed)</li>
            <li>• Make sure you used the correct email address</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
