'use client'

import { useEffect, useState } from 'react'

export default function SimplePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('SimplePage mounted')
  }, [])

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontFamily: 'system-ui'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <div style={{
        maxWidth: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>
          ✅ React is Working!
        </h1>
        
        <div style={{
          background: 'rgba(16, 185, 129, 0.3)',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '15px'
        }}>
          <strong>JavaScript Loaded</strong>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          <strong>Screen:</strong> {window.innerWidth}x{window.innerHeight}
        </div>

        <a 
          href="/matches"
          style={{
            display: 'block',
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#667eea',
            padding: '15px',
            borderRadius: '10px',
            textDecoration: 'none',
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: '15px'
          }}
        >
          Go to Matches
        </a>
      </div>
    </div>
  )
}


