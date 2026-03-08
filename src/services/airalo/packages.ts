import { env } from '../../config/env';
import { getAiraloToken } from './auth';

export async function getPackages(countryCode?: string): Promise<unknown> {
  const token = await getAiraloToken();

  const url = new URL(`${env.AIRALO_BASE_URL}/packages`);
  if (countryCode) {
    url.searchParams.set('country', countryCode);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Airalo getPackages failed: ${response.status} ${text}`);
  }

  return response.json();
}
