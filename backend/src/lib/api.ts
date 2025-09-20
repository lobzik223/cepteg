// src/lib/api.ts
const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const TENANT_ID = process.env.EXPO_PUBLIC_TENANT_ID ?? '1';

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': TENANT_ID,
      ...(init.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${txt || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(p: string) => http<T>(p),
  post: <T>(p: string, body: any) => http<T>(p, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(p: string, body: any) => http<T>(p, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(p: string) => http<T>(p, { method: 'DELETE' }),
};
