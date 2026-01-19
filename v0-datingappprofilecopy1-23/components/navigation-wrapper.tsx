"use client"

import { usePathname } from "next/navigation"
import { BottomNavigation } from "./bottom-navigation"
import { SidebarNavigation } from "./sidebar-navigation"

export function NavigationWrapper() {
  const pathname = usePathname()

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
