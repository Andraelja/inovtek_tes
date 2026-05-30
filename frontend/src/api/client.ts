const API_URL = import.meta.env.VITE_API_URL as string | undefined

if (!API_URL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_URL is not set. Using http://localhost:8080')
}

export const apiBaseUrl = API_URL || 'http://localhost:8080'

export type ApiResponse<T> = {
  success: boolean
  message?: string
  data: T
}

export async function apiFetch<T>(path: string, opts?: { token?: string; method?: string; body?: unknown; query?: Record<string, string | undefined> }) {
  const url = new URL(apiBaseUrl + path)
  if (opts?.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, v)
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (opts?.token) headers['Authorization'] = `Bearer ${opts.token}`

  const res = await fetch(url.toString(), {
    method: opts?.method || 'GET',
    headers,
    body: opts?.body ? JSON.stringify(opts.body) : undefined
  })

  const text = await res.text()
  let json: any
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = null
  }

  if (!res.ok) {
    const msg = json?.message || json?.error || `Request failed with status ${res.status}`
    throw new Error(msg)
  }

  // backend wrapper: {success,message,data}
  return json as ApiResponse<T>
}

