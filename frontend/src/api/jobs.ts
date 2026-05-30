import { apiFetch } from './client'

export type Job = {
  id: number
  title: string
  department?: string
  status: 'open' | 'closed'
  created_at: string
  updated_at: string
}

export async function listJobsApi(token: string, opts?: { search?: string; status?: string }) {
  const res = await apiFetch<Job[]>('/api/v1/jobs', { token, query: opts as any })
  return res.data
}

export async function createJobApi(token: string, payload: { title: string; department?: string; status?: 'open' | 'closed' }) {
  const res = await apiFetch<Job>('/api/v1/jobs', { token, method: 'POST', body: payload })
  return res.data
}

