'use client'

import { useEffect, useState } from 'react'

export default function NetworkTest() {
  const [info, setInfo] = useState<any>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInfo({
        hostname: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol,
        href: window.location.href,
        userAgent: navigator.userAgent,
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      })
    }
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', background: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: 'green', fontSize: '24px', marginBottom: '20px' }}>
        ✓ Network Test Page Working!
      </h1>
      
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Connection Info:</h2>
        <p><strong>Hostname:</strong> {info.hostname || 'Loading...'}</p>
        <p><strong>Port:</strong> {info.port || '3000'}</p>
        <p><strong>Full URL:</strong> {info.href || 'Loading...'}</p>
        <p><strong>Device:</strong> {info.isMobile ? '📱 Mobile' : '💻 Desktop'}</p>
      </div>

      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>To Access on Mobile:</h2>
        <ol style={{ paddingLeft: '20px' }}>
          <li>Make sure your Mac and phone are on the same WiFi</li>
          <li>On your Mac, open Terminal and run: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px' }}>ifconfig | grep "inet " | grep -v 127.0.0.1</code></li>
          <li>Copy the IP address (looks like 192.168.x.x or 172.20.x.x)</li>
          <li>On your phone, go to: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px' }}>http://[THAT_IP]:3000</code></li>
        </ol>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a 
          href="/matches" 
          style={{ 
            display: 'inline-block', 
            padding: '10px 20px', 
            background: '#4CAF50', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px',
            fontSize: '16px'
          }}
        >
          Go to Matches →
        </a>
      </div>
    </div>
  )
}

