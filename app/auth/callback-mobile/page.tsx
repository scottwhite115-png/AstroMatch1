"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isCapacitor } from '@/lib/utils/capacitor'

export default function CallbackMobilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      // If in Capacitor, try to close the browser
      if (isCapacitor()) {
        try {
          const { Browser } = await import('@capacitor/browser')
          await Browser.close()
        } catch (err) {
          console.log('Could not close browser:', err)
        }
      }

      const code = searchParams.get('code')
      const error = searchParams.get('error')
      
      if (error) {
        router.push(`/login?error=${encodeURIComponent(error)}`)
        return
      }

      if (!code) {
        router.push('/login?error=Invalid verification link')
        return
      }

      try {
        const supabase = createClient()
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          router.push(`/login?error=${encodeURIComponent(exchangeError.message)}`)
          return
        }

        // Success - redirect to matches
        router.push('/matches')
      } catch (err: any) {
        router.push(`/login?error=${encodeURIComponent(err.message || 'Authentication failed')}`)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}

