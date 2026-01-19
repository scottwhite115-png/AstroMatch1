"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { isCapacitor, getOAuthRedirectUrl } from "@/lib/utils/capacitor"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
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
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08l-.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
)

const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()
  const router = useRouter()
  const supabase = createClient()

  // Check for error in URL params (from OAuth callback failures)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const errorParam = params.get("error")
      if (errorParam) {
        setError(decodeURIComponent(errorParam))
        // Clean up URL
        router.replace("/login")
      }
    }
  }, [router])

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get the appropriate redirect URL based on platform
      const redirectUrl = getOAuthRedirectUrl()

      console.log("OAuth login - Provider:", provider)
      console.log("OAuth login - Redirect URL:", redirectUrl)
      console.log("OAuth login - Is Capacitor:", isCapacitor())
      
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: provider === 'google' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : {},
        },
      })
      
      if (oauthError) {
        console.error(`${provider} OAuth error:`, oauthError)
        setError(`Failed to sign in with ${provider === 'apple' ? 'Apple' : 'Google'}. ${oauthError.message}`)
        setIsLoading(false)
        return
      }

      // If successful, redirect to OAuth provider's page
      if (data?.url) {
        console.log("OAuth redirect URL:", data.url)
        
        const inNativeApp = isCapacitor()
        
        if (inNativeApp) {
          // Use Capacitor Browser plugin to open OAuth in an in-app browser
          // This uses Chrome Custom Tabs which keeps users within the app context
          try {
            const { Browser } = await import('@capacitor/browser')
            const { App } = await import('@capacitor/app')
            
            // Set up listener for deep links to handle OAuth callback
            const urlListener = await App.addListener('appUrlOpen', async (event: any) => {
              const url = event.url
              console.log('App opened with URL:', url)
              
              // Handle OAuth callback deep links
              if (url.includes('/auth/callback') || url.includes('callback-mobile')) {
                // Close the in-app browser
                await Browser.close()
                
                // Remove the listener
                await urlListener.remove()
                
                // Navigate to the callback URL in the app
                window.location.href = url
              }
            })
            
            // Open OAuth URL in in-app browser (Chrome Custom Tabs)
            await Browser.open({ 
              url: data.url,
              presentationStyle: 'popover',
              toolbarColor: '#000000'
            })
          } catch (err) {
            console.error("OAuth setup error:", err)
            setError(`Failed to start ${provider === 'apple' ? 'Apple' : 'Google'} sign in. Please try again.`)
            setIsLoading(false)
          }
        } else {
          // Web browser - use standard redirect
          window.location.href = data.url
        }
      } else {
        console.error("No redirect URL returned from OAuth")
        setError(`Failed to start ${provider === 'apple' ? 'Apple' : 'Google'} sign in. Please try again.`)
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error("OAuth exception:", err)
      setError(err.message || `Failed to sign in with ${provider === 'apple' ? 'Apple' : 'Google'}. Please try again.`)
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      setIsLoading(true)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (signInError) {
        setError(signInError.message || "Invalid email or password")
        return
      }

      // Success - redirect to matches page
      router.push("/matches")
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen w-full overflow-y-auto">
      <div className="flex flex-col items-center justify-start min-h-screen px-6 pb-20 relative z-10" style={{ paddingTop: 'max(env(safe-area-inset-top), 100px)' }}>
        <div className="mb-8 text-center mt-8">
          <div className="flex items-center justify-center gap-0.5 mb-2">
            <FourPointedStar className="w-9 h-9 text-orange-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
              AstroMatch
            </h1>
          </div>
          <p className="text-gray-700 text-sm">Western + Chinese compatibility, simplified</p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm">
          <h2 className="text-gray-900 text-lg font-semibold text-center mb-4">Sign in</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <Button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              disabled={isLoading}
              className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon className="w-5 h-5" />
              Sign in with Google
            </Button>

            <Button
              type="button"
              onClick={() => handleOAuthLogin("apple")}
              disabled={isLoading}
              className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AppleIcon className="w-5 h-5" />
              Sign in with Apple
            </Button>

            <Button
              type="button"
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <MailIcon className="w-5 h-5" />
              Sign in with Email
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-300 ${showEmailForm ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showEmailForm ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-gray-50 backdrop-blur-sm rounded-lg border border-gray-200 p-6 mb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-4">
              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  Forgot your password?
                </Link>
              </div>

              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-sm text-gray-600">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-700">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => window.location.href = '/signup'}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer underline bg-transparent border-none p-0"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
