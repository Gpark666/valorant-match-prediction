const BASE_URL = 'http://127.0.0.1:8001';

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data as T;
}
