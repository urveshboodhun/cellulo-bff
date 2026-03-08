import { env } from '../../config/env'
import { ApiResponse } from '../../types/common'

const MAX_TTL_SECONDS = 86400 // 24-hour cap per Airalo requirement
const TTL_BUFFER_SECONDS = 60 // refresh 60 seconds before expiry

interface AiraloTokenData {
  token_type: string
  expires_in: number
  access_token: string
}

interface TokenCache {
  token: string
  expiresAt: number
}

let tokenCache: TokenCache | null = null
let inflightRequest: Promise<string> | null = null

export async function getAiraloToken(): Promise<string> {
  const now = Date.now()

  if (tokenCache && now < tokenCache.expiresAt) {
    return tokenCache.token
  }

  // Deduplicate concurrent token fetches
  if (inflightRequest) {
    return inflightRequest
  }

  inflightRequest = fetchToken().finally(() => {
    inflightRequest = null
  })

  return inflightRequest
}

async function fetchToken(): Promise<string> {
  const now = Date.now()

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: env.AIRALO_CLIENT_ID,
    client_secret: env.AIRALO_CLIENT_SECRET,
  })

  const response = await fetch(`${env.AIRALO_BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error(`Airalo token request failed: ${response.status} ${response.statusText}`)
  }

  const json = (await response.json()) as ApiResponse<AiraloTokenData>
  const { access_token, expires_in } = json.data

  const ttl = Math.min(expires_in, MAX_TTL_SECONDS) - TTL_BUFFER_SECONDS
  tokenCache = {
    token: access_token,
    expiresAt: now + ttl * 1000,
  }

  return access_token
}
