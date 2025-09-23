'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'demo'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have valid Supabase credentials
        const hasValidCredentials = process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here'

        if (!hasValidCredentials) {
          setStatus('demo')
          setMessage('🚧 Supabase not configured yet. This is a demo - authentication will work once Supabase is set up!')
          return
        }

        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setStatus('error')
          setMessage(`Authentication error: ${error.message}`)
        } else if (data.session) {
          setStatus('success')
          setMessage('Successfully logged in! Welcome to AstroMatch!')
        } else {
          setStatus('error')
          setMessage('No active session found. Please try logging in again.')
        }
      } catch (error: any) {
        setStatus('error')
        setMessage(`Unexpected error: ${error.message}`)
      }
    }

    handleAuthCallback()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-purple-600">AstroMatch</CardTitle>
          <CardDescription>
            Authentication Callback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p>Processing authentication...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="text-green-600 text-4xl mb-4">✅</div>
              <p className="text-green-800 mb-4">{message}</p>
              <Link href="/demo">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Continue to App
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="text-red-600 text-4xl mb-4">❌</div>
              <p className="text-red-800 mb-4">{message}</p>
              <div className="space-y-2">
                <Link href="/auth/login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Try Again
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" className="w-full">
                    Use Demo Instead
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {status === 'demo' && (
            <div className="text-center">
              <div className="text-blue-600 text-4xl mb-4">🚧</div>
              <p className="text-blue-800 mb-4">{message}</p>
              <div className="space-y-2">
                <Link href="/demo">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Try Demo
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
