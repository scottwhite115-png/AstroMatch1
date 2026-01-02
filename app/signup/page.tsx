"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

const EyeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="6,9 12,15 18,9" />
  </svg>
)

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
    />
  </svg>
)

const AppleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
)

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const { theme } = useTheme()
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOAuthSignUp = async (provider: "google" | "apple") => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Use production URL from env or fallback to current origin
      // Trim any whitespace to prevent Supabase errors
      const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).trim()
      const redirectUrl = `${baseUrl}/auth/callback`

      console.log("OAuth signup - Provider:", provider)
      console.log("OAuth signup - Redirect URL:", redirectUrl)
      console.log("OAuth signup - Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      
      // Check current cookies before OAuth
      console.log("OAuth signup - Current cookies:", document.cookie)
      
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      
      console.log("OAuth signup - Response data:", data)
      console.log("OAuth signup - Response error:", oauthError)
      
      // Check cookies after OAuth call (PKCE code verifier should be set)
      console.log("OAuth signup - Cookies after OAuth call:", document.cookie)
      
      if (oauthError) {
        console.error("OAuth error:", oauthError)
        setError(`Failed to sign up with ${provider}: ${oauthError.message}`)
        setIsLoading(false)
        return
      }

      // If successful, redirect to Google's OAuth page
      if (data?.url) {
        console.log("OAuth redirect URL:", data.url)
        // Small delay to ensure cookies are set before redirect
        await new Promise(resolve => setTimeout(resolve, 100))
        window.location.href = data.url
      } else {
        console.error("No redirect URL returned from OAuth")
        setError(`Failed to start ${provider} sign up. Please try again.`)
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error("OAuth exception:", err)
      setError(err.message || `Failed to sign up with ${provider}. Please check your browser console for details.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setIsLoading(true)

      // Use production URL from env or fallback to current origin
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        : `${window.location.origin}/auth/callback`

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.name,
          },
          emailRedirectTo: redirectUrl,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // Check if user is already confirmed (email confirmation might be disabled)
      if (data.user?.email_confirmed_at) {
        // User is already confirmed, go straight to matches
        router.push("/matches")
      } else {
        // User needs email verification - pass email as URL parameter
        router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`)
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen w-full overflow-y-auto">
      <div className="flex flex-col items-center justify-start min-h-screen px-6 pb-20 relative z-10" style={{ paddingTop: 'max(env(safe-area-inset-top), 44px)' }}>
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-0.5 mb-2">
            <FourPointedStar className="w-9 h-9 text-orange-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
              AstroMatch
            </h1>
          </div>
          <p className="text-gray-700 text-sm">Find your perfect match</p>
        </div>

        <h2 className="text-gray-900 text-base font-semibold mb-4 text-center">Sign up</h2>

        {error && (
          <div className="w-full max-w-sm mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="w-full max-w-sm">
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              onClick={() => handleOAuthSignUp("google")}
              disabled={isLoading}
              className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon className="w-5 h-5" />
              Sign up with Google
            </Button>

            <Button
              type="button"
              onClick={() => handleOAuthSignUp("apple")}
              disabled={isLoading}
              className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AppleIcon className="w-5 h-5" />
              Sign up with Apple
            </Button>

            <Button
              type="button"
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <MailIcon className="w-5 h-5" />
              Sign up with Email
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-300 ${showEmailForm ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showEmailForm ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-red-400 focus:ring-red-400/20"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-red-400 focus:ring-red-400/20"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Create a password"
                        className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-red-400 focus:ring-red-400/20 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Confirm your password"
                        className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-red-400 focus:ring-red-400/20 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => window.location.href = '/login'}
                  className="text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer underline bg-transparent border-none p-0"
                  style={{ position: 'relative', zIndex: 10 }}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
