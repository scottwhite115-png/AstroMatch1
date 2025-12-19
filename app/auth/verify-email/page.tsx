"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function VerifyEmail() {
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Get the email from URL params first (most reliable)
    const getEmailFromUrl = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get("email");
        if (emailParam) {
          setEmail(emailParam);
          console.log("Got email from URL:", emailParam);
          return emailParam;
        }
      }
      return null;
    };

    // Try URL params first
    const urlEmail = getEmailFromUrl();

    // Get the email from the user session if not in URL
    const getUserEmail = async () => {
      // If we already have email from URL, skip
      if (urlEmail) {
        return;
      }

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        // Auth session missing is expected on this page, don't log as error
        if (userError && userError.message !== 'Auth session missing!') {
          // Only log non-session errors
          console.warn("Error getting user email:", userError.message);
        }
        
        if (user?.email) {
          setEmail(user.email);
          console.log("Got email from user session:", user.email);
        }
      } catch (err: any) {
        // Only log if it's not a session missing error
        if (err?.message !== 'Auth session missing!') {
          console.warn("Error getting user email:", err);
        }
      }
    };
    getUserEmail();

    // Check if user is already verified - check every 2 seconds
    const checkVerification = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        // Auth session missing is expected, don't treat as error
        if (userError && userError.message === 'Auth session missing!') {
          return;
        }
        
        if (userError) {
          // Only log non-session errors
          console.warn("Error getting user:", userError.message);
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
      } catch (err: any) {
        // Only log if it's not a session missing error
        if (err?.message !== 'Auth session missing!') {
          console.warn("Error checking verification:", err);
        }
      }
    };
    
    // Check immediately
    checkVerification();
    
    // Also set up interval to check periodically
    const interval = setInterval(checkVerification, 2000);
    
    return () => clearInterval(interval);
  }, [supabase, router, email]);

  const handleResend = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    console.log("Resend button clicked");
    console.log("Current email state:", email);
    
    // Try to get email - check URL params first (most reliable)
    let emailToUse = email;
    
    // Always check URL params first (most reliable)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) {
        emailToUse = emailParam;
        if (!email) {
          setEmail(emailParam);
        }
        console.log("Got email from URL params for resend:", emailToUse);
      }
    }

    // If still no email, try user session
    if (!emailToUse) {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (user?.email) {
          emailToUse = user.email;
          if (!email) {
            setEmail(user.email);
          }
          console.log("Got email from user session for resend:", emailToUse);
        } else if (userError && userError.message !== 'Auth session missing!') {
          console.warn("Error getting user:", userError.message);
        }
      } catch (err: any) {
        // Only log if it's not a session missing error
        if (err?.message !== 'Auth session missing!') {
          console.warn("Error getting email:", err);
        }
      }
    }

    if (!emailToUse) {
      console.error("No email found for resend");
      setError("Email address not found. Please check the URL or sign up again. If you just signed up, try refreshing this page.");
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

      console.log("Resending verification email to:", emailToUse);
      console.log("Redirect URL:", redirectUrl);
      console.log("Supabase client:", supabase);
      console.log("Auth object:", supabase.auth);
      console.log("Resend method exists:", typeof supabase.auth.resend);

      // Check if resend method exists
      if (typeof supabase.auth.resend !== 'function') {
        throw new Error("Resend method is not available. Please update your Supabase client library.");
      }

      // Use the resend method
      const { data, error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: emailToUse,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (resendError) {
        console.error("Resend error details:", {
          message: resendError.message,
          status: resendError.status,
          error: resendError
        });
        setError(resendError.message || "Failed to resend email. Please try again.");
      } else {
        console.log("Resend successful:", data);
        setMessage("Verification email sent! Please check your inbox (and spam folder) for an email from Supabase Authentication.");
      }
    } catch (err: any) {
      console.error("Resend exception:", err);
      setError(err.message || "Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6" suppressHydrationWarning>
      <div className="max-w-md w-full space-y-6" suppressHydrationWarning>
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-0.5 mb-2">
            <FourPointedStar className="w-9 h-9 text-orange-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
              AstroMatch
            </h1>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-600 mb-4">
            We sent a verification link to your email.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Click the link in the email to verify your account and continue.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            <strong>Note:</strong> The email will come from <strong>Supabase Authentication</strong>
          </p>
        </div>

        {message ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{message}</p>
          </div>
        ) : null}

        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        ) : null}

        <div className="space-y-3">
          <button
            onClick={handleResend}
            disabled={isResending}
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
