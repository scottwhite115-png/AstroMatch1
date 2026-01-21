'use client'

export default function TestMobile() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Mobile Test Page</h1>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>If you can see this, basic rendering works!</p>
      <div style={{
        background: '#1a1a1a',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p>User Agent: {typeof window !== 'undefined' ? navigator.userAgent : 'SSR'}</p>
        <p>Viewport: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'SSR'}</p>
      </div>
    </div>
  )
}

