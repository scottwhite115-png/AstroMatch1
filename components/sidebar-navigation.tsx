"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

const Heart = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const DiscoveryStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const MessageCircle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const Settings = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
)

const Sparkles = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M19 12l.75 2.25L22 15l-2.25.75L19 18l-.75-2.25L16 15l2.25-.75L19 12z" />
    <path d="M6 21l.75-2.25L9 18l-2.25-.75L6 15l-.75 2.25L3 18l2.25.75L6 21z" />
  </svg>
)

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

const Users = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export function SidebarNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  // Check for profile photo on mount and when page changes
  useEffect(() => {
    const checkProfilePhoto = () => {
      if (typeof window !== 'undefined') {
        const savedPhoto = localStorage.getItem('profilePhoto1')
        setProfilePhoto(savedPhoto)
      }
    }

    checkProfilePhoto()

    // Listen for photo updates
    const handlePhotoUpdate = () => {
      checkProfilePhoto()
    }

    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate)
    window.addEventListener('storage', handlePhotoUpdate)

    return () => {
      window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate)
      window.removeEventListener('storage', handlePhotoUpdate)
    }
  }, [pathname])

  const navItems = [
    {
      icon: DiscoveryStar,
      label: "Matches",
      path: "/matches",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/messages",
    },
    {
      icon: Users,
      label: "Community",
      path: "/community",
    },
    {
      icon: FourPointedStar,
      label: "Astrology",
      path: "/astrology",
    },
    {
      icon: Settings,
      label: "Profile",
      path: "/profile/profile",
    },
  ]

  return (
    <div className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50 w-64 flex-col bg-black/20 dark:bg-black/20 backdrop-blur-sm border-r border-white/10">
      <div className="flex flex-col gap-2 p-4 mt-8">
        {navItems.map((item) => {
          const Icon = item.icon
          // Check if current path matches the nav item or if it's a profile sub-route
          const isActive = pathname === item.path || (item.path === "/profile/profile" && pathname.startsWith("/profile/"))

          return (
            <button
              type="button"
              key={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
              onClick={() => router.push(item.path)}
            >
              {item.path === "/profile/profile" && profilePhoto ? (
                // Show circular profile photo
                <div className={`w-9 h-9 rounded-full overflow-hidden ${isActive ? 'ring-2 ring-white' : ''}`}>
                  <img 
                    src={profilePhoto} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Icon className="w-6 h-6" />
              )}
              <span className="text-base font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
