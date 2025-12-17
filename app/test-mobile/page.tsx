export default function TestMobile() {
  return (
    <div style={{ padding: '20px', background: 'white', color: 'black', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Mobile Test Page</h1>
      <p>If you see this, React is working!</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  )
}
