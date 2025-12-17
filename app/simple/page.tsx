export default function SimplePage() {
  return (
    <html>
      <head>
        <title>Simple Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: '20px', background: 'white', color: 'black', fontFamily: 'Arial' }}>
        <h1>Simple Test Page</h1>
        <p>If you see this, the server is working!</p>
        <p>Time: {new Date().toLocaleString()}</p>
        <a href="/matches" style={{ color: 'blue', textDecoration: 'underline' }}>Go to Matches</a>
      </body>
    </html>
  )
}
