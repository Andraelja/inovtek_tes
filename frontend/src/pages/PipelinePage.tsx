import { useEffect, useMemo, useState } from 'react'
import { getPipelineApi, type PipelineItem, type Pipeline } from '../api/pipeline'
import { useAuth } from '../state/auth'

function stageTitle(s: PipelineItem['stage']) {
  if (s === 'applied') return 'Applied'
  if (s === 'interview') return 'Interview'
  return 'Hired'
}

function stageOrder(s: PipelineItem['stage']) {
  return s === 'applied' ? 0 : s === 'interview' ? 1 : 2
}

export default function PipelinePage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [pipeline, setPipeline] = useState<Pipeline>({ applied: [], interview: [], hired: [] })

  useEffect(() => {
    if (!token) return
    setLoading(true)
    setErr(null)
    getPipelineApi(token)
      .then(setPipeline)
      .catch((e) => setErr(e?.message || 'Failed to load pipeline'))
      .finally(() => setLoading(false))
  }, [token])

  const columns = useMemo(
    () =>
      [
        { key: 'applied' as const, label: 'Applied' },
        { key: 'interview' as const, label: 'Interview' },
        { key: 'hired' as const, label: 'Hired' }
      ],
    []
  )

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Candidate Pipeline</h1>
        <p className="mt-1 text-sm text-slate-600">Lihat kandidat berdasarkan tahap proses.</p>
      </div>

      {err && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{err}</div>}

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {columns.map((col) => (
          <PipelineColumn
            key={col.key}
            title={col.label}
            items={pipeline[col.key]}
            loading={loading}
          />
        ))}
      </div>

      {!loading && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-800">Note</div>
          <div className="mt-1 text-sm text-slate-600">
            Untuk demo, pipeline diambil dari data <span className="font-medium">applications</span> backend.
          </div>
        </div>
      )}
    </div>
  )
}

function PipelineColumn({ title, items, loading }: { title: string; items: PipelineItem[]; loading: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="font-bold">{title}</div>
          <div className="text-xs font-semibold text-slate-600">{loading ? '—' : items.length}</div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="text-sm text-slate-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-slate-500">No candidates.</div>
        ) : (
          items
            .slice()
            .sort((a, b) => stageOrder(a.stage) - stageOrder(b.stage))
            .map((it) => (
              <div key={it.application_id} className="rounded-xl border border-slate-200 p-3 hover:bg-slate-50/70 transition">
                <div className="text-sm font-semibold text-slate-900">{it.candidate_name}</div>
                <div className="mt-1 text-xs text-slate-600">{it.job_title}</div>
                <div className="mt-2 text-xs text-slate-500">{formatDate(it.created_at)}</div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: '2-digit' })
  } catch {
    return iso
  }
}

