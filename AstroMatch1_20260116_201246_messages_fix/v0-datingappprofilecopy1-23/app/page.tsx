'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    console.log('Home page mounted on client')
  }, [])

  useEffect(() => {
    if (isClient) {
      console.log('Redirecting to /matches in 500ms')
      const timer = setTimeout(() => {
        try {
          router.push("/matches")
        } catch (error) {
          console.error('Error redirecting:', error)
          // Fallback: try window.location
          if (typeof window !== 'undefined') {
            window.location.href = '/matches'
          }
        }
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [router, isClient])

  // Show loading screen during SSR and initial client render
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.5rem',
          marginBottom: '1rem' 
        }}>
          <svg viewBox="0 0 24 24" style={{ width: '3rem', height: '3rem', fill: '#fbbf24' }}>
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '1.875rem',
            background: 'linear-gradient(to right, #fbbf24, #f97316, #dc2626)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AstroMatch
          </span>
        </div>
        <p style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
          {isClient ? 'Loading matches...' : 'Initializing...'}
        </p>
      </div>
    </div>
  )
}
