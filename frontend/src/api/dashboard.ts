import { apiFetch } from './client'

type DashboardStats = {
  total_jobs: number
  total_candidates: number
  total_applications: number
}

export async function getDashboardStatsApi(token: string) {
  const res = await apiFetch<DashboardStats>('/api/v1/dashboard/stats', { token })
  return res.data
}

