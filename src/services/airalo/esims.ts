import { env } from '../../config/env';
import { getAiraloToken } from './auth';

export async function getEsims(): Promise<unknown> {
  const token = await getAiraloToken();

  const response = await fetch(`${env.AIRALO_BASE_URL}/sims`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Airalo getEsims failed: ${response.status} ${text}`);
  }

  return response.json();
}

export async function getEsimByIccid(iccid: string): Promise<unknown> {
  const token = await getAiraloToken();

  const response = await fetch(`${env.AIRALO_BASE_URL}/sims/${encodeURIComponent(iccid)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Airalo getEsimByIccid failed: ${response.status} ${text}`);
  }

  return response.json();
}
