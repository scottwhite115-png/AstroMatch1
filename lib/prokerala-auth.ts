// Prokerala OAuth authentication helper
let cachedToken: { token: string; expiresAt: number } | null = null

export async function getProkeralaToken(): Promise<string> {
  const PROKERALA_API_KEY = process.env.PROKERALA_API_KEY
  const PROKERALA_CLIENT_ID = process.env.PROKERALA_CLIENT_ID

  if (!PROKERALA_API_KEY || !PROKERALA_CLIENT_ID) {
    throw new Error("Prokerala credentials not configured")
  }

  // Return cached token if still valid (with 5 minute buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.token
  }

  // Get new token
  const tokenResponse = await fetch("https://api.prokerala.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: PROKERALA_CLIENT_ID,
      client_secret: PROKERALA_API_KEY,
    }),
  })

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text()
    throw new Error(`Failed to get Prokerala token: ${error}`)
  }

  const tokenData = await tokenResponse.json()
  
  // Cache the token (expires_in is in seconds, default 3600 = 1 hour)
  cachedToken = {
    token: tokenData.access_token,
    expiresAt: Date.now() + (tokenData.expires_in || 3600) * 1000,
  }

  return tokenData.access_token
}

