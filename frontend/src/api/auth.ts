import { apiFetch } from './client'

type LoginPayload = { email: string; password: string }

type LoginResponse = {
  token: string
  user: {
    id: number
    name: string
    email: string
    role: string
    is_active: boolean
    created_at: string
    updated_at: string
  }
}

export async function loginApi(email: string, password: string) {
  const res = await apiFetch<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password } satisfies LoginPayload
  })
  return res.data
}

