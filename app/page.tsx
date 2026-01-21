'use client'

import { useEffect } from 'react'

export default function HomePage() {
  // In static export, HomePage can render on any page
  // Only show loading + redirect when at root
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
  
  useEffect(() => {
    if (currentPath !== '/') return
    
    const timer = setTimeout(() => {
            window.location.href = '/matches'
    }, 100)
    return () => clearTimeout(timer)
  }, [currentPath])
  
  // CRITICAL FIX: Return null when not at root
  // This prevents HomePage from blocking other pages (fixes Apple's blank screen issue)
  if (currentPath !== '/') {
    return null
  }
  
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
          href="/matches" 
        style={{ color: 'blue', textDecoration: 'underline', fontSize: '14px' }}
        >
          Go to Matches
        </a>
    </div>
  )
}
