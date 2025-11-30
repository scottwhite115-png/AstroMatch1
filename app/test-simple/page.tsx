export default function TestPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000', 
      color: '#fff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '24px',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div>
        <h1>✅ Mobile Test Page Loaded!</h1>
        <p>If you can see this, the server is working.</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
}
