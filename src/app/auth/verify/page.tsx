'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import TwinkleBackground from '@/components/TwinkleBackground'
import Logo from '@/components/Logo'

export default function VerifyEmail() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/onboarding` : undefined,
        },
      })

      if (error) throw error
      setStatus('sent')
      setMessage('Check your inbox for a verification link.')
    } catch (err: any) {
      setStatus('error')
      setMessage(err?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen relative">
      <TwinkleBackground />

      <header className="w-full flex justify-center pt-10">
        <Logo starSize={40} textSizePx={32} />
      </header>

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] rounded-2xl shadow-2xl bg-white/90 backdrop-blur p-6">
          <h1 className="text-xl font-semibold text-center mb-1">Verify your email</h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            Enter your email and we’ll send a magic link to sign in.
          </p>

          <form onSubmit={handleSendLink} className="space-y-4">
            <label className="block">
              <span className="block text-sm font-medium mb-1">Email</span>
              <input
                type="email"
                required
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#ff7a00]"
              />
            </label>

            <button
              type="submit"
              disabled={status === 'loading' || email.length === 0}
              className="w-full h-12 rounded-xl bg-[#ff7a00] text-white font-semibold hover:opacity-95 disabled:opacity-60 transition"
            >
              {status === 'loading' ? 'Sending…' : 'Send verification link'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 text-center text-sm ${status === 'error' ? 'text-red-600' : 'text-emerald-700'}`}>
              {message}
            </div>
          )}

          <p className="text-[12px] text-center text-gray-500 mt-6">
            By continuing, you agree to our Terms & Privacy.
          </p>
        </div>
      </main>
    </div>
  )
}


