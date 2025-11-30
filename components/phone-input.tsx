/**
 * Phone Input Component
 * Formatted phone number input with country code
 */

import { useState, useEffect } from "react";
import { parsePhoneToE164, isValidPhone, formatPhoneNumber } from "@/lib/phone";

interface PhoneInputProps {
  value: string;
  onChange: (phoneE164: string) => void;
  onValidChange?: (isValid: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  onValidChange,
  placeholder = "(555) 555-5555",
  disabled = false,
  required = false,
  autoFocus = false,
  className = "",
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");

  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhoneNumber(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);

    // Parse to E.164
    const e164 = parsePhoneToE164(input, countryCode);
    const valid = isValidPhone(e164);

    setIsValid(valid);
    onValidChange?.(valid);

    if (valid) {
      onChange(e164);
    }
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setCountryCode(newCode);

    // Re-parse with new country code
    if (displayValue) {
      const e164 = parsePhoneToE164(displayValue, newCode);
      const valid = isValidPhone(e164);
      setIsValid(valid);
      onValidChange?.(valid);
      if (valid) {
        onChange(e164);
      }
    }
  };

  return (
    <div className="flex gap-2">
      {/* Country Code Select */}
      <select
        value={countryCode}
        onChange={handleCountryCodeChange}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        <option value="+1">🇺🇸 +1</option>
        <option value="+44">🇬🇧 +44</option>
        <option value="+91">🇮🇳 +91</option>
        <option value="+86">🇨🇳 +86</option>
        <option value="+81">🇯🇵 +81</option>
        <option value="+49">🇩🇪 +49</option>
        <option value="+33">🇫🇷 +33</option>
        <option value="+61">🇦🇺 +61</option>
        <option value="+55">🇧🇷 +55</option>
        <option value="+52">🇲🇽 +52</option>
      </select>

      {/* Phone Number Input */}
      <div className="flex-1 relative">
        <input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={`
            w-full px-4 py-2 border rounded-lg
            focus:ring-2 focus:ring-purple-500 focus:border-transparent
            ${isValid && displayValue ? "border-green-500" : "border-gray-300"}
            ${!isValid && displayValue ? "border-red-500" : ""}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            ${className}
          `}
        />

        {/* Validation Icon */}
        {displayValue && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * OTP Input Component
 * 6-digit OTP code entry
 */

interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  onComplete?: (otp: string) => void;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
  onComplete,
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));

  useEffect(() => {
    // Update digits from value
    const newDigits = value.padEnd(length, "").split("").slice(0, length);
    setDigits(newDigits);
  }, [value, length]);

  const handleChange = (index: number, digit: string) => {
    // Only allow digits
    if (digit && !/^\d$/.test(digit)) return;

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    const newValue = newDigits.join("");
    onChange(newValue);

    // Auto-focus next input
    if (digit && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Call onComplete when all digits filled
    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      // Focus previous input on backspace
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedDigits = pastedData.replace(/\D/g, "").slice(0, length);

    const newDigits = [...digits];
    for (let i = 0; i < pastedDigits.length; i++) {
      newDigits[i] = pastedDigits[i];
    }
    setDigits(newDigits);

    const newValue = newDigits.join("");
    onChange(newValue);

    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          className={`
            w-12 h-14 text-center text-2xl font-bold
            border-2 rounded-lg
            focus:ring-2 focus:ring-purple-500 focus:border-purple-500
            ${digit ? "border-purple-500" : "border-gray-300"}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
        />
      ))}
    </div>
  );
}

