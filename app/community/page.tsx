"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Redirect to default topic page
export default function CommunityPage() {
  const router = useRouter()
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    router.replace("/community/general-astrology")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <p className="text-slate-400">Loading...</p>
    </div>
  )
}
