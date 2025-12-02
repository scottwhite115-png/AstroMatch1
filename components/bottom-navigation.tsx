"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

const Heart = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const HeartFilled = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

const DiscoveryStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const DizzyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Large star */}
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    {/* Small stars around */}
    <circle cx="18" cy="6" r="1" fill="currentColor" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="18" cy="18" r="1" fill="currentColor" />
  </svg>
)

const ProfileStack = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="9" r="4" />
    <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
    <circle cx="18" cy="7" r="3" opacity="0.5" />
    <circle cx="6" cy="7" r="3" opacity="0.5" />
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

const Home = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
)

const Zap = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const Flame = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
)

export function BottomNavigation() {
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
      icon: Heart,
      label: "Discover",
      path: "/matches",
    },
    {
      icon: MessageCircle,
      label: "Connections",
      path: "/messages",
    },
    {
      icon: Users,
      label: "Community",
      path: "/community",
    },
    {
      icon: FourPointedStar,
      label: "AstroLab",
      path: "/astrology",
    },
    {
      icon: Settings,
      label: "Profile",
      path: "/profile/profile",
    },
  ]

  const handleNavClick = (path: string) => {
    // If clicking Settings while already on profile page, trigger edit tab switch
    if (path === "/profile/profile" && pathname === "/profile/profile") {
      window.dispatchEvent(new Event("switchToEditTab"))
    } else {
      router.push(path)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-safe">
      {/* Flat navigation bar */}
      <div className="relative w-full h-20">
        {/* Flat background */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md z-0 pointer-events-none" />
        
        {/* Navigation buttons with flat positioning */}
        <div className="relative grid grid-cols-5 w-full h-full items-start pt-2 z-10">
          {navItems.map((item, index) => {
            const Icon = item.icon
            // Check if current path matches the nav item or if it's a profile sub-route
            const isActive = pathname === item.path || (item.path === "/profile/profile" && pathname.startsWith("/profile/"))
            
            // Use label directly
            const displayLabel = item.label

            return (
              <button
                type="button"
                key={item.path}
                className="flex flex-col items-center justify-center relative transition-all duration-300 gap-1 z-10"
                onClick={() => handleNavClick(item.path)}
              >
                {/* Icon/Photo container */}
                <div className="relative flex items-center justify-center w-12 h-12 transition-all duration-300">
                  {item.path === "/profile/profile" && profilePhoto ? (
                    // Show circular profile photo
                    <div className={`w-10 h-10 rounded-full overflow-hidden ${isActive ? 'border-2 border-white' : ''}`}>
                      <img 
                        src={profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    // Show icon
                    <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-white/70'}`} />
                  )}
                </div>
                {/* Label */}
                <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/70'}`}>
                  {displayLabel}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}