/**
 * Phone Verification Flow Components
 * Complete phone verification UX
 */
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneInput, OtpInput } from "@/components/phone-input";
import {
  sendPhoneOtp,
  verifyPhoneOtp,
  formatPhoneNumber,
} from "@/lib/phone";

// ============================================
// Step 1: Enter Phone Number
// ============================================

interface PhoneEntryProps {
  onSuccess: (phone: string) => void;
}

export function PhoneEntryStep({ onSuccess }: PhoneEntryProps) {
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setSending(true);
    setError("");

    try {
      const { error: otpError } = await sendPhoneOtp(phone);

      if (otpError) throw otpError;

      onSuccess(phone);
    } catch (err: any) {
      console.error("Phone OTP error:", err);
      setError(err.message || "Failed to send code");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Verify your phone</h1>
        <p className="text-gray-600">
          We'll send you a code to verify your number
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            onValidChange={setIsValid}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            Standard messaging rates may apply
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || sending}
          className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? "Sending code..." : "Send verification code"}
        </button>
      </form>
    </div>
  );
}

// ============================================
// Step 2: Verify OTP Code
// ============================================

interface OtpVerificationProps {
  phone: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function OtpVerificationStep({
  phone,
  onSuccess,
  onBack,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer
  useState(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  });

  const handleVerify = async (code: string) => {
    setVerifying(true);
    setError("");

    try {
      const { error: verifyError } = await verifyPhoneOtp(phone, code);

      if (verifyError) throw verifyError;

      onSuccess();
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError("Invalid code. Please try again.");
      setOtp(""); // Clear OTP
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");

    try {
      const { error: otpError } = await sendPhoneOtp(phone);

      if (otpError) throw otpError;

      setCountdown(60); // 60 second cooldown
      setError(""); // Clear any previous errors
    } catch (err: any) {
      console.error("Resend error:", err);
      setError("Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Enter verification code</h1>
        <p className="text-gray-600">
          We sent a 6-digit code to
          <br />
          <span className="font-medium text-gray-900">
            {formatPhoneNumber(phone)}
          </span>
        </p>
        <button
          onClick={onBack}
          className="text-sm text-purple-600 hover:text-purple-700 mt-2"
        >
          Change number
        </button>
      </div>

      <div className="space-y-6">
        <OtpInput
          value={otp}
          onChange={setOtp}
          onComplete={handleVerify}
          disabled={verifying}
        />

        {verifying && (
          <div className="text-center text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2" />
            <p className="text-sm">Verifying code...</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 border border-red-200 rounded-lg text-red-800 text-sm text-center">
            {error}
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={resending || countdown > 0}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending
              ? "Sending..."
              : countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Complete Flow Component
// ============================================

export default function PhoneVerificationPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");

  const handlePhoneSuccess = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setStep("otp");
  };

  const handleOtpSuccess = () => {
    // Phone verified! Redirect based on profile completeness
    router.replace("/profile-builder");
  };

  const handleBack = () => {
    setStep("phone");
    setPhone("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        {step === "phone" && <PhoneEntryStep onSuccess={handlePhoneSuccess} />}
        {step === "otp" && (
          <OtpVerificationStep
            phone={phone}
            onSuccess={handleOtpSuccess}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

