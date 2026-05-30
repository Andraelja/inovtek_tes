import { apiFetch } from './client'

type PipelineStage = 'applied' | 'interview' | 'hired'

export type PipelineItem = {
  application_id: number
  job_id: number
  job_title: string
  candidate_name: string
  stage: PipelineStage
  created_at: string
}

export type Pipeline = {
  applied: PipelineItem[]
  interview: PipelineItem[]
  hired: PipelineItem[]
}

export async function getPipelineApi(token: string) {
  const res = await apiFetch<Pipeline>('/api/v1/pipeline', { token })
  return res.data
}

