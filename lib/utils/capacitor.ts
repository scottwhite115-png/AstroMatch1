/**
 * Utility functions for Capacitor detection and native app features
 */

/**
 * Check if the app is running in a Capacitor native app
 * Uses multiple detection methods for reliability
 */
export function isCapacitor(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  // Method 1: Check for Capacitor global
  if ((window as any).Capacitor) {
    return true
  }

  // Method 2: Check for Capacitor platform
  if ((window as any).Capacitor?.getPlatform) {
    return true
  }

  // Method 3: Check user agent for Capacitor
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  if (/Capacitor/i.test(userAgent)) {
    return true
  }

  // Method 4: Check if running in Android WebView
  if (/wv/i.test(userAgent)) {
    return true
  }

  // Method 5: Check for iOS WKWebView
  if (/iPhone|iPad|iPod/i.test(userAgent) && !(window as any).MSStream) {
    // Additional check for iOS WebView
    const standalone = (window.navigator as any).standalone
    if (standalone === true || standalone === false) {
      return true
    }
  }

  return false
}

/**
 * Get the platform name (ios, android, web)
 */
export function getPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') {
    return 'web'
  }

  if (isCapacitor()) {
    try {
      const platform = (window as any).Capacitor?.getPlatform()
      if (platform === 'ios' || platform === 'android') {
        return platform
      }
    } catch (e) {
      // Fall through to user agent detection
    }

    // Fallback to user agent detection
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    if (/android/i.test(userAgent)) {
      return 'android'
    }
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      return 'ios'
    }
  }

  return 'web'
}

/**
 * Get the appropriate redirect URL for OAuth callbacks
 */
export function getOAuthRedirectUrl(): string {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '')).trim()

  if (isCapacitor()) {
    // For mobile apps, use HTTPS URL that matches AndroidManifest.xml deep link configuration
    // The AndroidManifest has intent filters for both astromatch:// and https:// schemes
    // When Google redirects to this HTTPS URL, Android will open it in the app via deep link
    const platform = getPlatform()
    if (platform === 'android' || platform === 'ios') {
      // Use HTTPS URL - AndroidManifest.xml is configured to handle this as a deep link
      // This ensures OAuth callback returns to app, not Chrome
      return `${baseUrl}/auth/callback-mobile`
    }
  }

  // For web, use standard callback
  return `${baseUrl}/auth/callback`
}

