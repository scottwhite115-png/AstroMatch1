export interface BlockedUser {
  id: number
  name: string
  age: number
  photo: string
  blockedDate: string
}

export function getBlockedUsers(): BlockedUser[] {
  if (typeof window === "undefined") return []
  const blocked = localStorage.getItem("blockedUsers")
  return blocked ? JSON.parse(blocked) : []
}

export function blockUser(user: BlockedUser): void {
  const blocked = getBlockedUsers()
  const alreadyBlocked = blocked.some((u) => u.id === user.id)
  if (!alreadyBlocked) {
    blocked.push(user)
    localStorage.setItem("blockedUsers", JSON.stringify(blocked))
  }
}

export function unblockUser(userId: number): void {
  const blocked = getBlockedUsers()
  const filtered = blocked.filter((u) => u.id !== userId)
  localStorage.setItem("blockedUsers", JSON.stringify(filtered))
}

export function isUserBlocked(userId: number): boolean {
  const blocked = getBlockedUsers()
  return blocked.some((u) => u.id === userId)
}
