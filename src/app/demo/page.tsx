'use client'

import { useState } from 'react'
import { getWesternSign, getChineseAnimal, getEastWestCombo, getCompatibility } from '@/lib/compatibility/engine'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function DemoPage() {
  const [birthdate1, setBirthdate1] = useState('')
  const [birthdate2, setBirthdate2] = useState('')
  const [result, setResult] = useState<any>(null)

  const calculateCompatibility = () => {
    if (!birthdate1 || !birthdate2) return

    const date1 = new Date(birthdate1)
    const date2 = new Date(birthdate2)

    const sign1 = getWesternSign(date1)
    const animal1 = getChineseAnimal(date1.getFullYear())
    const combo1 = getEastWestCombo(date1)

    const sign2 = getWesternSign(date2)
    const animal2 = getChineseAnimal(date2.getFullYear())
    const combo2 = getEastWestCombo(date2)

    const compatibility = getCompatibility(date1, date2)

    setResult({
      person1: { sign: sign1, animal: animal1, combo: combo1 },
      person2: { sign: sign2, animal: animal2, combo: combo2 },
      compatibility
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-purple-600">AstroMatch Demo</CardTitle>
            <CardDescription>
              Test the compatibility engine with any two birth dates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Person 1 Birth Date</label>
                <Input
                  type="date"
                  value={birthdate1}
                  onChange={(e) => setBirthdate1(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Person 2 Birth Date</label>
                <Input
                  type="date"
                  value={birthdate2}
                  onChange={(e) => setBirthdate2(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <Button 
              onClick={calculateCompatibility}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={!birthdate1 || !birthdate2}
            >
              Calculate Compatibility
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Compatibility Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800">Person 1</h3>
                  <p><strong>Western Sign:</strong> {result.person1.sign}</p>
                  <p><strong>Chinese Animal:</strong> {result.person1.animal}</p>
                  <p><strong>Combo:</strong> {result.person1.combo}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Person 2</h3>
                  <p><strong>Western Sign:</strong> {result.person2.sign}</p>
                  <p><strong>Chinese Animal:</strong> {result.person2.animal}</p>
                  <p><strong>Combo:</strong> {result.person2.combo}</p>
                </div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">
                  Compatibility Score
                </h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {result.compatibility}%
                </div>
                <p className="text-gray-600">
                  {result.compatibility >= 90 ? '🌟 Perfect Match!' :
                   result.compatibility >= 80 ? '✨ Excellent Match!' :
                   result.compatibility >= 70 ? '💫 Good Match!' :
                   result.compatibility >= 60 ? '🤝 Mixed Compatibility' :
                   result.compatibility >= 50 ? '⚠️ Difficult Match' :
                   '❌ Avoid This Match'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-6">
          <Link href="/" className="text-purple-600 hover:text-purple-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
