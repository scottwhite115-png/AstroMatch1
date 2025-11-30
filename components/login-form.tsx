"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (onSubmit) {
        await onSubmit(email, password)
      } else {
        // Default login logic
        console.log("Login attempt:", { email, password })
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400 focus:ring-yellow-400/20"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400 focus:ring-yellow-400/20 pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      {/* Additional Options */}
      <div className="mt-6 space-y-4">
        <div className="text-center">
          <Link href="/forgot-password" className="text-sm text-white/70 hover:text-white transition-colors">
            Forgot your password?
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-white/60">or</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-white/70">
            Don't have an account?{" "}
            <Link href="/signup" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Astrology Quote */}
      <div className="mt-8 text-center">
        <p className="text-xs text-white/50 italic max-w-xs mx-auto">"The stars align for those who dare to love"</p>
      </div>
    </div>
  )
}
