// src/lib/fetcher.ts
export async function fetcher(url: string, opts: RequestInit = {}) {
  const res = await fetch(url, { credentials: 'same-origin', ...opts })
  if (!res.ok) {
    // try parse json
    let err = {}
    try { err = await res.json() } catch {}
    throw err
  }
  return res.json().catch(() => null)
}
