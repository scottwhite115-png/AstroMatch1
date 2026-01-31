"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const redirectUrl = typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      })
      if (err) {
        setError(err.message)
        return
      }
      setSent(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-8 text-center">
          <h1 className="text-xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-white/70 text-sm mb-6">
            We sent a password reset link to <strong className="text-white">{email}</strong>. Click the link in that email to set a new password.
          </p>
          <Link
            href="/login"
            className="inline-block text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-8">
        <h1 className="text-xl font-bold text-white mb-2">Forgot your password?</h1>
        <p className="text-white/70 text-sm mb-6">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 px-4 py-3 font-medium text-black hover:bg-amber-400 disabled:opacity-50 transition-colors"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <p className="mt-6 text-center">
          <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
