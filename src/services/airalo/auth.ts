import { env } from '../../config/env';
import { AiraloTokenResponse } from '../../types/airalo';

const TOKEN_EXPIRY_BUFFER_SECONDS = 60;

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

export async function getAiraloToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  const params = new URLSearchParams({
    client_id: env.AIRALO_CLIENT_ID,
    client_secret: env.AIRALO_CLIENT_SECRET,
    grant_type: 'client_credentials',
  });

  const response = await fetch(`${env.AIRALO_BASE_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Airalo auth failed: ${response.status} ${text}`);
  }

  const json = (await response.json()) as AiraloTokenResponse;
  const expiresIn = json.data.expires_in;

  cachedToken = {
    token: json.data.token,
    expiresAt: now + (expiresIn - TOKEN_EXPIRY_BUFFER_SECONDS) * 1000,
  };

  return cachedToken.token;
}
