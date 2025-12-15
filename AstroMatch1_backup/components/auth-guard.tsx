"use client"

import type React from "react"

import { useAuth } from "@/lib/contexts/auth-context"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      fallback || (
        <div className="astrology-cosmic-bg min-h-screen w-full fixed inset-0">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-center">
              <FourPointedStar className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
              <p>Loading...</p>
            </div>
          </div>
        </div>
      )
    )
  }

  if (!user) {
    return null // Let the auth redirect handle this
  }

  return <>{children}</>
}
