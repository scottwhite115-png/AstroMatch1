'use client'

export default function TestSimple() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'system-ui',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem' }}>✅ Test Works!</h1>
      <p>This page uses the client component.</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="/matches" style={{ padding: '1rem 2rem', background: '#f97316', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
          Go to Matches
        </a>
        <a href="/astrology" style={{ padding: '1rem 2rem', background: '#8b5cf6', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
          Go to Astrology
        </a>
      </div>
    </div>
  )
}
