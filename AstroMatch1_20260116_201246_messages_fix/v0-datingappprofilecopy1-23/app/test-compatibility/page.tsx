"use client"

/**
 * Test page to verify compatibility blurbs are loading correctly
 * Visit: http://localhost:3000/test-compatibility
 */

import { useState, useEffect } from "react"
import { useCompatibility } from "@/lib/hooks/useCompatibilityBlurbs"
import { getCompatibilityTier } from "@/lib/compatibilityWithBlurbs"

const WESTERN_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
const EASTERN_SIGNS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"]

export default function TestCompatibilityPage() {
  const [westA, setWestA] = useState("Aries")
  const [eastA, setEastA] = useState("Rat")
  const [westB, setWestB] = useState("Taurus")
  const [eastB, setEastB] = useState("Ox")

  const compatibility = useCompatibility(westA, eastA, westB, eastB)
  const tierInfo = getCompatibilityTier(compatibility.score)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '20px',
        padding: '30px',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '2.5em', marginBottom: '10px', textAlign: 'center' }}>
          🔮 Compatibility Test
        </h1>
        <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '40px' }}>
          Testing the 144×144 pre-generated blurb system
        </p>

        {/* Person A */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '1.5em', marginBottom: '15px' }}>👤 Person A</h2>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Western Sign:
              </label>
              <select
                value={westA}
                onChange={(e) => setWestA(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  fontSize: '16px',
                  border: 'none'
                }}
              >
                {WESTERN_SIGNS.map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Eastern Sign:
              </label>
              <select
                value={eastA}
                onChange={(e) => setEastA(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  fontSize: '16px',
                  border: 'none'
                }}
              >
                {EASTERN_SIGNS.map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Person B */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.5em', marginBottom: '15px' }}>👤 Person B</h2>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Western Sign:
              </label>
              <select
                value={westB}
                onChange={(e) => setWestB(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  fontSize: '16px',
                  border: 'none'
                }}
              >
                {WESTERN_SIGNS.map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Eastern Sign:
              </label>
              <select
                value={eastB}
                onChange={(e) => setEastB(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  fontSize: '16px',
                  border: 'none'
                }}
              >
                {EASTERN_SIGNS.map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          padding: '25px',
          borderRadius: '15px',
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.8em', margin: 0 }}>
              💕 Compatibility
            </h2>
            <div style={{ fontSize: '3em', fontWeight: 'bold' }}>
              {compatibility.loading ? "..." : `${compatibility.score}%`}
            </div>
          </div>

          {compatibility.loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '1.2em', opacity: 0.8 }}>Loading blurbs...</div>
            </div>
          ) : compatibility.error ? (
            <div style={{
              background: 'rgba(255,0,0,0.2)',
              padding: '15px',
              borderRadius: '10px',
              border: '1px solid rgba(255,0,0,0.5)'
            }}>
              <strong>Error:</strong> {compatibility.error}
            </div>
          ) : (
            <>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '15px'
              }}>
                <div style={{ fontSize: '1.3em', fontWeight: 'bold', marginBottom: '8px' }}>
                  {tierInfo.emoji} {compatibility.tier}
                </div>
                <div style={{ fontSize: '1.1em', lineHeight: '1.6', opacity: 0.95 }}>
                  {compatibility.blurb}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                fontSize: '0.9em',
                opacity: 0.7
              }}>
                <div>
                  <strong>Tier:</strong> {tierInfo.tier}
                </div>
                <div>
                  <strong>Color:</strong> {tierInfo.color}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Test Info */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '10px',
          fontSize: '0.9em',
          opacity: 0.8
        }}>
          <h3 style={{ marginBottom: '10px' }}>ℹ️ Test Info</h3>
          <p>This page tests the 144×144 compatibility blurb system.</p>
          <p style={{ marginTop: '10px' }}>
            <strong>Current Query:</strong> {westA} {eastA} × {westB} {eastB}
          </p>
          <p style={{ marginTop: '10px' }}>
            <strong>Key:</strong> {westA.toLowerCase()}_{eastA.toLowerCase()}___{westB.toLowerCase()}_{eastB.toLowerCase()}
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '10px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.1em',
              fontWeight: 'bold',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            ← Back to App
          </a>
        </div>
      </div>
    </div>
  )
}


