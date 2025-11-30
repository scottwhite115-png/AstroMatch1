"use client"

import { usePathname } from "next/navigation"
import { BottomNavigation } from "./bottom-navigation"
import { SidebarNavigation } from "./sidebar-navigation"

export function NavigationWrapper() {
  const pathname = usePathname()
  
  // Add safety check for pathname
  if (!pathname) {
    return null
  }

  const hideNavigation =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/auth/verify-email" ||
    (pathname.startsWith("/messages/") && pathname !== "/messages")

  if (hideNavigation) {
    return null
  }

  return (
    <>
      <BottomNavigation />
      <SidebarNavigation />
    </>
  )
}
