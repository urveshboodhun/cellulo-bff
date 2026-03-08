import { env } from '../../config/env';
import { CreateOrderPayload } from '../../types/common';
import { getAiraloToken } from './auth';

export async function createOrder(payload: CreateOrderPayload): Promise<unknown> {
  const token = await getAiraloToken();

  const response = await fetch(`${env.AIRALO_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Airalo createOrder failed: ${response.status} ${text}`);
  }

  return response.json();
}

export async function getOrders(): Promise<unknown> {
  const token = await getAiraloToken();

  const response = await fetch(`${env.AIRALO_BASE_URL}/orders`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Airalo getOrders failed: ${response.status} ${text}`);
  }

  return response.json();
}
