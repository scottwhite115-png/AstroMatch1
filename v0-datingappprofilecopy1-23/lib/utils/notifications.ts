// Push Notification Utility
// This handles browser push notification permissions and sending notifications

export interface NotificationPreferences {
  messages: boolean
}

// Request push notification permission from the browser
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("[v0] Push notifications are not supported in this browser")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

// Check if notifications are currently enabled
export function areNotificationsEnabled(): boolean {
  return "Notification" in window && Notification.permission === "granted"
}

// Save notification preferences to localStorage
export function saveNotificationPreferences(preferences: NotificationPreferences): void {
  localStorage.setItem("notificationPreferences", JSON.stringify(preferences))
}

// Load notification preferences from localStorage
export function loadNotificationPreferences(): NotificationPreferences {
  const saved = localStorage.getItem("notificationPreferences")
  if (saved) {
    return JSON.parse(saved)
  }
  return { messages: true } // Default to enabled
}

// Send a test notification (for demonstration purposes)
export function sendTestNotification(title: string, body: string): void {
  if (!areNotificationsEnabled()) {
    console.log("[v0] Notifications are not enabled")
    return
  }

  new Notification(title, {
    body,
    icon: "/icon.png", // You can add your app icon here
    badge: "/badge.png",
  })
}

// TODO: Backend Integration Point
// When you integrate with your backend in Cursor, you'll need to:
// 1. Register the device token with your backend server
// 2. Set up a push notification service (Firebase Cloud Messaging, OneSignal, etc.)
// 3. Send the user's notification preferences to the backend
// 4. Backend will send push notifications when new messages arrive
//
// Example backend integration:
// export async function registerDeviceForPushNotifications(userId: string, deviceToken: string) {
//   await fetch('/api/notifications/register', {
//     method: 'POST',
//     body: JSON.stringify({ userId, deviceToken, preferences: loadNotificationPreferences() })
//   })
// }
//
// export async function sendMessageNotification(recipientId: string, senderName: string, message: string) {
//   await fetch('/api/notifications/send', {
//     method: 'POST',
//     body: JSON.stringify({ recipientId, title: `New message from ${senderName}`, body: message })
//   })
// }
