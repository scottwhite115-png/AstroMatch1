export interface Conversation {
  id: string
  userId: string
  userName: string
  userPhoto: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  messages: Message[]
  isNewMatch?: boolean
  westernSign?: string
  easternSign?: string
  matchedAt?: string // ISO timestamp of when the match was created
}

export interface Message {
  id: number
  text: string
  sent: boolean
  timestamp: string
}

export function getConversations(): Conversation[] {
  try {
    const conversations = localStorage.getItem("conversations")
    return conversations ? JSON.parse(conversations) : []
  } catch (error) {
    console.error("[v0] Error loading conversations:", error)
    return []
  }
}

export function getConversation(userId: string): Conversation | null {
  const conversations = getConversations()
  return conversations.find((conv) => conv.userId === userId) || null
}

export function createConversation(userId: string, userName: string, userPhoto: string): Conversation {
  console.log("[v0] createConversation called with:", { userId, userName, userPhoto })
  const conversations = getConversations()

  // Check if conversation already exists
  const existingIndex = conversations.findIndex((conv) => conv.userId === userId)
  if (existingIndex !== -1) {
    const existing = conversations[existingIndex]
    console.log("[v0] Conversation already exists:", existing)
    
    // Update the photo URL if it's different
    if (existing.userPhoto !== userPhoto) {
      console.log("[v0] Updating photo URL from", existing.userPhoto, "to", userPhoto)
      existing.userPhoto = userPhoto
      conversations[existingIndex] = existing
      localStorage.setItem("conversations", JSON.stringify(conversations))
    }
    
    return existing
  }

  // Create new conversation
  const newConversation: Conversation = {
    id: userId,
    userId,
    userName,
    userPhoto,
    lastMessage: "",
    timestamp: "Just now",
    unread: 0,
    online: true,
    messages: [],
  }

  console.log("[v0] Creating new conversation:", newConversation)
  conversations.push(newConversation)
  localStorage.setItem("conversations", JSON.stringify(conversations))

  return newConversation
}

export function updateConversation(userId: string, message: string, sent: boolean): void {
  const conversations = getConversations()
  const conversation = conversations.find((conv) => conv.userId === userId)

  if (!conversation) {
    console.error("[v0] Conversation not found:", userId)
    return
  }

  // Add message to conversation
  const newMessage: Message = {
    id: conversation.messages.length + 1,
    text: message,
    sent,
    timestamp: "Just now",
  }

  conversation.messages.push(newMessage)
  conversation.lastMessage = message
  conversation.timestamp = "Just now"

  // If message is received (not sent), increment unread count
  if (!sent) {
    conversation.unread = (conversation.unread || 0) + 1
  }

  localStorage.setItem("conversations", JSON.stringify(conversations))
}

export function clearUnreadCount(userId: string): void {
  const conversations = getConversations()
  const conversation = conversations.find((conv) => conv.userId === userId)

  if (conversation) {
    conversation.unread = 0
    localStorage.setItem("conversations", JSON.stringify(conversations))
  }
}

export function deleteConversation(userId: string): void {
  const conversations = getConversations()
  const filtered = conversations.filter((conv) => conv.userId !== userId)
  localStorage.setItem("conversations", JSON.stringify(filtered))
}
