"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Profile {
  id: string
  full_name: string
  bio?: string
  age?: number
  zodiac_sign?: string
  chinese_zodiac?: string
  location?: string
  interests?: string[]
  photos?: string[]
  created_at: string
  updated_at: string
}

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        let targetUserId = userId
        if (!targetUserId) {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (!user) {
            setError("Not authenticated")
            return
          }
          targetUserId = user.id
        }

        const { data, error } = await supabase.from("profiles").select("*").eq("id", targetUserId).single()

        if (error) {
          if (error.code === "PGRST116") {
            // Profile doesn't exist yet
            setProfile(null)
          } else {
            throw error
          }
        } else {
          setProfile(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId, supabase])

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      // Refresh profile data
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (data) setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  return { profile, loading, error, updateProfile }
}
