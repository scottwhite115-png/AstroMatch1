'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Simple immediate redirect
    router.replace("/matches")
  }, [router])

  return null // Don't render anything, just redirect
}
