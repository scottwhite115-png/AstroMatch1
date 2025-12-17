'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Small delay to ensure router is ready
    const timer = setTimeout(() => {
      router.push('/matches')
    }, 50)
    return () => clearTimeout(timer)
  }, [router])
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'white',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <p style={{ color: 'black', fontSize: '18px' }}>Loading AstroMatch...</p>
      <a 
        href="/network-test" 
        style={{ color: 'blue', textDecoration: 'underline', fontSize: '14px' }}
      >
        Network Test
      </a>
      <a 
        href="/matches" 
        style={{ color: 'blue', textDecoration: 'underline', fontSize: '14px' }}
      >
        Go to Matches
      </a>
    </div>
  )
}
